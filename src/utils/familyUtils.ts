import { supabase } from "@/integrations/supabase/client";

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
  
  try {
    const { data, error } = await supabase
      .from('families')
      .insert([{ family_name: 'My Family' }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from family creation');

    console.log("Created new family:", data);
    return data;
  } catch (error) {
    console.error("Error creating family:", error);
    throw error;
  }
};

export const createFamilyMember = async (familyId: string, userId: string) => {
  console.log("Creating family member:", { familyId, userId });
  
  const { error } = await supabase
    .from('family_members')
    .insert([{ 
      family_id: familyId, 
      user_id: userId 
    }]);

  if (error) {
    console.error("Error creating family member:", error);
    throw error;
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