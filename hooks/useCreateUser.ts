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
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (input: User) => {
      const { data } = await api.post("/api/user/createuser", input);
      console.log("input", input)
      console.log("data", data)
      store.dispatch(setUserData(data.data.user));
      return data;
    },
  });
};
