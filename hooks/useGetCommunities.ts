import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

export interface TribePass {
  collectibleName: string;
  collectibleDescription: string;
  collectibleImage: string;
  collectibleType: string;
  contractAddress: string;
  communitySymbol: string;
  transactionHash: string;
}

interface User {
  _id: string;
  name?: string;
  email: string;
  profileImage: string;
  verified?: boolean;
}

interface Member {
  _id: string;
  userId: {
    _id: string;
    email: string;
    profileImage: string;
  };
  communityId: string;
  joinDate: string;
  __v: number;
}

export interface Community {
  _id: string;
  communityName: string;
  description: string;
  coverImage: string;
  tribePass: TribePass;
  createdBy: User;
  status: string;
  memberCount: number;
  NFTToken: number;
  createdAt: string;
  updatedAt: string;
  members: Member[];
  isJoined?: boolean;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Community[];
}

export const useGetCommunities = () => {
  return useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse>("/api/community");
      return data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 10000,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
};
