import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  getCurrentUser,
  getFamilyMember,
  createNewFamily,
  createFamilyMember,
  getFamilyMembers,
} from "@/utils/familyUtils";

export const useFamilyData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: familyData, isLoading } = useQuery({
    queryKey: ['family'],
    queryFn: async () => {
      try {
        console.log('Starting family data fetch...');
        const user = await getCurrentUser();
        
        // Get user's family membership
        const { familyMembers } = await getFamilyMember(user.id);

        // If user has no family, create one
        if (!familyMembers || familyMembers.length === 0) {
          const newFamily = await createNewFamily(user.id);
          await createFamilyMember(newFamily.id, user.id);
          return { familyId: newFamily.id, members: [] };
        }

        const familyId = familyMembers[0].family_id;
        console.log('Found family ID:', familyId);

        // Get all members of the family
        const members = await getFamilyMembers(familyId);

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