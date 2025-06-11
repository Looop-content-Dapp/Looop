import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type VerifyUsernameInput = {
   username: string
};

export const useCheckUsername = () => {
  return useMutation({
    mutationFn: async (input: VerifyUsernameInput) => {
      const { data } = await api.post("/api/user/check", input);
      return data;
    },
  });
};
