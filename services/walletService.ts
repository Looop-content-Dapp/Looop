import { Provider, CallData } from 'starknet';
import api from '@/config/apiConfig';

export const getXionBalance = async (address: string) => {
  try {
    const response = await api.get(`https://xion-wallet-rc5g.onrender.com/api/wallet/balance/${address}`);
    console.log("response from xion", parseFloat(response.data.data.balance) / 1000000)
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch XION balance');
  }
};

export const getStarknetBalance = async (address: string) => {
  try {
    const provider = new Provider({
      sequencer: {
        baseUrl: process.env.EXPO_PUBLIC_STARKNET_RPC_URL || 'https://free-rpc.nethermind.io/sepolia-juno/v0_7'
      }
    } as any);

    const balance = await provider.callContract({
      contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      entrypoint: "balanceOf",
      calldata: CallData.compile({ user: address })
    });

    return {
      success: true,
      data: {
        address,
        balance: balance.toString(),
        denom: "ETH"
      },
      message: 'StarkNet balance retrieved successfully'
    };
  } catch (error) {
    throw new Error('Failed to fetch Starknet balance');
  }
};
