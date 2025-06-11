import { useMutation } from "@tanstack/react-query";
import api from "@/config/apiConfig";


interface VerifyEmailInput {
  email: string;
}

export const useSendEmailOTP = () => {
  return useMutation({
    mutationFn: async (input: VerifyEmailInput) => {
      const { data } = await api.post("/api/user/verify-email", input);
      return data;
    },
  });
};
