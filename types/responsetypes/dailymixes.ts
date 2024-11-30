interface DailyMixesResponse {
  message: string;
  data: DailyMixesData;
}

interface DailyMixesData {
  mixes: DailyMixesMix[];
  meta: DailyMixesMeta;
}

interface DailyMixesMeta {
  source: string;
  totalMixes: number;
  refreshAvailable: Date;
}

interface DailyMixesMix {
  id: string;
  name: string;
  description: string;
  genre: string;
  artwork: DailyMixesArtwork;
  stats: DailyMixesStats;
  tracks: DailyMixesTrack[];
  generatedAt: Date;
  expiresAt: Date;
  refreshAvailableAt: Date;
}

interface DailyMixesArtwork {
  main: DailyMixesMain;
  mosaic: DailyMixesMain[];
}

interface DailyMixesMain {
  high: string;
  medium: string;
  low: string;
  thumbnail: string;
}

interface DailyMixesStats {
  totalTracks: number;
  totalDuration: number;
  uniqueArtists: number;
}

interface DailyMixesTrack {
  _id: string;
  title: string;
  duration: number;
  release: DailyMixesRelease;
  artist: DailyMixesArtist;
  analytics: DailyMixesAnalytics;
}

interface DailyMixesAnalytics {
  streams: number;
  likes: number;
}

interface DailyMixesArtist {
  _id: string;
  name: string;
}

interface DailyMixesRelease {
  _id: string;
  title: string;
  artwork: DailyMixesMain;
  type: DailyMixesType;
  releaseDate: Date;
}

enum DailyMixesType {
  Album = "album",
  Single = "single",
}
