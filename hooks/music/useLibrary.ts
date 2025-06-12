import api from "@/config/apiConfig";
import { useQuery as useCoreQuery } from "@/hooks/core/useQuery";
import { StreamData } from "@/types/player";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCallback } from "react";

export const useLibrary = (userId?: string) => {
  const lastPlayed = useQuery({
    queryKey: ["lastPlayed", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/song/history/last-played/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 300000, // 5 minutes
  });

  const playlists = useQuery({
    queryKey: ["userPlaylists", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/playlist/user/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 300000,
  });

  const topSongs = useQuery({
    queryKey: ["topSongs", userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/song/insights/top-songs/${userId}`);
      return data;
    },
    enabled: !!userId,
    staleTime: 3600000, // 1 hour
  });

  const pinPlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      const { data } = await api.post(`/api/playlist/pin/${playlistId}`);
      return data;
    },
    onError: (error) => {
      console.error("Failed to pin/unpin playlist:", error);
    },
  });

  const streamSongMutation = useMutation({
    mutationFn: async ({
      songId,
      userId,
      streamData,
    }: {
      songId: string;
      userId: string;
      streamData: StreamData;
    }) => {
      try {
        const { data } = await api.post(
          `/api/song/stream/${songId}/${userId}`,
          streamData
        );
        return data;
      } catch (error) {
        // Check if it's a network error
        if (axios.isAxiosError(error) && !error.response) {
          throw new Error("Network error: Please check your connection");
        }
        // Check if it's a server error
        if (axios.isAxiosError(error) && error.response?.status === 500) {
          throw new Error("Server error: Unable to record stream");
        }
        throw error;
      }
    },
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    onError: (error) => {
      console.error("Error streaming song:", error.message);
    },
  });

  const { streamTrack } = useCoreQuery();

  const handleStreamSong = useCallback(
    async (
      songId: string,
      streamUserId: string,
      network?: { isConnected?: boolean; isWifi?: boolean },
      device?: { modelName?: string },
      location?: { region?: string }
    ) => {
      // Don't attempt to stream if offline
      if (network?.isConnected === false) {
        console.log("Skipping stream recording while offline");
        return;
      }

      const streamData: StreamData = {
        completionRate: 0,
        timestamp: new Date().toISOString(),
        offline: !network?.isConnected,
        deviceType: device?.modelName || "unknown",
        quality: network?.isWifi ? "high" : "standard",
        region: location?.region,
      };

      try {
        return await streamTrack(streamData);
      } catch (error) {
        console.error("Error streaming track:", error);
        throw error;
      }
    },
    [streamTrack]
  );

  return {
    // Queries
    lastPlayed: {
      data: lastPlayed.data,
      isLoading: lastPlayed.isLoading,
      error: lastPlayed.error,
      refetch: lastPlayed.refetch,
    },
    playlists: {
      data: playlists.data,
      isLoading: playlists.isLoading,
      error: playlists.error,
    },
    topSongs: {
      data: topSongs.data,
      isLoading: topSongs.isLoading,
      error: topSongs.error,
    },
    // Mutations
    pinPlaylist: pinPlaylistMutation.mutateAsync,
    isPinning: pinPlaylistMutation.isPending,
    // Stream functionality
    streamSong: handleStreamSong,
    isStreaming: streamSongMutation.isPending,
  };
};
