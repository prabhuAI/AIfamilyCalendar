import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useFamilyData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyData, isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      try {
        console.log('Starting family data fetch...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No user found');
          throw new Error('No user found');
        }
        console.log('Current user:', user.id);

        // First try to get the user's family
        const { data: familyMembers, error: memberError } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id);

        console.log('Family members query result:', { familyMembers, memberError });

        // If user has no family, create one
        if (!familyMembers || familyMembers.length === 0) {
          console.log("No family found, creating new family");
          
          // First create the family
          const { data: newFamily, error: familyError } = await supabase
            .from('families')
            .insert([{ family_name: 'My Family' }])
            .select()
            .single();

          if (familyError) {
            console.error("Error creating family:", familyError);
            throw familyError;
          }

          console.log("Created new family:", newFamily);

          // Then create the family member entry
          const { error: memberInsertError } = await supabase
            .from('family_members')
            .insert([{ 
              family_id: newFamily.id, 
              user_id: user.id 
            }]);

          if (memberInsertError) {
            console.error("Error creating family member:", memberInsertError);
            throw memberInsertError;
          }

          console.log("Successfully created family and member");
          return { familyId: newFamily.id, members: [] };
        }

        const familyId = familyMembers[0].family_id;
        console.log('Found family ID:', familyId);

        // Get all members of the family
        const { data: members, error: membersError } = await supabase
          .from('family_members')
          .select(`
            user_id,
            profiles:profiles(full_name, nickname)
          `)
          .eq('family_id', familyId);

        if (membersError) {
          console.error('Error fetching members:', membersError);
          throw membersError;
        }

        console.log('Found family members:', members);
        return { familyId, members };
      } catch (error: any) {
        console.error('Error in family data fetch:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load family data",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      if (!familyData?.familyId) {
        throw new Error('No family ID found');
      }
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('family_id', familyData.familyId)
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
      console.error("Error removing family member:", error);
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
    removeMember
  };
};