import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zthpwbwutqblqjwkdumt.supabase.co';
const supabaseAnonKey = 'sb_publishable_iuwKFE4KE_DJWncOuBBNnQ_SMK91-BO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase
    .from("issues")
    .select(`
      id,
      profiles:created_by ( id, full_name ),
      issue_comments ( id ),
      issue_verifications ( id ),
      issue_votes ( user_id ),
      resolution_reports ( id )
    `)
    .limit(1);

  console.log("Issues Feed Direct:");
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
