import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockDb } from '@/db/mockDb';
import { useNotificationStore } from '@/store/useNotificationStore';

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: () => mockDb.getIssues(),
  });
};

export const useGetIssueById = (id) => {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => mockDb.getIssueById(id),
    enabled: !!id,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    mutationFn: (issueData) => mockDb.createIssue(issueData),
    onSuccess: (newIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      triggerNotification(
        "Issue Reported successfully! 🚀",
        `Your report '${newIssue.title}' is pending community verification.`,
        "info",
        newIssue.id
      );
    },
  });
};

export const useUpvoteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ issueId, userId }) => mockDb.upvoteIssue(issueId, userId),
    // Optimistic UI updates
    onMutate: async ({ issueId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['issues'] });
      await queryClient.cancelQueries({ queryKey: ['issue', issueId] });

      const previousIssues = queryClient.getQueryData(['issues']);
      const previousIssue = queryClient.getQueryData(['issue', issueId]);

      // Update feed list
      if (previousIssues) {
        queryClient.setQueryData(
          ['issues'],
          previousIssues.map((issue) => {
            if (issue.id === issueId) {
              const hasUpvoted = issue.upvotes.includes(userId);
              return {
                ...issue,
                upvotes: hasUpvoted
                  ? issue.upvotes.filter((id) => id !== userId)
                  : [...issue.upvotes, userId],
              };
            }
            return issue;
          })
        );
      }

      // Update detail page
      if (previousIssue) {
        const hasUpvoted = previousIssue.upvotes.includes(userId);
        queryClient.setQueryData(['issue', issueId], {
          ...previousIssue,
          upvotes: hasUpvoted
            ? previousIssue.upvotes.filter((id) => id !== userId)
            : [...previousIssue.upvotes, userId],
        });
      }

      return { previousIssues, previousIssue };
    },
    onError: (err, variables, context) => {
      if (context?.previousIssues) {
        queryClient.setQueryData(['issues'], context.previousIssues);
      }
      if (context?.previousIssue) {
        queryClient.setQueryData(['issue', variables.issueId], context.previousIssue);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', variables.issueId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

export const useVerifyIssue = () => {
  const queryClient = useQueryClient();
  const triggerNotification = useNotificationStore(state => state.triggerNotification);

  return useMutation({
    mutationFn: ({ issueId, verificationData }) => mockDb.verifyIssue(issueId, verificationData),
    onSuccess: (updatedIssue, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', variables.issueId] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });

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
    mutationFn: ({ issueId, adminName, resolutionData }) =>
      mockDb.resolveIssue(issueId, adminName, resolutionData),
    onSuccess: (updatedIssue) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({ queryKey: ['issue', updatedIssue.id] });
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
    mutationFn: ({ issueId, commentData }) => mockDb.addComment(issueId, commentData),
    onSuccess: (newComment, variables) => {
      queryClient.invalidateQueries({ queryKey: ['issue', variables.issueId] });
    },
  });
};

export const useGetLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => mockDb.getLeaderboard(),
  });
};
