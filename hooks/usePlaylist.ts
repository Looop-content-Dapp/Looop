import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";

type Playlist = {
  title: string;
  userId: string;
};

type AddSongInput = {
  tracks: [];
  playlistId: string;
  userId: string
};

export const useCreatePlaylist = () => {
  return useMutation({
    mutationFn: async (input: Playlist) => {
      const { data } = await api.post("/api/playlist/create", input);
      return data;
    },
    onError: (error) => {
      console.error('Failed to create playlist:', error);
    }
  });
};

export const usePinPlaylist = () => {
  return useMutation({
    mutationFn: async (playlistId: string) => {
      const { data } = await api.post(`/api/playlist/pin/${playlistId}`);
      return data;
    },
    onError: (error) => {
      console.error('Failed to pin playlist:', error);
    }
  });
};

export const useAddSongToPlaylist = () => {
  return useMutation({
    mutationFn: async (input: AddSongInput) => {
        console.log("Attempting to add song to playlist", input)
      const { data } = await api.post("/api/playlist/songs/add", input);
      return data;
    },
    onError: (error) => {
      console.error('Failed to add song to playlist:', error.message);
    }
  });
};

export const useUserPlaylists = () => {
  const { userdata } = useAppSelector((state) => state.auth);
  return useQuery({
    queryKey: ["userPlaylists", userdata?._id],
    queryFn: async () => {
      const { data } = await api.get(`/api/playlist/user/${userdata?._id}`);
      return data || [];
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
    enabled: !!userdata?._id,
    retry: 2,
  });
};
