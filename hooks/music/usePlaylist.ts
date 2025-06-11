import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";

type Playlist = {
  title: string;
  userId: string;
};

type AddSongInput = {
  tracks: string | string[];
  playlistIds: string | string[];
  userId: string;
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
      console.log("Attempting to add songs to playlists", input);
      const { data } = await api.post("/api/playlist/songs/add", input);
      return data;
    },
    onError: (error) => {
      console.error('Failed to add songs to playlists:', error.message);
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

type Artist = {
  _id: string;
  name: string;
  imageUrl: string;
};

type Release = {
  _id: string;
  title: string;
  imageUrl: string;
  releaseDate: string;
  type: string;
};

type Track = {
  _id: string;
  title: string;
  duration: number;
  bpm: number;
  key: string;
  genre: string;
  isrc: string;
  explicit: boolean;
  audioFileUrl: string;
  waveformUrl: string;
  artist: Artist;
  release: Release;
};


type SongData = {
  _id: string;
  fileUrl: string;
  format: string;
  bitrate: number;
};

type PlaylistSong = {
  _id: string;
  title: string;
  duration: number;
  songData: SongData;
  releaseImage: string;
  artist: Artist; // Added artist field
};

type PlaylistDetails = {
  _id: string;
  title: string;
  coverImage: string;
  numberOfSaves: number;
  numberOfSongs: number;
  totalDuration: number; // Added totalDuration field
  songs: PlaylistSong[];
};

export const usePlaylistDetails = (playlistId: string) => {
  return useQuery({
    queryKey: ["playlistDetails", playlistId],
    queryFn: async () => {
      const { data } = await api.get(`/api/playlist/playlist/${playlistId}`);
      return data.data as PlaylistDetails;
    },
    enabled: !!playlistId,
    staleTime: 10000,
    retry: 2,
  });
};
