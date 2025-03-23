import api from "@/config/apiConfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClaimStatus } from "@/types/index";

export const useCheckArtistClaim = (claimId: string | null) => {
  return useQuery({
    queryKey: ['artistClaim', claimId],
    queryFn: async () => {
      if (!claimId) {
        return { status: 'NOT_SUBMITTED' as ClaimStatus };
      }
      const response = await api.get(`/api/artistclaim/status/${claimId}`);
      return response.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: !!claimId,
  });
};
