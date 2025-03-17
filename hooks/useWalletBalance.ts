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
      try {
        const { data } = await api.get(`/user/wallet-balance/${userId}`);
        return data;
      } catch (error) {
        throw new Error('Failed to fetch wallet balance');
      }
    },
    enabled: !!userId,
    staleTime: 30000, // Cache the data for 30 seconds
    refetchOnWindowFocus: true,
  });
};
