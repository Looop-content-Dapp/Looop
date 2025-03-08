import { CallData, Contract, RpcProvider } from 'starknet';
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
    const provider = new RpcProvider({
      nodeUrl: 'https://starknet-sepolia.public.blastapi.io/rpc/v0_6'
    });

    const calldata = CallData.compile({ user: address });
    const response = await provider.callContract({
      contractAddress: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      entrypoint: "balanceOf",
      calldata
    });

    const balance = response.result[0];
    console.log('Starknet balance:', balance);

    return {
      success: true,
      data: {
        address,
        balance: balance,
        denom: "ETH"
      },
      message: 'StarkNet balance retrieved successfully'
    };
  } catch (error) {
    console.error('Starknet balance error details:', error);
    return {
      success: false,
      data: null,
      message: `Failed to fetch Starknet balance: ${error.message || 'Unknown error'}`
    };
  }
};
