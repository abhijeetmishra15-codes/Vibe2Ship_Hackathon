import { supabase } from '@/lib/supabase';
import { createProfile } from './profile';

/**
 * Sign up a new user with email, password, and custom metadata name.
 */
export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      }
    }
  });

  if (error) {
    throw error;
  }

  if (data?.user) {
    try {
      await createProfile(data.user);
    } catch (profileErr) {
      console.error('Failed to create profile automatically during sign up:', profileErr);
    }
  }

  return data;
};

/**
 * Log in an existing user with email and password.
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }
  return data;
};

/**
 * Log out the current user session.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};
