interface ArtistsYouFollowResponse {
  message: string;
  data: ArtistsYouFollowData;
  pagination: ArtistsYouFollowPagination;
  meta: ArtistsYouFollowMeta;
}

interface ArtistsYouFollowData {
  releases: ArtistsYouFollowReleases;
  timeline: ArtistsYouFollowTimeline;
}

interface ArtistsYouFollowReleases {
  today: any[];
  thisWeek: any[];
  thisMonth: ArtistsYouFollowThisMonth[];
}

interface ArtistsYouFollowThisMonth {
  _id: string;
  title: string;
  analytics: ArtistsYouFollowAnalytics;
  commercial: ArtistsYouFollowCommercial;
  metadata: ArtistsYouFollowMetadata;
  type: ArtistsYouFollowType;
  artist: ArtistsYouFollowArtist;
  daysAgo: number;
  score: number;
  releaseDate: Date;
  artwork: ArtistsYouFollowArtwork;
}

interface ArtistsYouFollowAnalytics {
  totalStreams: number;
  saves: number;
}

interface ArtistsYouFollowArtist {
  _id: string;
  name: string;
}

interface ArtistsYouFollowArtwork {
  high: string;
  medium: string;
  low: string;
  thumbnail: string;
}

interface ArtistsYouFollowCommercial {
  label: ArtistsYouFollowLabel;
}

enum ArtistsYouFollowLabel {
  Independent = "Independent",
}

interface ArtistsYouFollowMetadata {
  genre: ArtistsYouFollowGenre[];
  totalTracks: number;
}

enum ArtistsYouFollowGenre {
  Unknown = "unknown",
}

enum ArtistsYouFollowType {
  Album = "album",
  Single = "single",
}

interface ArtistsYouFollowTimeline {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

interface ArtistsYouFollowMeta {
  source: string;
  timeframe: string;
  followedArtists: number;
  totalReleases: number;
}

interface ArtistsYouFollowPagination {
  current: number;
  total: number;
  hasMore: boolean;
}
