import { ArrowDown01Icon, Copy01Icon } from "@hugeicons/react-native";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { XIONB, StarknetB } from "@/assets/images/images";
import { useState } from "react";

type WalletBalanceProps = {
  balances: {
    xion: number;
    starknet: number;
    total: number;
  };
  addresses: { chain: string; address: string }[];
  onCopyAddress?: (address: string) => void;
};

export default function WalletBalance({ balances, addresses, onCopyAddress }: WalletBalanceProps) {
  const [selectedTab, setSelectedTab] = useState("All balances");
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  const exchangeRate = 1450; // NGN to USD rate (should come from API)

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getDisplayBalance = (amount: number) => {
    if (currency === "NGN") {
      return `₦${formatNumber(amount * exchangeRate)}`;
    }
    return `$${formatNumber(amount)}`;
  };

  const getCurrentBalance = () => {
    switch (selectedTab) {
      case "XION":
        return getDisplayBalance(balances?.xion);
      case "Starknet":
        return getDisplayBalance(balances?.starknet);
      default:
        return getDisplayBalance(balances?.total);
    }
  };

  return (
    <View className="px-4 py-6">
      <View className="flex-row gap-x-2 my-4 mx-auto border border-[#202227] pl-[5px] pr-[4px] py-[4px] rounded-[24px]">
        {["All balances", "XION", "Starknet"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`${
              selectedTab === tab ? "bg-[#202227] px-[12px] py-[6px]" : ""
            } px-4 py-2 rounded-full`}
          >
            <Text className="text-[#D2D3D5] text-[12px] font-PlusJakartaSansMedium">{tab}</Text>
          </TouchableOpacity>
        ))}
         <TouchableOpacity
          onPress={() => setCurrency(currency === "USD" ? "NGN" : "USD")}
          className="bg-[#202227] px-3 py-[6px] flex-row items-center rounded-full"
        >
          <Text className="text-[#D2D3D5] text-[12px]">
            {currency === "USD" ? "NGN" : "USD"}
          </Text>
          <ArrowDown01Icon size={18} color="#63656B" variant="solid" />
        </TouchableOpacity>
      </View>

      <View className="mx-auto items-center">
        <Text className="text-[#63656B] text-[14px] mb-2">Wallet balance</Text>
        <Text className="text-white text-[40px] font-PlusJakartaSansBold">
          {getCurrentBalance()}
        </Text>

      </View>

      <View className="bg-[#202227] p-[20px] gap-y-[12px] mt-[32px] rounded-[10px]">
        <Text className="text-[14px] text-[#63656B] font-PlusJakartaSansMedium">
          Wallet addresses
        </Text>
        <View className="gap-y-[16px]">
          {addresses.map((addr, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between"
              onPress={() => onCopyAddress?.(addr.address)}
            >
              <View className="flex-row items-center gap-x-2">
                <Image
                  source={addr.chain === "XION" ? XIONB : StarknetB}
                  className="w-6 h-6"
                />
                <Text className="text-[#f4f4f4] text-[16px] font-PlusJakartaSansMedium">
                  {addr.address}
                </Text>
              </View>
              <Copy01Icon size={16} color="#63656B" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
