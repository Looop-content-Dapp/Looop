import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type JoinCommunityInput = {
  userId: string;
  communityId: string;
  type: string;
  collectionAddress: string;
};

export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: async (input: JoinCommunityInput) => {
      const { data } = await api.post("/api/community/joincommunity", input);
      return data;
    },
  });
};
