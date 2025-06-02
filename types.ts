interface SignInResponse {
  message: string;
  data: SignInUserData;
}

interface Wallets {
    starknet: {
      address: string | null;
      balance: number;
    } | null;
    xion: {
      address: string;
      mnemonic: string;
      balance: number;
    } | null;
}

interface SignInUserData {
    _id: string;
    email: string;
    username: string;
    fullname: string;
    age: string;
    gender: 'male' | 'female';
    password: string;
    profileImage: string | null;
    bio: string | null;
    isPremium: boolean;
    tel: number | null;
    location: {
      country: string | null;
      state: string | null;
      city: string | null;
    };
    socialLinks: {
      instagram: string | null;
      twitter: string | null;
      facebook: string | null;
      website: string | null;
    };
    preferences: {
      favoriteGenres: string[];
      language: string;
      notifications: {
        email: boolean;
        push: boolean;
      };
      currency: 'USD' | 'EUR' | 'GBP' | 'NGN' | 'GHS' | 'KES' | 'ZAR';
      chain: 'XION' | 'STARKNET';
      theme: 'light' | 'dark' | 'system';
      displayMode: 'compact' | 'comfortable';
    };
    role: 'LISTENER' | 'ARTIST' | 'ADMIN';
    wallets: Wallets;
    nftContracts: Array<{
      contractAddress: string;
      communityId: string;
      mintedAt: string;
    }>;
    oauthTokens: string[];
    artist: string;
    artistClaim: string | null;
    referralCode: string;
    referralCount: number;
    referralCodeUsed: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
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
