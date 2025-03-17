import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type JoinCommunityInput = {
  type: string;
  userId: string;
  communityId: string;
  collectionAddress: string;
  userAddress: string;
  transactionReference: string;
};

export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: async (input: JoinCommunityInput) => {
      const { data } = await api.post("/api/community/joincommunity", input);
      return data;
    },
  });
};
