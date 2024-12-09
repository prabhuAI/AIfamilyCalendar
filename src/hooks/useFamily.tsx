import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useFamilyData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyData, isLoading, refetch } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      try {
        console.log('Starting family data fetch...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          return { familyId: null, members: [] };
        }
        
        if (!user) {
          console.log('No authenticated user found');
          return { familyId: null, members: [] };
        }

        console.log('Got user:', user.id);
        
        // First, get the user's family
        const { data: familyMember, error: familyError } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', user.id)
          .single();

        if (familyError) {
          console.error('Error fetching family:', familyError);
          
          // If no family exists, create one
          console.log('Creating new family...');
          const { data: newFamily, error: createFamilyError } = await supabase
            .from('families')
            .insert([{ family_name: 'My Family' }])
            .select()
            .single();

          if (createFamilyError) {
            console.error('Error creating family:', createFamilyError);
            return { familyId: null, members: [] };
          }

          // Create family member entry for current user
          const { error: createMemberError } = await supabase
            .from('family_members')
            .insert([{
              family_id: newFamily.id,
              user_id: user.id
            }]);

          if (createMemberError) {
            console.error('Error creating family member:', createMemberError);
            return { familyId: null, members: [] };
          }

          return { familyId: newFamily.id, members: [] };
        }

        const familyId = familyMember.family_id;
        console.log('Found family ID:', familyId);

        // Then get all members of the family
        const { data: members, error: membersError } = await supabase
          .from('family_members')
          .select(`
            user_id,
            profiles:profiles(full_name, nickname)
          `)
          .eq('family_id', familyId);

        if (membersError) {
          console.error('Error fetching members:', membersError);
          return { familyId, members: [] };
        }

        console.log('Found family members:', members);
        return { familyId, members: members || [] };
      } catch (error) {
        console.error('Unexpected error in family data fetch:', error);
        return { familyId: null, members: [] };
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      if (!familyData?.familyId) {
        throw new Error('No family ID found');
      }

      console.log('Removing member:', userId, 'from family:', familyData.familyId);
      
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
    familyData: familyData || { familyId: null, members: [] },
    isLoading,
    removeMember,
    refetch
  };
};