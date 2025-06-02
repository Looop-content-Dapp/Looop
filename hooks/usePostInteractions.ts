import api from "@/config/apiConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAblyChannel } from '@/config/ablyConfig';

interface CommentInput {
  userId: string;
  postId: string;
  parentCommentId?: string;
  content: string;
}

interface LikeInput {
  userId: string;
  postId: string;
}

interface Comment {
  _id: string;
  content: string;
  userId: {
    email: string;
    profileImage: string;
    bio: string;
  };
  createdAt: string;
  replies?: Comment[];
}

interface Post {
  _id: string;
  content: string;
  likes: any[];
  likeCount: number;
  comments: Comment[];
  commentCount: number;
}

export const usePostInteractions = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (input: LikeInput) => {
      const { data } = await api.post("/api/post/like", input);
      return data;
    },
    onSuccess: (data) => {
      // Update the post data with the server response
      if (data?.postId) {
        queryClient.setQueryData(['post', data.postId], data);
      }
    },
    onMutate: async ({ postId, userId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      await queryClient.cancelQueries({ queryKey: ['post', postId] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);
      const previousPost = queryClient.getQueryData(['post', postId]);

      // Optimistically update posts list if it exists
      queryClient.setQueryData(['posts'], (old: any) => {
        if (!old?.pages) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) => {
              if (post._id === postId) {
                const hasLiked = post.likes?.some((like: any) => like.userId === userId);
                return {
                  ...post,
                  likeCount: hasLiked ? post.likeCount - 1 : post.likeCount + 1,
                  hasLiked: !hasLiked,
                };
              }
              return post;
            }),
          })),
        };
      });

      // Optimistically update single post if it exists
      if (previousPost) {
        queryClient.setQueryData(['post', postId], (old: any) => {
          if (!old) return old;
          const hasLiked = old.likes?.some((like: any) => like.userId === userId);

          return {
            ...old,
            likeCount: hasLiked ? old.likeCount - 1 : old.likeCount + 1,
            hasLiked: !hasLiked,
          };
        });
      }

      return { previousPosts, previousPost };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, roll back optimistic updates
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(['post', variables.postId], context.previousPost);
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch to ensure server-client consistency
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (input: CommentInput) => {
      const response = await api.post("/api/post/comment", input);

      // Publish the new comment to Ably
      const channel = getAblyChannel(`post-${input.postId}-comments`);
      channel.publish('new-comment', response.data);

      return response.data;
    },
    onMutate: async (newComment) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['comments', newComment.postId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData(['comments', newComment.postId]);

      // Optimistically update the comments
      queryClient.setQueryData(['comments', newComment.postId], (old: any) => {
        const optimisticComment = {
          _id: 'temp-' + Date.now(),
          content: newComment.content,
          userId: {
            _id: newComment.userId,
            username: queryClient.getQueryData(['user', newComment.userId])?.data?.username || 'User',
            profileImage: queryClient.getQueryData(['user', newComment.userId])?.data?.profileImage
          },
          createdAt: new Date().toISOString(),
          parentId: newComment.parentCommentId || null,
          isOptimistic: true
        };

        return {
          ...old,
          data: {
            ...old?.data,
            comments: [optimisticComment, ...(old?.data?.comments || [])]
          }
        };
      });

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, roll back to the previous state
      queryClient.setQueryData(
        ['comments', newComment.postId],
        context?.previousComments
      );
    },
    onSettled: (data, error, variables) => {
      // Invalidate and refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (input: CommentInput) => {
      const { data } = await api.post("/api/post/comments/reply", input);
      return data;
    },
    onMutate: async ({ postId, parentCommentId, content, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const previousComments = queryClient.getQueryData(['comments', postId]);

      // Optimistically add the reply
      queryClient.setQueryData(['comments', postId], (old: any) => {
        const currentComments = old?.data?.comments || [];
        const optimisticReply = {
          _id: 'temp-' + Date.now(),
          content,
          userId: {
            _id: userId,
            // Add other user details if available
          },
          parentCommentId,
          createdAt: new Date().toISOString(),
          isOptimistic: true
        };

        return {
          ...old,
          data: {
            ...old?.data,
            comments: currentComments.map((comment: Comment) => {
              if (comment._id === parentCommentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), optimisticReply]
                };
              }
              return comment;
            })
          }
        };
      });

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', variables.postId], context.previousComments);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });

  return {
    likePost: likeMutation.mutate,
    commentOnPost: commentMutation.mutate,
    replyToComment: replyMutation.mutate,
    isLiking: likeMutation.isPending,
    isCommenting: commentMutation.isPending,
    isReplying: replyMutation.isPending,
  };
};
