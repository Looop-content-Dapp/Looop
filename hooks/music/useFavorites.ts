import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";

type Artist = {
  _id: string;
  name: string;
  profileImage: string;
};

type Release = {
  _id: string;
  title: string;
  artwork: {
    cover_image: {
      high: string;
      medium: string;
      low: string;
      thumbnail: string;
    };
    promotional_images: any[];
    colorPalette: any[];
  };
};

type Track = {
  _id: string;
  title: string;
  version: string;
  duration: number;
  track_number: number;
  disc_number: number;
  artistId: Artist;
  releaseId: Release;
  songId: string;
};

type FavoriteTrack = {
  trackId: Track;
  addedAt: string;
  _id: string;
};

type FavoriteRelease = {
  releaseId: string;
  addedAt: string;
  _id: string;
};

type FavoritesData = {
  _id: string;
  userId: string;
  tracks: FavoriteTrack[];
  releases: FavoriteRelease[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type AddFavoriteInput = {
  type: 'track' | 'release';
  itemId: string;
  userId: string;
};

export const useFavorites = (userId: string) => {
    const { userdata } = useAppSelector((state) => state.auth);
  // Get favorite tracks
  const getFavoriteTracks = useQuery({
    queryKey: ['favoriteTracks', userdata?._id],
    queryFn: async () => {
      const { data } = await api.get(`/api/favorites/tracks/${userdata?._id}`);
      return data;
    },
    enabled: !!userdata?._id,
  });

  // Get favorite releases
  const getFavoriteReleases = useQuery({
    queryKey: ['favoriteReleases', userdata?._id],
    queryFn: async () => {
      const { data } = await api.get(`/api/favorites/releases/${userdata?._id}`);
      return data;
    },
    enabled: !!userdata?._id,
  });

  // Add to favorites (track or release)
  const addToFavorites = useMutation({
    mutationFn: async ({ type, itemId, userdata?._id }: AddFavoriteInput) => {
      console.log(`Adding ${type} to favorites`, { itemId, userdata?._id });
      const { data } = await api.post(`/api/favorites/${type}s`, {
        userdata?._id,
        [`${type}Id`]: itemId,
      });
      return data;
    },
  });

  // Remove from favorites (track or release)
  const removeFromFavorites = useMutation({
    mutationFn: async ({ type, itemId, userdata?._id }: AddFavoriteInput) => {
      console.log(`Removing ${type} from favorites`, { itemId, userdata?._id });
      const { data } = await api.delete(
        `/api/favorites/${type}s/${userdata?._id}/${itemId}`
      );
      return data;
    },
  });

  return {
    favoriteTracks: getFavoriteTracks.data?.data?.tracks || [],
    favoriteReleases: getFavoriteReleases.data?.data?.releases || [],
    isLoadingTracks: getFavoriteTracks.isLoading,
    isLoadingReleases: getFavoriteReleases.isLoading,
    addToFavorites,
    removeFromFavorites,
  };
};
