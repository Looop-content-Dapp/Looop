export interface Artist {
  profileImage?: string;
  avatar?: string;
  name: string;
  verified?: boolean;
}

export interface Member {
  _id: string;
  userId?: string;
  profileImage?: string;
}

export interface TribeItem {
  id: string;
  coverImage: string;
  artist: Artist;
  name: string;
  description: string;
  members: Member[];
  memberCount: number;
}

export interface SubscriptionItem {
  id: string;
  image: string;
  name: string;
  members: Member[];
  memberCount: number;
  status: 'Active member' | string;
  expiry: string;
}
