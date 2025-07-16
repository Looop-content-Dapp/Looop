import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

export interface Artist {
  _id: string;
  name: string;
  profileImage: string;
  followers: number;
  isFollowed: boolean;
  communityName?: string;
  tribestars?: string;
  followedAt: string;
}

export interface FollowingArtistsResponse {
  status: string;
  message: string;
  data: {
    artists: Artist[];
    pagination: {
      current: number;
      total: number;
      hasMore: boolean;
    };
  };
}

export const useFollowingArtists = ( page: number = 1, limit: number = 10) => {
  return useQuery<FollowingArtistsResponse>({
    queryKey: ['followingArtists',page, limit],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/social/following?page=${page}&limit=${limit}`);
        console.log("API Response:", data.data.following.artists);
        return data;
      } catch (error) {
        console.error("Error fetching following artists:", error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5000,
    refetchIntervalInBackground: true, // Continue refreshing even when the window is in the background
  });
};
