import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useFamilyData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyData, isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // First try to get the user's family
      const { data: familyMembers, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      // If user has no family, create one
      if (!familyMembers || familyMembers.length === 0) {
        // First create the family
        const { data: newFamily, error: familyError } = await supabase
          .from('families')
          .insert([{ family_name: 'My Family' }])
          .select()
          .single();

        if (familyError) throw familyError;

        // Then create the family member entry
        const { error: memberInsertError } = await supabase
          .from('family_members')
          .insert([{ 
            family_id: newFamily.id, 
            user_id: user.id 
          }]);

        if (memberInsertError) throw memberInsertError;

        return { familyId: newFamily.id, members: [] };
      }

      const familyId = familyMembers[0].family_id;

      // Get all members of the family
      const { data: members, error: membersError } = await supabase
        .from('family_members')
        .select(`
          user_id,
          profiles:profiles(full_name, nickname)
        `)
        .eq('family_id', familyId);

      if (membersError) throw membersError;

      return { familyId, members };
    }
  });

  const addMember = useMutation({
    mutationFn: async (email: string) => {
      const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
      if (userError) throw userError;

      const user = users?.find(u => u.email === email);
      if (!user) throw new Error('User not found');

      const { error: memberError } = await supabase
        .from('family_members')
        .insert([{ family_id: familyData?.familyId, user_id: user.id }]);

      if (memberError) throw memberError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      toast({
        title: "Success",
        description: "Family member added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('family_id', familyData?.familyId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family'] });
      toast({
        title: "Success",
        description: "Family member removed successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    familyData,
    isLoading,
    addMember,
    removeMember
  };
};