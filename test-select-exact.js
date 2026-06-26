import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zthpwbwutqblqjwkdumt.supabase.co';
const supabaseAnonKey = 'sb_publishable_iuwKFE4KE_DJWncOuBBNnQ_SMK91-BO';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const selectQuery = `
      *,
      profiles:created_by (
        id,
        full_name,
        role,
        points
      ),
      issue_comments (
        id,
        comment,
        user_id,
        created_at,
        profiles:user_id (
          id,
          full_name,
          role,
          points
        )
      ),
      issue_verifications (
        id,
        comment,
        verifier_id,
        created_at,
        profiles:verifier_id (
          id,
          full_name,
          role,
          points
        )
      ),
      issue_votes (
        user_id
      ),
      resolution_reports (
        id,
        resolution_message,
        proof_image_url,
        created_at,
        profiles:admin_id (
          full_name
        )
      )
    `;

  console.log("Testing exact select query...");
  const { data, error } = await supabase
    .from("issues")
    .select(selectQuery)
    .limit(1);

  if (error) {
    console.error("Syntax Error:", error);
  } else {
    console.log("Success! Data retrieved.");
  }
}

test();
