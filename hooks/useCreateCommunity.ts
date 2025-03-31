import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type Community = {
  communityName: string;
  description: string;
  coverImage: string;
  collectibleName: string;
  collectibleDescription: string;
  collectibleImage: string;
  collectibleType: string;
  artistId: string;
  communitySymbol: string;
};

export const useCreateCommunity = () => {
  return useMutation({
    mutationFn: async (input: Community) => {
      console.log("Attempting to create community", input);
      const { data } = await api.post("/api/community/createcommunity", input);
      return data;
    },
  });
};
