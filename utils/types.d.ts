// types.ts

// Basic building blocks

export interface User {
    name: string;
    verified: boolean;
    avatar: string;
    username: string;
    role: "owner" | "moderator" | "user";  // New: role of the user
  }

  export type MediaType = 'audio' | 'image' | 'video' | null;

  export interface Media {
    type: MediaType;
    duration?: string; // for audio
    audioWaveform?: string; // for audio
    thumbnail?: string[]; // for image and video
  }

  export interface Engagement {
    plays?: string;
    shares?: string;
    likes?: string;
    comments?: string;
  }

  export interface Actions {
    like: boolean;
    comment: boolean;
    share: boolean;
  }

  export interface Comment {
    id: string; // New: Comment ID
    user: User;
    timePosted: string;
    content: string;
    replies?: Reply[]; // New: Replies to the comment
  }

  export interface Reply {
    id: string; // New: Reply ID
    user: User;
    timePosted: string;
    content: string;
  }

  // Aggregated interfaces

  export interface FeedItem {
    id: string; // New: Feed item ID
    user: User;
    timePosted: string;
    content: string;
    media: Media | null;
    engagement: Engagement;
    actions: Actions;
    comments?: Comment[]; // New: Comments on the feed item
  }

  // Main data structure

  export interface FeedData {
    feed: FeedItem[];
  }


  export type Artist = {
    name: string;
    owner: string;
    description: string;
    image: string;
    external_url: string;
    attributes: Attribute[];
    properties: Properties;
    followers: number;
    following: number;
    external_links: ExternalLink[];
    songs: Songs; // Add songs field to the artist type
  };

  export type Attribute = {
    trait_type: string;
    value: string;
  };

  export type Properties = {
    creation_date: string;
    edition: Edition;
    royalties: Royalties;
  };

  export type Edition = {
    total: number;
    current: number;
  };

  export type Royalties = {
    artist: number;
    platform: number;
    community: number;
  };

  export type ExternalLink = {
    name: string;
    url: string;
  };

  // New types for songs, EPs, Albums, and tracks
  export type Songs = {
    singles: Single[];
    eps: EP[];
    albums: Album[];
  };

  export type Single = {
    title: string;
    release_date: string;
    cover_image: string;
    number_of_streams: number;
    genre: string;
    label: string;
    tracks: Track[];
  };

  export type EP = {
    title: string;
    release_date: string;
    cover_image: string;
    number_of_streams: number;
    genre: string;
    label: string;
    tracks: Track[];
  };

  export type Album = {
    title: string;
    release_date: string;
    cover_image: string;
    number_of_streams: number;
    genre: string;
    label: string;
    tracks: Track[];
  };

  export type Track = {
    title: string;
    duration: string;
    streams: number;
    track_number: number;
  };
