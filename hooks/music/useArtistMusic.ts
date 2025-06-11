import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from '@tanstack/react-query';

type Release = {
  _id: string;
  title: string;
  type: string;
  artwork: string;
  releaseDate: string;
  totalTracks: number;
};

type Song = {
  _id: string;
  title: string;
  duration: string;
  releaseDate: string;
  artwork: string;
  totalStreams: string;
  release: {
    _id: string;
    title: string;
    type: string;
  };
};

type Playlist = {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  totalTracks: number;
  followerCount: number;
};

type ArtistMusicResponse = {
  success: boolean;
  message: string;
  data: {
    releases: {
      total: number;
      items: Release[];
    };
    songs: {
      total: number;
      items: Song[];
    };
    playlists: {
      total: number;
      items: Playlist[];
    };
  };
};

export const useArtistMusic = () => {
  const { userdata } = useAppSelector((auth) => auth.auth);
  const queryClient = useQueryClient();

  // Prefetch next page of data
  const prefetchNextArtistData = async (artistId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['artistMusic', artistId],
      queryFn: async () => {
        const { data } = await api.get(`/api/artists/music/${artistId}`);
        return data;
      },
    });
  };

  return {
    ...useQuery<ArtistMusicResponse>({
      queryKey: ['artistMusic', userdata?.artist],
      queryFn: async () => {
        const { data } = await api.get(`/api/artists/music/${userdata?.artist}`);
        return data;
      },
      enabled: !!userdata?.artist,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    }),
    prefetchNextArtistData,
  };
};
