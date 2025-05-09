import { useEffect } from 'react';
import api from "@/config/apiConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAblyChannel } from '@/config/ablyConfig';

type UserLocation = {
  country: string | null;
  state: string | null;
  city: string | null;
};

type SocialLinks = {
  instagram: string | null;
  twitter: string | null;
  facebook: string | null;
  website: string | null;
};

type CommentUser = {
  username: string;
  profileImage: string;
  isVerified: boolean;
  email: string;
  bio: string;
  fullname: string;
  gender: string;
  age: string;
  location: UserLocation;
  socialLinks: SocialLinks;
  isPremium: boolean;
};

type Comment = {
  id: string;
  user: CommentUser;
  timestamp: string;
  text: string;
  likes: number;
  replies: any[];
  isEdited: boolean;
};

type PostCommentsResponse = {
  message: string;
  data: {
    comments: Comment[];
    currentPage: number;
    totalPages: number;
    totalComments: number;
  };
};

export const usePostComments = (postId: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    const channel = getAblyChannel(`post-${postId}-comments`);

    channel.subscribe('new-comment', (message) => {
      queryClient.setQueryData(['postComments', postId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            comments: [message.data, ...oldData.data.comments],
            totalComments: oldData.data.totalComments + 1
          }
        };
      });
    });

    channel.subscribe('comment-updated', (message) => {
      queryClient.setQueryData(['postComments', postId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            comments: oldData.data.comments.map((comment: Comment) =>
              comment.id === message.data.id ? message.data : comment
            )
          }
        };
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [postId, queryClient]);

  return useQuery({
    queryKey: ["postComments", postId],
    queryFn: async () => {
      if (!postId) {
        throw new Error("Post ID not found");
      }
      const { data } = await api.get<PostCommentsResponse>(`/api/post/${postId}/comments`);
      return data;
    },
    enabled: !!postId,
    refetchOnWindowFocus: true,
    staleTime: 10000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });
};
