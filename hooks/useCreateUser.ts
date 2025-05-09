import api from "@/config/apiConfig";
import { setChannel, setUserData } from "@/redux/slices/auth";
import store from "@/redux/store";
import { useMutation } from "@tanstack/react-query";

type User = {
  email: string;
  password: string;
  username: string;
  fullname: string;
  age: string;
  gender: string;
  referralCode?: string;
  oauthprovider?: "google" | "apple" | "xion" | "argent";
  walletAddress?: string;
  bio: string
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (input: User) => {
        console.log("Attempting to create user", input)
      const { data } = await api.post("/api/user/createuser", input);
      store.dispatch(setUserData(data.data.user));
      store.dispatch(setChannel(input.oauthprovider))
      return data;
    },
  });
};
