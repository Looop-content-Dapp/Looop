import { useMutation } from "@tanstack/react-query";
import api from "@/config/apiConfig";
import store from "@/redux/store";
import { setUserData } from "@/redux/slices/auth";

interface LoginInput {
  email: string;
  password: string;
}

interface Wallets {
  starknet: string;
  xion: {
    address: string;
  };
}

interface UserData {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  age: string;
  gender: string;
  profileImage: string | null;
  bio: string | null;
  isPremium: boolean;
  tel: string | null;
  role: string;
  oauthTokens: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  artist: null;
  artistClaim: null;
  wallets: Wallets;
}

interface LoginResponse {
  status: string;
  message: string;
  data: UserData;
}

export const useLogin = () => {

  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post("/api/user/signin", input);
      console.log("data", data)
      store.dispatch(setUserData(data.data));
      return data;
    },
  });
};
