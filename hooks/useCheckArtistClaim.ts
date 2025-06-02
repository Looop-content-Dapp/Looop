import api from "@/config/apiConfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ClaimStatus } from "@/types/index";
import { useAppSelector } from "@/redux/hooks";

export const useCheckArtistClaim = () => {
    const { userdata } = useAppSelector((auth) => auth.auth)
  return useQuery({
    queryKey: ['artistClaim', userdata?.artistClaim],
    queryFn: async () => {
      if (!userdata?.artistClaim) {
        return { status: 'NOT_SUBMITTED' as ClaimStatus };
      }
      const response = await api.get(`/api/artistclaim/status/${userdata?.artistClaim}`);
      return response.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: !!userdata?.artistClaim,
    refetchInterval: 5000
  });
};
