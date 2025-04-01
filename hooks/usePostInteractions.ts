import api from "@/config/apiConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentInput {
  userId: string;
  postId: string;
  content: string;
  parentCommentId?: string;
}

interface LikeInput {
  userId: string;
  postId: string;
}

export const usePostInteractions = () => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async (input: LikeInput) => {
      const { data } = await api.post("/api/post/like", input);
      return data;
    },
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previousPost = queryClient.getQueryData(['post', postId]);

      queryClient.setQueryData(['post', postId], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          likeCount: old.data.likeCount + 1,
        }
      }));

      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', variables.postId], context.previousPost);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (input: CommentInput) => {
      const { data } = await api.post("/api/post/comment", input);
      return data;
    },
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ['post', postId] });
      const previousPost = queryClient.getQueryData(['post', postId]);

      queryClient.setQueryData(['post', postId], (old: any) => ({
        ...old,
        data: {
          ...old.data,
          commentCount: old.data.commentCount + 1,
        }
      }));

      return { previousPost };
    },
    onError: (err, variables, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['post', variables.postId], context.previousPost);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (input: CommentInput) => {
      const { data } = await api.post("/api/post/comment", input);
      return data;
    },
    onMutate: async ({ postId, parentCommentId }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      const previousComments = queryClient.getQueryData(['comments', postId]);

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', variables.postId], context.previousComments);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
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
