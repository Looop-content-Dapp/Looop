import { StarknetB } from "@/assets/images/images";
import { ArrowDown01Icon, Copy01Icon } from "@hugeicons/react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

type WalletBalanceProps = {
  balances?: {
    starknet: number;
  };
  balance?: string;
  addresses: { chain: string; address: string }[];
  isLoading?: boolean;
  onCopyAddress?: (address: string) => void;
  usdcPrice?: number;
};

export default function WalletBalance({
  balances,
  balance,
  addresses = [],
  isLoading = false,
  onCopyAddress,
  usdcPrice = 1,
}: WalletBalanceProps) {
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const { width } = useWindowDimensions();
  const exchangeRate = 1450;

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getDisplayBalance = (amount: number | undefined) => {
    if (amount === undefined) return "$0.00";

    const usdAmount = amount * usdcPrice;

    if (currency === "NGN") {
      return `₦${formatNumber(usdAmount * exchangeRate)}`;
    }
    return `$${formatNumber(usdAmount)}`;
  };

  const getCurrentBalance = () => {
    if (balance) {
      const numericBalance = parseFloat(balance.replace(/[$,₦]/g, "")) || 0;
      const usdAmount = numericBalance * usdcPrice;

      return currency === "NGN"
        ? `₦${formatNumber(usdAmount * exchangeRate)}`
        : `$${formatNumber(usdAmount)}`;
    }

    return getDisplayBalance(balances?.starknet);
  };

  // Calculate responsive font size based on screen width
  const getResponsiveFontSize = () => {
    if (width < 360) return 28;
    if (width < 400) return 32;
    if (width < 480) return 36;
    return 40;
  };

  return (
    <View className="px-4 py-6">
      {/* Centered Currency Selector with Wallet Balance Label */}
      <View className="flex-row justify-center my-4">
        <TouchableOpacity
          onPress={() => setCurrency(currency === "USD" ? "NGN" : "USD")}
          className="border-[1px] border-[#202227] p-[4px] flex-row items-center rounded-full"
          style={{ alignItems: "center" }}
        >
          <View className="bg-[#202227] px-[12px] py-[6px] rounded-full">
            <Text className="text-[#D2D3D5] text-[12px] font-PlusJakartaSansMedium mr-2">
              Wallet balance
            </Text>
          </View>
          <View className="flex-row items-center py-[4px] px-[8px]">
            <Text className="text-[14px] text-[#D2D3D5] font-PlusJakartaSansBold mx-1">
              {currency}
            </Text>
            <ArrowDown01Icon size={18} color="#63656B" variant="solid" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Balance Display */}
      <View className="mx-auto items-center">
        {isLoading ? (
          <View className="justify-center items-center">
            <ActivityIndicator size="large" color="#FF8A49" />
          </View>
        ) : (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              fontSize: getResponsiveFontSize(),
              fontFamily: "PlusJakartaSans-Bold",
              color: "#FFFFFF",
              textAlign: "center",
              width: "100%",
            }}
          >
            {getCurrentBalance()}
          </Text>
        )}
      </View>

      {/* Wallet Addresses */}
      <View className="bg-[#202227] p-[16px] gap-y-[10px] mt-[32px] rounded-[10px]">
        <Text className="text-[14px] text-[#63656B] font-PlusJakartaSansMedium">
          Wallet addresses
        </Text>
        <View className="gap-y-[12px]">
          {addresses
            .filter((addr) => addr.chain === "Starknet")
            .map((addr, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between"
                onPress={() => addr.address && onCopyAddress?.(addr.address)}
              >
                <View className="flex-row items-center gap-x-2 flex-1">
                  <Image source={StarknetB} className="w-5 h-5" />
                  <Text
                    className="text-[#f4f4f4] text-[16px] font-PlusJakartaSansMedium flex-1"
                    numberOfLines={1}
                  >
                    {addr.address
                      ? `${addr.address.slice(0, 35)}...`
                      : "No address"}
                  </Text>
                </View>
                <Copy01Icon
                  size={16}
                  color="#63656B"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            ))}
        </View>
      </View>
    </View>
  );
}
