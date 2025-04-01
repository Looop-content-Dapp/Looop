import api from "@/config/apiConfig";
import { useMutation, useQuery } from "@tanstack/react-query";

type Community = {
  communityName: string;
  description: string;
  coverImage: string;
  collectibleName: string;
  collectibleDescription: string;
  collectibleImage: string;
  collectibleType: string;
  artistId: string;
  communitySymbol: string;
};

export const useCreateCommunity = () => {
  return useMutation({
    mutationFn: async (input: Community) => {
      console.log("Attempting to create community", input);
      const { data } = await api.post("/api/community/createcommunity", input);
      return data;
    },
  });
};

export type Media = {
  type: string;
  url: string;
  mimeType: string;
  size: number;
  _id: string;
};

export type Artist = {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  verified: boolean;
  createdAt: string;
};

export type CommunityInfo = {
  _id: string;
  description: string;
  coverImage: string;
  createdAt: string;
};

export type Post = {
  _id: string;
  content: string;
  title: string;
  postType: string;
  type: string;
  media: Media[];
  artistId: Artist;
  communityId: CommunityInfo;
  tags: string[];
  category: string;
  visibility: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  comments: any[];
  likes: any[];
  id: string;
};

type CommunityPostsResponse = {
  message: string;
  data: {
    posts: Post[];
    announcements: Post[];
    events: Post[];
    currentPage: number;
    totalPages: number;
    counts: {
      posts: number;
      announcements: number;
      events: number;
      total: number;
    };
  };
};

export const useGetCommunityPosts = (communityId: string) => {
  return useQuery({
    queryKey: ['communityPosts', communityId],
    queryFn: async () => {
      const { data } = await api.get<CommunityPostsResponse>(`/api/post/community/${communityId}`);
      return data;
    },
    enabled: !!communityId,
    // Refresh every 10 seconds
    refetchInterval: 10000,
    // Only refetch when the window is focused
    refetchOnWindowFocus: true,
    // Automatically revalidate when regaining network connection
    refetchOnReconnect: true,
  });
};

type SinglePostResponse = {
  message: string;
  data: Post;
};

export const useGetPost = (postId: string) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data } = await api.get<SinglePostResponse>(`/api/post/${postId}`);
      return data;
    },
    enabled: !!postId,
  });
};
