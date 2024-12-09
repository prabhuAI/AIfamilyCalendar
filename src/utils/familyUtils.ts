import { supabase } from "@/integrations/supabase/client";

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log('getCurrentUser result:', { user, error });
  
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
  try {
    const { data, error } = await supabase
      .from('family_members')
      .select('family_id')
      .eq('user_id', userId)
      .maybeSingle(); // Using maybeSingle() instead of single() to handle no results case

    console.log('Family member query result:', { data, error });
    
    if (error) {
      console.error('Error fetching family member:', error);
      return { familyMembers: null, error };
    }
    
    return { familyMembers: data, error: null };
  } catch (error) {
    console.error('Exception in getFamilyMember:', error);
    return { familyMembers: null, error };
  }
};

export const createNewFamily = async (userId: string) => {
  console.log("Creating new family for user:", userId);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user found');
  
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

    console.log("Created family:", family);

    // Then create the family member association
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

    console.log("Successfully created family and member association");
    return family;
  } catch (error) {
    console.error('Exception in createNewFamily:', error);
    throw error;
  }
};

export const getFamilyMembers = async (familyId: string) => {
  console.log('Fetching members for family:', familyId);
  
  try {
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
  } catch (error) {
    console.error('Exception in getFamilyMembers:', error);
    return [];
  }
};