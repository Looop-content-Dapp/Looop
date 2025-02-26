import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type User = {
  email: string;
  password: string;
  username: string;
  fullname: string;
  age: string;
  gender: string;
  referralCode?: string;
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (input: User) => {
      const { data } = await api.post("/api/user/createuser", input);
      return data;
    },
  });
};
