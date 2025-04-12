import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type Artist = {
  _id: string;
  name: string;
  image: string;
};

type Artwork = {
  high: string;
  medium: string;
  low: string;
  thumbnail: string;
};

type Release = {
  _id: string;
  title: string;
  type: string;
  artwork: Artwork;
  releaseDate: string;
};

type SongData = {
  _id: string;
  fileUrl: string;
  format: string;
  bitrate: number;
};

type Track = {
  _id: string;
  title: string;
  duration: number;
  track_number: number;
  isExplicit: boolean;
  artist: Artist;
  featuredArtists: Omit<Artist, 'image'>[];
  release: Release;
  songData: SongData;
  analytics: {
    streams: number;
    likes: number;
  };
};

type ReleaseResponse = {
  _id: string;
  title: string;
  type: string;
  releaseDate: string;
  artwork: Artwork;
  artist: Artist;
  metadata: {
    totalTracks: number;
    duration: number;
    genre: string[];
    label: string;
  };
  tracks: Track[];
};

export const useTracksByMusic = (releaseId: string, sort?: 'track_number' | 'popularity' | 'title' | 'duration') => {
  return useQuery({
    queryKey: ['tracks', releaseId, sort],
    queryFn: async () => {
      const { data } = await api.get(`/api/song/releases/${releaseId}/tracks${sort ? `?sort=${sort}` : ''}`);
      return data.data as ReleaseResponse | Track;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
    select: (data) => data,
  });
};
