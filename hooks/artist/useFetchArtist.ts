import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type Track = {
  id: string;
  title: string;
  playCount: number;
  likeCount: number;
  artworkUrl: string | null;
  createdAt: string;
};

type Artist = {
  id: string;
  userId: string | null;
  artistId: string;
  name: string;
  email: string;
  profileImage: string;
  biography: string;
  address1: string | null;
  address2: string | null;
  country: string;
  postalcode: string | null;
  city: string | null;
  websiteurl: string;
  monthlyListeners: number;
  followers: number;
  isFollowed: boolean;
  verified: boolean;
  verifiedAt: string | null;
  socialLinks: {
    spotify: string;
    twitter: string | null;
    website: string | null;
    facebook: string | null;
    instagram: string | null;
  };
  popularity: number;
  topTracks: any[];
  roles: string[];
  labels: any[];
  isActive: boolean;
  wallet: any | null;
  claimedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: any | null;
  tracks: Track[];
  _count: {
    tracks: number;
    communities: number;
    subscriptions: number;
  };
  genres: any[];
};

export const useFetchArtist = (artistId: string) => {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: async () => {
      const { data } = await api.get(`/artists/profile/${artistId}`);
      return data.data.artist;
    },
  });
};
