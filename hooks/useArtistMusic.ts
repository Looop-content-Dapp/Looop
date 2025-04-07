import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";

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
    const { userdata } = useAppSelector((auth) =>  auth.auth)
  return useQuery<ArtistMusicResponse>({
    queryKey: ['artistMusic', userdata?.artist],
    queryFn: async () => {
      const { data } = await api.get(`/api/artists/music/${userdata?.artist}`);
      return data;
    },
    enabled: !!userdata?.artist,
  });
};
