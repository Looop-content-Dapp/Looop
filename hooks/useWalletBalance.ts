import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type WalletBalanceResponse = {
  status: string;
  message: string;
  data: {
    xion: {
      address: string;
      balances: Array<{
        denom: string;
        amount: string;
        amountFloat: number;
        usdValue: number;
      }>;
    };
    starknet: {
      address: string;
      balance: {
        address: string;
        balance: string;
        balanceFloat: number;
        usdcPrice: number;
        usdValue: number;
      };
    };
    usdcPrice: number;
  };
};

export const useWalletBalance = (userId: string) => {
  return useQuery<WalletBalanceResponse>({
    queryKey: ['wallet-balance', userId],
    queryFn: async () => {
      const { data } = await api.get(`/user/wallet-balance/${userId}`);
      return data;
    },
    enabled: !!userId, // Only run the query if userId is provided
  });
};
