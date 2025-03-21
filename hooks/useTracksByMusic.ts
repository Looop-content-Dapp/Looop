import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useQuery as useCustomQuery } from "@/hooks/useQuery";

interface Track {
  _id: string;
  title: string;
  duration: number;
  artist: {
    name: string;
    image: string;
  };
  release: {
    artwork: {
      high: string;
      medium: string;
      low: string;
      thumbnail: string;
    };
  };
}

interface TracksResponse {
  data: {
    tracks: Track[];
  };
}

export const useTracksByMusic = (musicId: string) => {
  const { getTracksFromId } = useCustomQuery();

  return useQuery({
    queryKey: ["tracks", musicId],
    queryFn: async () => {
      const response = await getTracksFromId(musicId);
      return response as TracksResponse;
    },
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};
