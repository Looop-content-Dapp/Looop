import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type JoinCommunityInput = {
  userId: string;
  communityId: string;
  type: string;
};

export const useJoinCommunity = () => {
  return useMutation({
    mutationFn: async (input: JoinCommunityInput) => {
      try {
        console.log('Joining community with input:', input);
        const { data } = await api.post("/api/community/joincommunity", input);
        console.log('Join community response:', data);
        return data;
      } catch (error: any) {
        console.error('Join community error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        throw error;
      }
    },
  });
};
