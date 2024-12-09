import { supabase } from "@/integrations/supabase/client";

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
  if (!user) {
    console.error('No user found');
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
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching family member:', error);
    throw error;
  }
  
  return { familyMembers: familyMembers || [], error: null };
};

export const createNewFamily = async (userId: string) => {
  console.log("Creating new family for user:", userId);
  
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

  const { error: memberError } = await supabase
    .from('family_members')
    .insert([{
      family_id: family.id,
      user_id: userId
    }]);

  if (memberError) {
    console.error("Error creating family member:", memberError);
    // Try to rollback family creation
    await supabase.from('families').delete().eq('id', family.id);
    throw memberError;
  }

  return family;
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
    return [];
  }

  console.log('Found family members:', members);
  return members || [];
};