import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useToastStore } from '@/store/useToastStore';
import { incrementPoints } from '@/services/profile';
import { useAuthStore } from '@/store/useAuthStore';
import { createIssue, uploadImage, uploadVideo, deleteFileFromStorage, getIssuesFromSupabase, getIssueById } from '@/services/issues';
import { supabase } from "@/lib/supabase";

// Module-scoped locks to prevent duplicate point increments during the session
const processedCreatedIssues = new Set();
const processedVerifications = new Set();

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: () => getIssuesFromSupabase()
  });
};

export const useGetIssueById = (id) => {
  return useQuery({
    queryKey: ['issue', String(id)],
    queryFn: () => getIssueById(id),
    enabled: !!id,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    mutationFn: async (issueData) => {
      let imageUploadResult = null;
      let videoUploadResult = null;

      // 1. Upload image if present
      if (issueData.imageFile) {
        console.log("Starting image upload to storage...");
        try {
          imageUploadResult = await uploadImage(issueData.imageFile);
          console.log("Image upload completed successfully. URL:", imageUploadResult.publicUrl);
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          throw new Error(`Image upload failed: ${uploadErr.message || uploadErr}`);
        }
      }

      // 2. Upload video if present
      if (issueData.videoFile) {
        console.log("Starting video upload to storage...");
        try {
          videoUploadResult = await uploadVideo(issueData.videoFile);
          console.log("Video upload completed successfully. URL:", videoUploadResult.publicUrl);
        } catch (uploadErr) {
          console.error("Video upload failed:", uploadErr);
          
          // Clean up / rollback image upload if video fails
          if (imageUploadResult && imageUploadResult.filePath) {
            console.log("🔄 Video upload failed. Initiating image rollback delete...");
            try {
              await deleteFileFromStorage(imageUploadResult.filePath);
            } catch (deleteErr) {
              console.error("❌ Failed to delete orphan image during rollback:", deleteErr);
            }
          }
          throw new Error(`Video upload failed: ${uploadErr.message || uploadErr}`);
        }
      }

      // Extract string URLs from results
      const image_url = imageUploadResult ? imageUploadResult.publicUrl : null;
      const video_url = videoUploadResult ? videoUploadResult.publicUrl : null;

      // 3. Insert into Supabase issues table
      console.log("Starting database insert into 'issues' table...");
      const supabaseIssueData = {
        title: issueData.title,
        description: issueData.description,
        image_url: image_url,
        video_url: video_url,
        location: issueData.location.address,
        latitude: issueData.location.lat,
        longitude: issueData.location.lng,
        created_by: issueData.reporter.id,
        status: 'pending'
      };

      const createdSupabaseIssue = await createIssue(supabaseIssueData);

      // 4. Verify Supabase response contains valid data
      if (!createdSupabaseIssue || !createdSupabaseIssue.id) {
        const validationError = new Error("Database insert did not return a valid issue ID.");
        console.error("Supabase insert validation failed:", validationError);
        throw validationError;
      }

      console.log("Supabase insert confirmed success. Data:", createdSupabaseIssue);
      return createdSupabaseIssue;
    },
    onSuccess: async (newIssue) => {
      if (newIssue?.id && newIssue.created_by) {
        if (!processedCreatedIssues.has(newIssue.id)) {
          processedCreatedIssues.add(newIssue.id);
          try {
            await incrementPoints(newIssue.created_by, 10);
            const authState = useAuthStore.getState();
            if (authState.user && authState.user.id === newIssue.created_by) {
              authState.addPoints(10);
            }
          } catch (err) {
            console.error("Failed to increment creator points on issue creation:", err);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      triggerNotification(
        "Issue Reported successfully! 🚀",
        `Your report '${newIssue.title}' is pending community verification.`,
        "info",
        newIssue.id
      );
    },
    onError: (error) => {
      console.error("Failed to create issue:", error);
      useToastStore.getState().toast({
        title: "Report Failed ❌",
        description: error.message || "Failed to upload media or create the issue.",
        type: "error"
      });
    }
  });
};

export const useUpvoteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId, userId }) => {
      const { data: existingVote, error: checkError } = await supabase
        .from('issue_votes')
        .select('id')
        .eq('issue_id', issueId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingVote) {
        const { error: deleteError } = await supabase
          .from('issue_votes')
          .delete()
          .eq('id', existingVote.id);
        if (deleteError) throw deleteError;
        return { action: 'removed', issueId, userId };
      } else {
        const { error: insertError } = await supabase
          .from('issue_votes')
          .insert([{
            issue_id: issueId,
            user_id: userId,
            vote_type: 'up'
          }]);
        if (insertError) throw insertError;
        return { action: 'added', issueId, userId };
      }
    },
    onSuccess: async (res, variables) => {
      if (res?.action === 'added' || res?.action === 'removed') {
        try {
          const { data: issue } = await supabase
            .from('issues')
            .select('created_by')
            .eq('id', variables.issueId)
            .single();

          if (issue?.created_by) {
            const pointValue = res.action === 'added' ? 1 : -1;
            await incrementPoints(issue.created_by, pointValue);
            const authState = useAuthStore.getState();
            if (authState.user && authState.user.id === issue.created_by) {
              authState.addPoints(pointValue);
            }
          }
        } catch (err) {
          console.error("Failed to update points for upvote action:", err);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

export const useVerifyIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    mutationFn: async ({ issueId, verificationData }) => {
      // 1. Role enforcement check
      const authState = useAuthStore.getState();
      const currentRole = (authState.role || '').trim().toLowerCase();
      if (currentRole !== 'verifier') {
        throw new Error("Unauthorized: Only users with the verifier role can verify issues.");
      }

      // 2. Duplicate verification prevention check
      const { data: existingVerification, error: checkError } = await supabase
        .from('issue_verifications')
        .select('id')
        .eq('issue_id', issueId)
        .eq('verifier_id', verificationData.verifierId)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingVerification) {
        throw new Error("Duplicate Action: You have already verified this issue.");
      }

      const commentPayload = JSON.stringify({
        status: verificationData.status,
        notes: verificationData.notes || '',
        evidenceImage: verificationData.evidenceImage || null
      });

      const { error: insErr } = await supabase
        .from('issue_verifications')
        .insert([{
          issue_id: issueId,
          verifier_id: verificationData.verifierId,
          comment: commentPayload
        }]);

      if (insErr) throw insErr;

      const newStatus = (verificationData.status === 'rejected' || verificationData.status === 'duplicate') ? 'rejected' : 'verified';
      const { data: updatedIssue, error: updErr } = await supabase
        .from('issues')
        .update({ status: newStatus })
        .eq('id', issueId)
        .select()
        .maybeSingle();

      if (updErr) throw updErr;

      if (!updatedIssue) {
        const { data: fetchedIssue, error: fetchErr } = await supabase
          .from('issues')
          .select()
          .eq('id', issueId)
          .single();
        if (fetchErr) throw fetchErr;
        return { ...fetchedIssue, status: newStatus };
      }
      return updatedIssue;
    },
    onSuccess: async (updatedIssue, variables) => {
      const isVerified = variables.verificationData.status === 'verified';
      if (isVerified && updatedIssue?.id) {
        const verifierId = variables.verificationData.verifierId;
        const verificationKey = `${verifierId}-${updatedIssue.id}`;

        if (verifierId && !processedVerifications.has(verificationKey)) {
          processedVerifications.add(verificationKey);
          try {
            await incrementPoints(verifierId, 5);

            const authState = useAuthStore.getState();
            if (authState.user && authState.user.id === verifierId) {
              authState.addPoints(5);
            }
          } catch (err) {
            console.error("Failed to update points on issue verification:", err);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

      triggerNotification(
        "Verification Recorded! 🔍",
        `You verified '${updatedIssue.title}' as '${variables.verificationData.status}'.`,
        "verification",
        updatedIssue.id
      );
    },
    onError: (error) => {
      console.error("Failed to verify issue:", error);
      useToastStore.getState().toast({
        title: "Verification Failed ❌",
        description: error.message || "Failed to record verification.",
        type: "error"
      });
    }
  });
};

export const useResolveIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    mutationFn: async ({ issueId, adminName, resolutionFile, resolutionData }) => {
      // 1. Fetch current issue details to check its status
      const { data: currentIssue, error: fetchErr } = await supabase
        .from('issues')
        .select('*')
        .eq('id', issueId)
        .single();

      if (fetchErr) throw fetchErr;

      // 2. If it is already resolved, return gracefully with a flag
      if (currentIssue?.status === 'resolved') {
        return { ...currentIssue, wasAlreadyResolved: true };
      }

      const { data: { user } } = await supabase.auth.getUser();
      const adminId = user?.id;

      // 3. Upload proof file to storage if provided
      let proofUrl = resolutionData.image || null;
      if (resolutionFile) {
        try {
          const uploadResult = await uploadImage(resolutionFile);
          proofUrl = uploadResult?.publicUrl || proofUrl;
        } catch (err) {
          console.error("Failed to upload resolution proof image:", err);
          throw new Error(`Upload failed: ${err.message || err}`);
        }
      }

      // 4. Insert into resolution_reports
      const { error: insErr } = await supabase
        .from('resolution_reports')
        .insert([{
          issue_id: issueId,
          admin_id: adminId || 'e5fe1108-abe4-4666-8b90-6c658eac6202',
          resolution_message: resolutionData.content,
          proof_image_url: proofUrl
        }]);

      if (insErr) throw insErr;

      const { data: updatedIssue, error: updErr } = await supabase
        .from('issues')
        .update({ status: 'resolved' })
        .eq('id', issueId)
        .select()
        .maybeSingle();

      if (updErr) throw updErr;

      if (!updatedIssue) {
        const { data: fetchedIssue, error: fetchErr } = await supabase
          .from('issues')
          .select()
          .eq('id', issueId)
          .single();
        if (fetchErr) throw fetchErr;
        return { ...fetchedIssue, status: 'resolved' };
      }
      return updatedIssue;
    },
    onSuccess: async (updatedIssue, variables) => {
      if (updatedIssue?.wasAlreadyResolved) {
        return;
      }

      if (updatedIssue?.created_by) {
        try {
          await incrementPoints(updatedIssue.created_by, 20);
          const authState = useAuthStore.getState();
          if (authState.user && authState.user.id === updatedIssue.created_by) {
            authState.addPoints(20);
          }
        } catch (err) {
          console.error("Failed to award points for resolution:", err);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

      triggerNotification(
        "Issue Resolved! ✅",
        `The issue '${updatedIssue.title}' has been successfully marked as resolved.`,
        "resolution",
        updatedIssue.id
      );
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ issueId, commentData }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to comment");

      const { data, error } = await supabase
        .from('issue_comments')
        .insert([{
          issue_id: issueId,
          user_id: user.id,
          comment: commentData.content
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newComment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
    },
  });
};

export const useGetLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, points")
        .order("points", { ascending: false });

      if (error) {
        console.error("Leaderboard fetch error:", error);
        return [];
      }

      const { data: issues } = await supabase.from("issues").select("created_by");
      const { data: verifications } = await supabase.from("issue_verifications").select("verifier_id");
      
      const issueCounts = {};
      const verifCounts = {};
      
      issues?.forEach(i => {
        if (i.created_by) issueCounts[i.created_by] = (issueCounts[i.created_by] || 0) + 1;
      });
      verifications?.forEach(v => {
        if (v.verifier_id) verifCounts[v.verifier_id] = (verifCounts[v.verifier_id] || 0) + 1;
      });

      return profiles.map((p, idx) => {
        const reportsCount = issueCounts[p.id] || 0;
        const verifCount = verifCounts[p.id] || 0;
        
        const badges = [];
        if (reportsCount >= 5) badges.push("Civic Star");
        if (verifCount >= 5) badges.push("Elite Verifier");
        if (idx === 0) badges.push("Pothole Buster");
        if (idx === 1) badges.push("Green Guardian");
        
        return {
          rank: idx + 1,
          id: p.id,
          name: p.full_name || "Unknown User",
          role: p.role || "citizen",
          points: p.points || 0,
          reports: reportsCount,
          verifications: verifCount,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          badges: badges.length > 0 ? badges : ["Civic Star"]
        };
      });
    },
  });
};
