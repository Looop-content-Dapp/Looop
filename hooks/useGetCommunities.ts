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

export interface Community {
  _id: string;
  communityName: string;
  description: string;
  coverImage: string;
  tribePass: TribePass;
  status: string;
  memberCount: number;
  isJoined?: boolean;
}

export const useGetCommunities = () => {
  return useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const { data } = await api.get("/api/community");
      return data.data as Community[];
    },
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchIntervalInBackground: false, // Only refresh when tab is active
  });
};
