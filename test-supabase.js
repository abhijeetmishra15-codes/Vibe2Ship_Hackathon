import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zthpwbwutqblqjwkdumt.supabase.co';
const supabaseAnonKey = 'sb_publishable_iuwKFE4KE_DJWncOuBBNnQ_SMK91-BO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from("issue_ai_analysis")
    .select("*")
    .limit(1);

  console.log("Direct table access:");
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
