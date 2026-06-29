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
    queryFn: () => getIssuesFromSupabase(),
    staleTime: 10000,
    refetchOnWindowFocus: true
  });
};

export const useGetIssueById = (id) => {
  const normalizedId = String(id);
  return useQuery({
    queryKey: ['issue', normalizedId],
    queryFn: () => getIssueById(normalizedId),
    enabled: !!id && normalizedId !== 'undefined' && normalizedId !== 'null',
    staleTime: 10000,
    refetchOnWindowFocus: true
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
        try {
          imageUploadResult = await uploadImage(issueData.imageFile);
        } catch (uploadErr) {
          console.error("Image upload failed:", uploadErr);
          throw new Error(`Image upload failed: ${uploadErr.message || uploadErr}`);
        }
      }

      // 2. Upload video if present
      if (issueData.videoFile) {
        try {
          videoUploadResult = await uploadVideo(issueData.videoFile);
        } catch (uploadErr) {
          console.error("Video upload failed:", uploadErr);
          
          // Clean up / rollback image upload if video fails
          if (imageUploadResult && imageUploadResult.filePath) {
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

      await queryClient.invalidateQueries({ queryKey: ['issues'] });
      if (newIssue?.id) {
        await queryClient.invalidateQueries({ queryKey: ['issue', String(newIssue.id)] });
      }
      await queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      triggerNotification(
        "Issue Reported successfully! 🚀",
        `Your report '${newIssue.title}' is pending community verification.`,
        "info",
        newIssue.id
      );

      // 5. Trigger background AI analysis
      if (newIssue?.id) {
        supabase.functions.invoke('ai-civic-agent', {
          body: { action: 'analyze_issue', payload: { issueId: newIssue.id } }
        }).then(({ data, error }) => {
          if (error) {
            console.error("Background AI analysis failed:", error);
          } else {
            // Refresh the specific issue to load AI data
            queryClient.invalidateQueries({ queryKey: ['issue', String(newIssue.id)] });
            queryClient.invalidateQueries({ queryKey: ['issues'] });
          }
        }).catch(err => console.error("Background AI analysis exception:", err));
      }
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
    onMutate: async ({ issueId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      await queryClient.cancelQueries({ queryKey: ['issue', String(issueId)] });
      const previousIssues = queryClient.getQueryData(['issues']);
      const previousIssue = queryClient.getQueryData(['issue', String(issueId)]);

      const updateVotes = (issue) => {
        const hasUpvoted = issue.issue_votes?.some(v => v.user_id === userId);
        const newVotes = hasUpvoted 
          ? issue.issue_votes.filter(v => v.user_id !== userId) 
          : [...(issue.issue_votes || []), { user_id: userId }];
        return { ...issue, issue_votes: newVotes };
      };

      queryClient.setQueryData(['issues'], old => old ? old.map(issue => String(issue.id) === String(issueId) ? updateVotes(issue) : issue) : old);
      queryClient.setQueryData(['issue', String(issueId)], old => old ? updateVotes(old) : old);

      return { previousIssues, previousIssue, issueId };
    },
    onError: (err, variables, context) => {
      if (context?.previousIssues) queryClient.setQueryData(['issues'], context.previousIssues);
      if (context?.previousIssue) queryClient.setQueryData(['issue', String(context.issueId)], context.previousIssue);
      useToastStore.getState().toast({ title: "Action Failed", description: "Could not register your vote. Please try again.", type: "error" });
    },
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
      await queryClient.invalidateQueries({ queryKey: ['issues'] });
      await queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
      await queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

export const useVerifyIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    onMutate: async ({ issueId, verificationData }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      await queryClient.cancelQueries({ queryKey: ['issue', String(issueId)] });
      const previousIssues = queryClient.getQueryData(['issues']);
      const previousIssue = queryClient.getQueryData(['issue', String(issueId)]);

      const newStatus = (verificationData.status === 'rejected' || verificationData.status === 'duplicate') ? 'rejected' : 'verified';
      
      const updateStatus = (issue) => {
        // Optimistically update the status and push a temporary verification
        const tempVerification = {
          id: Math.random().toString(),
          verifier_id: verificationData.verifierId,
          comment: JSON.stringify({ status: verificationData.status, notes: verificationData.notes || '' }),
          created_at: new Date().toISOString()
        };
        return { 
          ...issue, 
          status: newStatus,
          issue_verifications: [...(issue.issue_verifications || []), tempVerification]
        };
      };

      queryClient.setQueryData(['issues'], old => old ? old.map(i => String(i.id) === String(issueId) ? updateStatus(i) : i) : old);
      queryClient.setQueryData(['issue', String(issueId)], old => old ? updateStatus(old) : old);

      return { previousIssues, previousIssue, issueId };
    },
    onError: (err, variables, context) => {
      if (context?.previousIssues) queryClient.setQueryData(['issues'], context.previousIssues);
      if (context?.previousIssue) queryClient.setQueryData(['issue', String(context.issueId)], context.previousIssue);
      useToastStore.getState().toast({ title: "Verification Failed", description: err.message || "Failed to record verification.", type: "error" });
    },
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

      await queryClient.invalidateQueries({ queryKey: ['issues'] });
      await queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
      await queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

      triggerNotification(
        "Verification Recorded! 🔍",
        `You verified '${updatedIssue.title}' as '${variables.verificationData.status}'.`,
        "verification",
        updatedIssue.id
      );
    },

  });
};

export const useResolveIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    onMutate: async ({ issueId, resolutionData }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      await queryClient.cancelQueries({ queryKey: ['issue', String(issueId)] });
      const previousIssues = queryClient.getQueryData(['issues']);
      const previousIssue = queryClient.getQueryData(['issue', String(issueId)]);

      const updateStatus = (issue) => {
        const tempReport = {
          id: Math.random().toString(),
          resolution_message: resolutionData.content,
          created_at: new Date().toISOString()
        };
        return { 
          ...issue, 
          status: 'resolved',
          resolution_reports: [...(issue.resolution_reports || []), tempReport]
        };
      };

      queryClient.setQueryData(['issues'], old => old ? old.map(i => String(i.id) === String(issueId) ? updateStatus(i) : i) : old);
      queryClient.setQueryData(['issue', String(issueId)], old => old ? updateStatus(old) : old);

      return { previousIssues, previousIssue, issueId };
    },
    onError: (err, variables, context) => {
      if (context?.previousIssues) queryClient.setQueryData(['issues'], context.previousIssues);
      if (context?.previousIssue) queryClient.setQueryData(['issue', String(context.issueId)], context.previousIssue);
      useToastStore.getState().toast({ title: "Resolution Failed", description: err.message || "Failed to mark issue as resolved.", type: "error" });
    },
    mutationFn: async ({ issueId, resolutionFile, resolutionData }) => {
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

      await queryClient.invalidateQueries({ queryKey: ['issues'] });
      await queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
      await queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

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
    onMutate: async ({ issueId, commentData }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      await queryClient.cancelQueries({ queryKey: ['issue', String(issueId)] });
      const previousIssues = queryClient.getQueryData(['issues']);
      const previousIssue = queryClient.getQueryData(['issue', String(issueId)]);

      const { user } = useAuthStore.getState();

      const tempComment = {
        id: Math.random().toString(),
        user_id: user?.id || 'temp',
        comment: commentData.content,
        created_at: new Date().toISOString(),
        profiles: { full_name: user?.name || 'You', role: user?.role }
      };

      const updateComments = (issue) => ({ ...issue, issue_comments: [...(issue.issue_comments || []), tempComment] });

      queryClient.setQueryData(['issues'], old => old ? old.map(i => String(i.id) === String(issueId) ? updateComments(i) : i) : old);
      queryClient.setQueryData(['issue', String(issueId)], old => old ? updateComments(old) : old);

      return { previousIssues, previousIssue, issueId };
    },
    onError: (err, variables, context) => {
      if (context?.previousIssues) queryClient.setQueryData(['issues'], context.previousIssues);
      if (context?.previousIssue) queryClient.setQueryData(['issue', String(context.issueId)], context.previousIssue);
      useToastStore.getState().toast({ title: "Comment Failed", description: "Could not post your comment.", type: "error" });
    },
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
    onSuccess: async (newComment, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['issues'] });
      await queryClient.invalidateQueries({ queryKey: ['issue', String(variables.issueId)] });
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
