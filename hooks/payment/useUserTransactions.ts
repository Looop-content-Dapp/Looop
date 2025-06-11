import api from "@/config/apiConfig";
import { Transaction, TransactionQueryParams } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

export const useUserTransactions = (userId: string, params: TransactionQueryParams) => {
  return useQuery({
    queryKey: ['transactions', userId, params],
    queryFn: async () => {
      const queryString = new URLSearchParams({
        ...(params.type && { type: params.type }),
        page: String(params.page || 1),
        limit: String(params.limit || 10),
      }).toString();

      const { data } = await api.get(`/api/transactions/user/${userId}?${queryString}`);
      return data as { transactions: Transaction[]; total: number };
    },
  });
};
