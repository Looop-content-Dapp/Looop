import api from "@/config/apiConfig";
import { Transaction } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

// Hook for fetching user transactions list
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
    staleTime: 30 * 1000, // Data stays fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 3,
  });
};

// Hook for fetching single transaction details
export const useTransactionDetails = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const { data } = await api.get(`/api/transactions/${transactionId}`);
      return data as Transaction;
    },
    enabled: !!transactionId,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
  });
};
