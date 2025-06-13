import { useWalletBalance } from "@/hooks/payment/useWalletBalance";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

const ChainPicker = () => {
  const { data: walletData, isLoading } = useWalletBalance();
  console.log(walletData, "walletData");

  const getFormattedBalance = (amount: number) => {
    return amount.toFixed(3);
  };

  const starknetBalance =
    walletData?.data?.starknet?.usdValue || 0;
  console.log(starknetBalance, "starknetBalance");

  const renderBalance = (balance: number) => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#A5A6AA" />;
    }
    return `${getFormattedBalance(balance)} USDC`;
  };

  return (
    <View className="bg-[#0A0B0F] border border-[#1B1E26] px-[8px] py-[11px] rounded-[16px]">
      <View className="flex-row items-center bg-[#12141B] justify-between rounded-[14px] pl-[21px] pr-[12px] py-[11px]">
        <View className="flex-row items-center gap-x-[8px]">
          <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
            {renderBalance(starknetBalance)}
          </Text>
          <Image
            source={require("../../assets/images/usdc-icon.png")}
            className="w-5 h-5"
          />
          <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
            USDC
          </Text>
        </View>
        <Image
          source={require("../../assets/images/starknet.png")}
          className="w-5 h-5"
        />
      </View>
    </View>
  );
};

export default ChainPicker;
