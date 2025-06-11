import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type Artist = {
  isFollowed: boolean;
  verifiedAt: string | null;
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  biography: string;
  address1: string;
  address2: string;
  country: string;
  postalcode: string;
  city: string;
  websiteurl: string;
  monthlyListeners: number;
  followers: string[];
  verified: boolean;
  socialLinks: {
    spotify: string;
    instagram: string | null;
    twitter: string | null;
    facebook: string | null;
    website: string | null;
    _id: string;
  };
  popularity: number;
  topTracks: any[];
  roles: string[];
  labels: any[];
  isActive: boolean;
  userId: string;
  genres: string[];
  createdAt: string;
  updatedAt: string;
  releases: any[];
  noOfFollowers: number;
  community: any | null;
  communityMembers: any[];
};

export const useFetchArtist = (artistId: string) => {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: async () => {
      const { data } = await api.get(`/api/artist/${artistId}`);
      return data.data.artist;
    },
  });
};
