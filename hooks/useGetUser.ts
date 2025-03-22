import api from "@/config/apiConfig";
import { setUserData } from "@/redux/slices/auth";
import store from "@/redux/store";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = (userId?: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/user/${userId}`);
      store.dispatch(setUserData(data.data));
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000,
    onError: (error) => {
      console.error('❌ Error fetching user data:', error);
    }
  });
};
