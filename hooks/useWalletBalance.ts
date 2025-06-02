import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";

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

export const useWalletBalance = () => {
  const { userdata } = useAppSelector((auth) => auth.auth);

  return useQuery<WalletBalanceResponse>({
    queryKey: ['wallet-balance', userdata?._id],
    queryFn: async () => {
      if (!userdata?._id) {
        Alert.alert("Please login first");
        throw new Error("User not logged in");
      }
      const { data } = await api.get(`/api/user/wallet-balance/${userdata._id}`);
      return data;
    },
    enabled: !!userdata?._id,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
};
