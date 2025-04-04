import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type Song = {
  title: string;
  fileUrl: string;
  isExplicit?: boolean;
  isInstrumental?: boolean;
  hasLyrics?: boolean;
  bpm?: number;
  key?: string;
  language?: string;
  isrc?: string;
  featuredArtists?: Array<{
    artistId: string;
    contribution?: string;
    billingOrder?: number;
    displayName?: string;
  }>;
};

type ReleaseType = "single" | "ep" | "album";

type Release = {
  title: string;
  artistId: string;
  type: ReleaseType;
  release_date: string;
  cover_image: string;
  genre: string | string[];
  label?: string;
  songs: Song[];
  description?: string;
  isExplicit: boolean;
  metadata?: Record<string, any>;
};

const validateSongs = (type: ReleaseType, songs: Song[]) => {
  if (type === "single" && songs.length !== 1) {
    throw new Error("A single must contain exactly one song");
  }
  if (type === "album" && (songs.length < 5 || songs.length > 25)) {
    throw new Error("An album must contain between 5 and 20 songs");
  }
  if (type === "ep" && (songs.length < 2 || songs.length > 6)) {
    throw new Error("An EP must contain between 2 and 6 songs");
  }
};

export const useCreateRelease = () => {
  return useMutation({
    mutationFn: async (input: Release) => {
      validateSongs(input.type, input.songs);

      const { data } = await api.post("/api/song/releases/create", input);
      return data;
    },
    onError: (error: any) => {
      // Handle specific error cases
      if (error.message.includes("Daily upload limit")) {
        throw new Error("You have reached your daily upload limit. Please try again tomorrow.");
      }
      throw error;
    },
  });
};
