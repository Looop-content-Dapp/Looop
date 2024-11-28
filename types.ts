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
