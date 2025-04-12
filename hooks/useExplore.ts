import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type TrackMetadata = {
  genre: string[];
  isrc: string;
  language: string;
};

type TrackRelease = {
  _id: string;
  title: string;
  artwork: {
    high: string;
    medium: string;
    low: string;
    thumbnail: string;
  };
  type: string;
  releaseDate: string;
};

type TrackArtist = {
  _id: string;
  name: string;
  image: string;
};

type BaseTrackAnalytics = {
  totalStreams: number;
  playlists: number;
  shares: number;
};

type WorldwideTrackAnalytics = BaseTrackAnalytics & {
  recentStreams: number;
};

type LocationTrackAnalytics = BaseTrackAnalytics & {
  regionalStreams: number;
  likes: number;
};

type BaseTrack = {
  _id: string;
  title: string;
  duration: number;
  metadata: TrackMetadata;
  release: TrackRelease;
  artist: TrackArtist;
};

type WorldwideTrack = BaseTrack & {
  globalScore: number;
  analytics: WorldwideTrackAnalytics;
  rank: number;
};

type LocationTrack = BaseTrack & {
  score: number;
  analytics: LocationTrackAnalytics;
};

export const useExplore = (countryCode: string) => {
  const worldwideTracks = useQuery({
    queryKey: ['worldwide-tracks'],
    queryFn: async () => {
      const { data } = await api.get("/api/song/discover/worldwide");
      return data.data as WorldwideTrack[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  const locationTracks = useQuery({
    queryKey: ['location-tracks', countryCode],
    queryFn: async () => {
      const { data } = await api.get(`/api/song/discover/location?countryCode=${countryCode}`);
      return data.data as LocationTrack[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

  return {
    worldwideTracks,
    locationTracks,
    isLoading: worldwideTracks.isLoading || locationTracks.isLoading,
    isError: worldwideTracks.isError || locationTracks.isError,
  };
};
