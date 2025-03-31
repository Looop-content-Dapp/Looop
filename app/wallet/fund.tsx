import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import FilterButton from "@/components/app-components/FilterButton";
import { useAppSelector } from "@/redux/hooks";
import { ArrowRight01Icon, BankIcon } from "@hugeicons/react-native";

const FundWalletScreen = () => {
  const navigation = useNavigation();
  const [selectedChain, setSelectedChain] = useState('XION');
  const { userdata } = useAppSelector(state => state.auth);

  const chainOptions = ['XION', 'Starknet'];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Fund Wallet" onBackPress={() => router.back()} />,
    });
  }, [navigation]);

  const handleStablecoinFunding = () => {
    router.push({
      pathname: "/wallet/stablecoinFunding",
      params: {
        chain: selectedChain,
        address: userdata?.wallets?.[selectedChain.toLowerCase()]?.address
      }
    });
  };

  const handleBankTransfer = () => {
    // Implement bank transfer logic
    console.log("Bank transfer selected");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#040405]">
      <View className="px-6 mt-6">
        <View className="flex-row items-center justify-between px-[16px]">
        <Text className="text-[24px] font-PlusJakartaSansBold text-white mb-2">
          Top up USD
        </Text>

        <View className="mb-4">
          <FilterButton
            options={chainOptions}
            selectedOption={selectedChain}
            onOptionSelect={setSelectedChain}
          />
        </View>
        </View>


        {/* Add via stablecoins */}
        <TouchableOpacity
          onPress={handleStablecoinFunding}
          className="bg-[#111318] p-4 rounded-[10px] mb-4 flex-row items-center"
        >
          <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
            <Image
              source={require("@/assets/images/usdc-icon.png")}
              className="w-6 h-6"
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-[16px] text-white font-PlusJakartaSansBold">
                Add via stablecoins
              </Text>
              <View className="ml-2 bg-[#FF6D1B20] px-2 py-1 rounded">
                <Text className="text-[#FF6D1B] text-[12px] font-PlusJakartaSansMedium">
                  NEW
                </Text>
              </View>
            </View>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              Fund your US balance with USDC. Arrives in 1-5 mins
            </Text>
          </View>
          <ArrowRight01Icon size={24} color="#787A80" />
        </TouchableOpacity>

        {/* Add via bank transfer */}
        <TouchableOpacity
          onPress={handleBankTransfer}
          className="bg-[#111318] p-4 rounded-[10px] flex-row items-center"
        >
          <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
           <BankIcon size={24} color="#FF6D1B" variant="solid" />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] text-white font-PlusJakartaSansBold">
              Add via Credit/Debit Card
            </Text>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              Fund your account through credit or debit card.
            </Text>
          </View>
          <ArrowRight01Icon size={24} color="#787A80" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FundWalletScreen;
