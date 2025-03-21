import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

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

interface SingleTrackResponse {
  data: {
    _id: string;
    title: string;
    duration: number;
    artist: {
      name: string;
      image: string;
    };
    release: {
      _id: string;
      artwork: {
        high: string;
        medium: string;
        low: string;
        thumbnail: string;
      };
    };
  };
  message: string;
  meta: {
    idType: string;
    totalTracks: number;
  };
}

interface TracksResponse {
  data: {
    tracks: Track[];
  };
}

export const useTracksByMusic = (id: string, type: 'track' | 'release' = 'release') => {
  return useQuery({
    queryKey: ["tracks", id, type],
    queryFn: async () => {
      try {
        console.log(`Fetching tracks for ${type} with ID: ${id}`);
        const response = await api.get<SingleTrackResponse | TracksResponse>(
          type === 'track'
            ? `/api/song/releases/${id}/tracks?idType=track`
            : `/api/song/releases/${id}/tracks`
        );
        console.log("Response data:", response.data);

        // Transform single track response to match expected format
        if (type === 'track' && 'meta' in response.data) {
          const singleTrackResponse = response.data as SingleTrackResponse;
          return {
            data: {
              tracks: [{
                _id: singleTrackResponse.data._id,
                title: singleTrackResponse.data.title,
                duration: singleTrackResponse.data.duration,
                artist: singleTrackResponse.data.artist,
                release: {
                  artwork: singleTrackResponse.data.release.artwork
                }
              }]
            }
          };
        }

        // Handle release response
        const tracksResponse = response.data as TracksResponse;
        if (!tracksResponse.data?.tracks) {
          throw new Error('Invalid response format: tracks data is missing');
        }

        return tracksResponse;
      } catch (error) {
        console.error('Error fetching tracks:', {
          error,
          id,
          type,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Query error in useTracksByMusic:', error);
    }
  });
};
