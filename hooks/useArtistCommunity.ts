import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

interface CommunityData {
  _id: string;
  communityName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  price?: number;
  image?: string;
  tribePass?: {
    collectibleName: string;
    collectibleImage: string;
    contractAddress: string;
  };
}

export const useArtistCommunity = (artistId: string) => {
  return useQuery({
    queryKey: ['artistCommunity', artistId],
    queryFn: async () => {
      const { data } = await api.get(`/api/community/${artistId}`);
      return data.data as CommunityData;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
