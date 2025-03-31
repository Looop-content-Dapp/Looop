import api from "@/config/apiConfig";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

export const useTransaction = (userId: string, autoRefreshInterval = 50000) => {
  return useQuery({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/transactions/user/${userId}`);
      return data as Transaction[];
    },
    enabled: !!userId,
    refetchInterval: autoRefreshInterval,
    refetchOnWindowFocus: true,
  });
};
