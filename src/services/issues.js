import { supabase } from '@/lib/supabase';

/**
 * Fetch all issues from Supabase with joined tables
 */
export const getIssuesFromSupabase = async () => {
  const { data, error } = await supabase
    .from("issues")
    .select(`
      *,
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
        id,
        vote_type,
        user_id
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching issues from Supabase:", error);
    return [];
  }
  return data || [];
};

/**
 * Fetch a single issue by id from Supabase with joined tables
 */
export const getIssueById = async (id) => {
  if (!id) return null;
  const { data, error } = await supabase
    .from("issues")
    .select(`
      *,
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
        id,
        vote_type,
        user_id
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching issue with id ${id}:`, error);
    return null;
  }
  return data || null;
};

/**
 * Create issue in Supabase
 */
export const createIssue = async (data) => {
  if (!data) throw new Error('Issue data is required');

  // Verify that only string URLs, not File objects, are received
  if (data.image_url && typeof data.image_url !== 'string') {
    throw new Error(`Invalid image_url payload: Expected string URL, got ${typeof data.image_url}`);
  }
  if (data.video_url && typeof data.video_url !== 'string') {
    throw new Error(`Invalid video_url payload: Expected string URL, got ${typeof data.video_url}`);
  }

  const payload = {
    title: data.title,
    description: data.description,
    image_url: data.image_url || null,
    video_url: data.video_url || null,
    location: data.location || null,
    latitude: data.latitude,
    longitude: data.longitude,
    created_by: data.created_by,
    status: data.status || 'open'
  };

  console.log("📦 Issue Insert Payload:", payload);

  const { data: newIssue, error } = await supabase
    .from('issues')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("❌ Issue insert failed:", error);
    throw error;
  }

  console.log("✅ Issue created:", newIssue);
  return newIssue;
};

/**
 * Delete a file from Supabase storage 'issue-media' bucket
 */
export const deleteFileFromStorage = async (filePath) => {
  if (!filePath) return;
  try {
    console.log(`🗑️ Deleting file from storage: ${filePath}...`);
    const { data, error } = await supabase.storage
      .from('issue-media')
      .remove([filePath]);

    if (error) {
      console.error(`❌ Failed to delete storage file ${filePath}:`, error);
      throw error;
    }
    console.log(`🗑️ Successfully deleted storage file ${filePath}`);
    return data;
  } catch (err) {
    console.error(`❌ deleteFileFromStorage exception:`, err);
    throw err;
  }
};

/**
 * Upload image to Supabase storage 'issue-media' bucket with retry logic and validation
 */
export const uploadImage = async (file) => {
  if (!file) return null;
  if (!(file instanceof File)) {
    throw new Error("Invalid file type: expected a File object for image upload");
  }

  const uploadAttempt = async (attempt) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('issue-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        if (attempt === 1) {
          console.warn("⚠️ Image upload failed on first attempt, retrying...", uploadError);
          return await uploadAttempt(2);
        }
        console.error("❌ Image upload failed on final attempt:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('issue-media')
        .getPublicUrl(filePath);

      console.log("✅ Image upload success!");
      console.log("🖼️ Public URL:", data.publicUrl);

      return { publicUrl: data.publicUrl, filePath };
    } catch (err) {
      if (attempt === 1) {
        console.warn("⚠️ Image upload exception on first attempt, retrying...", err);
        return await uploadAttempt(2);
      }
      console.error("❌ uploadImage final error:", err);
      throw err;
    }
  };

  return await uploadAttempt(1);
};

/**
 * Upload video to Supabase storage 'issue-media' bucket with retry logic and validation
 */
export const uploadVideo = async (file) => {
  if (!file) return null;
  if (!(file instanceof File)) {
    throw new Error("Invalid file type: expected a File object for video upload");
  }

  const uploadAttempt = async (attempt) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;

      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('issue-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        if (attempt === 1) {
          console.warn("⚠️ Video upload failed on first attempt, retrying...", uploadError);
          return await uploadAttempt(2);
        }
        console.error("❌ Video upload failed on final attempt:", uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('issue-media')
        .getPublicUrl(filePath);

      console.log("✅ Video upload success!");
      console.log("🎥 Public URL:", data.publicUrl);

      return { publicUrl: data.publicUrl, filePath };
    } catch (err) {
      if (attempt === 1) {
        console.warn("⚠️ Video upload exception on first attempt, retrying...", err);
        return await uploadAttempt(2);
      }
      console.error("❌ uploadVideo final error:", err);
      throw err;
    }
  };

  return await uploadAttempt(1);
};