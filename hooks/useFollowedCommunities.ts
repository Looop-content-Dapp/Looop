import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type Member = {
  _id: string;
  userId: {
    _id: string;
    email: string;
    profileImage: string;
  };
  communityId: string;
  joinDate: string;
};

type TribePass = {
  collectibleName: string;
  collectibleDescription: string;
  collectibleImage: string;
  collectibleType: string;
  contractAddress: string;
  communitySymbol: string;
  transactionHash: string;
};

type Creator = {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  verified: boolean;
};

export type Community = {
  _id: string;
  communityName: string;
  description: string;
  coverImage: string;
  tribePass: TribePass;
  createdBy: Creator;
  status: string;
  memberCount: number;
  NFTToken: number;
  createdAt: string;
  updatedAt: string;
  members: Member[];
};

export const useFollowedCommunities = (userId: string) => {
  return useQuery({
    queryKey: ['followedCommunities', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/community/followed/${userId}`);
      return data.data as Community[];
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchIntervalInBackground: false, // Only refetch when window is focused
    staleTime: 5000, // Consider data stale after 5 seconds
  });
};
