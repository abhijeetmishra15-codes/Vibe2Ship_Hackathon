import { supabase } from '@/lib/supabase';

/**
 * Creates a user profile record in the database.
 * @param {object} user - The Supabase auth user object.
 * @returns {Promise<object>} The created profile object.
 */
export const createProfile = async (user) => {
  if (!user) throw new Error('User object is required to create a profile.');
  const name = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id,
        full_name: name,
        role: 'citizen',
        points: 0,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error in createProfile:', error);
    throw error;
  }
  return data;
};

/**
 * Fetches a user's profile record from the database.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<object|null>} The profile object or null if not found.
 */
export const getProfile = async (userId) => {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
  return data;
};

/**
 * Updates a user's profile record in the database.
 * @param {string} userId - The UUID of the user.
 * @param {object} data - The fields to update.
 * @returns {Promise<object>} The updated profile object.
 */
export const updateProfile = async (userId, data) => {
  if (!userId) throw new Error('User ID is required to update profile.');

  const { data: updatedData, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
  return updatedData;
};

/**
 * Increments points for a user using Supabase RPC.
 * @param {string} userId - The UUID of the user.
 * @param {number} value - The number of points to add.
 */
export const incrementPoints = async (userId, value) => {
  if (!userId) throw new Error('User ID is required to increment points.');
  
  const { data, error } = await supabase.rpc('increment_points', {
    user_id: userId,
    value: value
  });

  if (error) {
    console.error('Error calling increment_points RPC:', error);
    throw error;
  }
  return data;
};

/**
 * Decrements points for a user using Supabase RPC.
 * @param {string} userId - The UUID of the user.
 * @param {number} value - The number of points to subtract.
 */
export const decrementPoints = async (userId, value) => {
  return incrementPoints(userId, -value);
};

