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

export const useFollowingArtists = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery<FollowingArtistsResponse>({
    queryKey: ['followingArtists', userId, page, limit],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/user/following/${userId}`, {
            params: {
              page,
              limit
            }
          });
        console.log("API Response:", data);
        return data;
      } catch (error) {
        console.error("Error fetching following artists:", error);
        throw error;
      }
    },
    enabled: !!userId && userId.length > 0,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5000,
    refetchIntervalInBackground: true, // Continue refreshing even when the window is in the background
  });
};
