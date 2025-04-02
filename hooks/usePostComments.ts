import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

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
  replies: any[]; // You can define a specific type for replies if needed
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
