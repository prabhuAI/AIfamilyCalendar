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
  
  // Return empty array instead of throwing error when no members found
  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  
  return { familyMembers: familyMembers || [], error: null };
};

export const createNewFamily = async (userId: string) => {
  console.log("Creating new family for user:", userId);
  
  try {
    // First create the family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert([{ 
        family_name: 'My Family'
      }])
      .select()
      .single();

    if (familyError) {
      console.error("Error creating family:", familyError);
      throw familyError;
    }

    if (!family) {
      throw new Error('No data returned from family creation');
    }

    // Then create the family member entry
    const { error: memberError } = await supabase
      .from('family_members')
      .insert([{
        family_id: family.id,
        user_id: userId
      }]);

    if (memberError) {
      console.error("Error creating family member:", memberError);
      throw memberError;
    }

    console.log("Created new family:", family);
    return family;
  } catch (error) {
    console.error("Error in createNewFamily:", error);
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
  return members || [];
};