import api from '@/config/apiConfig';
import { useQuery } from '@tanstack/react-query';


interface CommentUser {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  age: string;
  gender: string;
  profileImage: string | null;
  bio: string | null;
  isPremium: boolean;
  location: {
    country: string | null;
    state: string | null;
    city: string | null;
  };
  socialLinks: {
    instagram: string | null;
    twitter: string | null;
    facebook: string | null;
    website: string | null;
  };
}

interface Comment {
  _id: string;
  userId: CommentUser;
  postId: string;
  parentCommentId: string | null;
  content: string;
  createdAt: string;
  likes: string[];
  likeCount: number;
  hasLiked: boolean;
  replies: Comment[];
  replyCount: number;
  isEdited: boolean;
}

interface CommentResponse {
  message: string;
  data: Comment;
}

export const useGetComment = (commentId: string | null) => {
  return useQuery({
    queryKey: ['comment', commentId],
    queryFn: async (): Promise<CommentResponse> => {
      if (!commentId) throw new Error('Comment ID is required');
      const response = await api.get(`/api/post/comments/${commentId}`);
      return response.data;
    },
    enabled: !!commentId,
  });
};

export type { Comment, CommentUser };
