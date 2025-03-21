import api from "@/config/apiConfig";
import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/auth";
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
  oauthprovider?: "google" | "apple";
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (input: User) => {
        console.log("Attempting to create user", input)
      const { data } = await api.post("/api/user/createuser", input);
      store.dispatch(setUserData(data.data.user));
      return data;
    },
  });
};
