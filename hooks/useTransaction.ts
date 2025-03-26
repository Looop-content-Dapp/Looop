import api from "@/config/apiConfig";
import { Transaction } from "@/types/transaction";
import { useQuery, Query } from "@tanstack/react-query";

export const useTransaction = (transactionId: string, autoRefreshInterval = 5000) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: async () => {
      const { data } = await api.get(`/api/transactions/${transactionId}`);
      return data as Transaction;
    },
    enabled: !!transactionId,
    refetchInterval: (query: Query<Transaction, Error, Transaction, string[]>) => {
      // Stop auto-refreshing if transaction is in final state
      if (query.state.data?.status === 'success' || query.state.data?.status === 'failed') {
        return false;
      }
      return autoRefreshInterval;
    },
    refetchOnWindowFocus: true,
  });
};
