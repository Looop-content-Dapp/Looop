import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/config/apiConfig";

interface AddTrackToFavoritesInput {
  userId: string;
  trackId: string;
}

interface GetUserFavoritesInput {
  userId: string;
}

// Hook for adding a track to favorites
export const useAddTrackToFavorites = () => {
  return useMutation({
    mutationFn: async (input: AddTrackToFavoritesInput) => {
      const { userId, trackId } = input;
      const { data } = await api.post(`/api/user/favorites/track/${userId}/${trackId}`);
      return data;
    },
  });
};

// Hook for getting user's favorites
export const useGetUserFavorites = (userId: string) => {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/user/favorites/${userId}`);
      return data;
    },
    // Only fetch if userId is provided
    enabled: !!userId,
  });
};
