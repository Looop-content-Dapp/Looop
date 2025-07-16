import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type VerifyEmailInput = {
  email: string;
  otp: string;
};

export const useVerifyEmailOtp = () => {
  return useMutation({
    mutationFn: async (input: VerifyEmailInput) => {
      const { data } = await api.post("/auth/verify-email-otp", input);
      return data;
    },
  });
};
