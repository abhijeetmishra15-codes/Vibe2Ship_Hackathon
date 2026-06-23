import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error(
    'Supabase Integration Error: VITE_SUPABASE_URL is not defined in environment variables.'
  );
}

if (!supabaseAnonKey) {
  console.error(
    'Supabase Integration Error: VITE_SUPABASE_ANON_KEY is not defined in environment variables.'
  );
}

// Fallback values prevent import-time crashes if environment variables are missing during setup
export const supabase = createClient(
  supabaseUrl || 'https://zthpwbwutqblqjwkdumt.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

export default supabase;
