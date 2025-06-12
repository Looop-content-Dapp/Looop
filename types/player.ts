import { Track as RNTrackPlayerTrack } from "react-native-track-player";

export interface NetworkInfo {
  isConnected: boolean | undefined;
  isWifi: boolean | undefined;
}

export interface DeviceInfo {
  brand: string;
  model: string;
  systemName: string;
  systemVersion: string;
}

export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  country?: string;
  city?: string;
}

export interface TrackData {
  _id: string;
  fileUrl: string;
  duration: number;
  bitrate?: number;
  format?: string;
}

export interface Artist {
  _id: string;
  name: string;
  image?: string;
}

export interface Release {
  artwork: {
    high: string;
    medium?: string;
    low?: string;
  };
  releaseDate?: string;
  label?: string;
}

export interface ExtendedTrack {
  _id: string;
  title: string;
  artist: Artist;
  songData: TrackData;
  release: Release;
  releaseImage?: string;
  genre?: string[];
  bpm?: number;
  key?: string;
  isExplicit?: boolean;
  lyrics?: string;
}

export interface AlbumInfo {
  _id: string;
  title: string;
  type: "album" | "single" | "ep" | "playlist";
  coverImage: string;
  artist: Artist;
  releaseDate?: string;
  totalTracks?: number;
}

export interface PlayerState {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: boolean;
  currentTrackId: string | null;
  currentIndex: number;
  track: ExtendedTrack | null;
  albumInfo: AlbumInfo | null;
  queue: ExtendedTrack[];
  playlist: ExtendedTrack[];
  volume: number;
  muted: boolean;
  loading: boolean;
  error: string | null;
}

export interface FormattedTrack extends RNTrackPlayerTrack {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number;
  album: string;
  genre: string;
  date: string;
}

export interface MusicPlayerState {
  tracks: ExtendedTrack[];
  isAlbumPlaying: boolean;
  currentPlayingIndex: number;
  isLiked: boolean;
  isSaved: boolean;
  loading: boolean;
  error: string | null;
}

export interface StreamData {
  trackId: string;
  userId: string;
  network?: NetworkInfo;
  device?: DeviceInfo;
  location?: LocationInfo;
  timestamp?: number;
  duration?: number;
}
