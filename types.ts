interface SignInResponse {
  message: string;
  data: SignInUserData;
}

interface SignInUserData {
  _id: string;
  email: string;
  username: string;
  profileImage: string;
  bio: string;
  isPremium: boolean;
  following: number;
  friendsCount: number;
  artistPlayed: number;
  faveArtists: any[];
  preferences: any[];
}

// following artist
interface IFollowing {
  _id: string;
  following: string;
  followedAt: string;
  __v: number;
  artist: {
    _id: string;
    artistId: string;
    __v: number;
    biography: string;
    country: string | null;
    createdAt: string;
    email: string;
    followers: number;
    genres: string[];
    images: {
      url: string;
      height: number;
      width: number;
      _id: string;
    }[];
    isActive: boolean;
    labels: string[];
    monthlyListeners: number;
    name: string;
    password: string;
    popularity: number;
    roles: string[];
    socialLinks: {
      spotify: string;
      instagram: string | null;
      twitter: string | null;
      facebook: string | null;
      website: string | null;
      _id: string;
    };
    topTracks: string[];
    updatedAt: string;
    verified: boolean;
  };
}
