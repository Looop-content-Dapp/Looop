import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type Song = {
  title: string;
  fileUrl: string;
  isExplicit: boolean;
  isrc?: string;
  featuredArtists?: Array<{
    artistId: string;
    displayName?: string;
  }>;
  writers?: string[];
  producers?: string[];
};

type ReleaseType = "single" | "ep" | "album";

type SingleRelease = {
  title: string;
  artistId: string;
  type: "single";
  release_date: string | null;
  cover_image: string;
  genre: string[];
  songs: [Song];  // Exactly one song for singles
  isExplicit: boolean;
};

const formatSingleUpload = (trackInfo: any, fileMetadata: any): SingleRelease => {
  return {
    title: trackInfo.trackName,
    artistId: "current-user-id", // You'll need to get this from your auth context
    type: "single",
    release_date: fileMetadata.releaseDate,
    cover_image: trackInfo.coverImage.file.uri,
    genre: [trackInfo.primaryGenre, trackInfo.secondaryGenre].filter(Boolean),
    isExplicit: fileMetadata.explicitLyrics === 'yes',
    songs: [{
      title: trackInfo.trackName,
      fileUrl: fileMetadata.audioFile.file.uri,
      isExplicit: fileMetadata.explicitLyrics === 'yes',
      isrc: fileMetadata.isrc || undefined,
      featuredArtists: trackInfo.featuredArtists.map(artist => ({
        artistId: artist,
        displayName: artist
      })),
      writers: fileMetadata.writers,
      producers: fileMetadata.producers
    }]
  };
};

export const useCreateRelease = () => {
  return useMutation({
    mutationFn: async (input: { trackInfo: any; fileMetadata: any }) => {
      const formattedRelease = formatSingleUpload(input.trackInfo, input.fileMetadata);
      validateSongs(formattedRelease.type, formattedRelease.songs);

      const { data } = await api.post("/api/song/releases/create", formattedRelease);
      return data;
    },
    onError: (error: any) => {
      if (error.message.includes("Daily upload limit")) {
        throw new Error("You have reached your daily upload limit. Please try again tomorrow.");
      }
      throw error;
    },
  });
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
