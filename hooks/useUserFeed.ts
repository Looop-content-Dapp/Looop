import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type Artist = {
  _id: string;
  name: string;
  profileImage: string;
  followers: number;
  verified: boolean;
  id: string;
};

type Track = {
  _id: string;
  title?: string;
  artist?: string;
  artistId?: string;
  albumArt?: string;
  duration?: number;
  releaseDate?: string;
  genre?: string;
  url?: string;
  // Add any other track properties from your API
};

type Release = {
  _id: string;
  title?: string;
  artist?: Artist;
  releaseDate?: string;
  coverImage?: string;
  type?: string; // album, single, EP, etc.
  trackCount?: number;
  // Add any other release properties from your API
};

type UserFeedResponse = {
  status: string;
  message: string;
  data: {
    followedArtists: Artist[];
    recentReleases: Release[];
    recommendedArtists: Artist[];
    suggestedTracks: Track[];
  };
};

export const useUserFeed = (userId: string) => {
  return useQuery({
    queryKey: ["userFeed", userId],
    queryFn: async () => {
      const { data } = await api.get<UserFeedResponse>(`/api/user/feed/${userId}`);
      return data;
    },
  });
};
