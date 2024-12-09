import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    console.error('No user found:', error);
    throw new Error('No user found');
  }
  return user;
};

export const getFamilyMember = async (userId: string) => {
  console.log('Fetching family member for user:', userId);
  const { data: familyMembers, error } = await supabase
    .from('family_members')
    .select('family_id')
    .eq('user_id', userId);

  console.log('Family member query result:', { familyMembers, error });
  return { familyMembers, error };
};

export const createNewFamily = async (userId: string) => {
  console.log("Creating new family for user:", userId);
  
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
  return newFamily;
};

export const createFamilyMember = async (familyId: string, userId: string) => {
  console.log("Creating family member:", { familyId, userId });
  
  const { error: memberError } = await supabase
    .from('family_members')
    .insert([{ 
      family_id: familyId, 
      user_id: userId 
    }]);

  if (memberError) {
    console.error("Error creating family member:", memberError);
    throw memberError;
  }

  console.log("Successfully created family member");
};

export const getFamilyMembers = async (familyId: string) => {
  console.log('Fetching members for family:', familyId);
  
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
  return members;
};