import { View, Text, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import FilterButton from "@/components/app-components/FilterButton";
import { useAppSelector } from "@/redux/hooks";
import { ArrowRight01Icon, UserIcon, CreditCardIcon, CoinsDollarIcon } from "@hugeicons/react-native";

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const [selectedChain, setSelectedChain] = useState('XION');
  const { userdata } = useAppSelector(state => state.auth);

  const chainOptions = ['XION', 'Starknet'];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Withdraw Funds" onBackPress={() => router.back()} />,
    });
  }, [navigation]);

  const handleCryptoWithdraw = () => {
    router.push({
      pathname: "/wallet/cryptoWithdraw",
      params: {
        chain: selectedChain,
        address: userdata?.wallets?.[selectedChain.toLowerCase()]?.address
      }
    });
  };

  const handleUsernameWithdraw = () => {
    router.push("/wallet/usernameWithdraw");
  };

  const handleCardWithdraw = () => {
    router.push("/wallet/cardWithdraw");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#040405]">
      <View className="px-6 mt-6">
        <View className="flex-row items-center justify-between px-[16px]">
          <Text className="text-[24px] font-PlusJakartaSansBold text-white mb-2">
            Withdraw Funds
          </Text>

          <View className="mb-4">
            <FilterButton
              options={chainOptions}
              selectedOption={selectedChain}
              onOptionSelect={setSelectedChain}
            />
          </View>
        </View>

        {/* Send via crypto */}
        <TouchableOpacity
          onPress={handleCryptoWithdraw}
          className="bg-[#111318] p-4 rounded-[10px] mb-4 flex-row items-center"
        >
          <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
            <CoinsDollarIcon size={24} color="grey" />
          </View>
          <View className="flex-1">
            <Text className="text-[16px] text-white font-PlusJakartaSansBold">
              Send via crypto
            </Text>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              Send crypto through different networks to any wallet
            </Text>
          </View>
          <ArrowRight01Icon size={24} color="#787A80" />
        </TouchableOpacity>

        {/* Send via username */}
        <View className="mb-4">
          <View className="bg-[#111318] opacity-50 p-4 rounded-[10px] flex-row items-center">
            <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
              <UserIcon size={24} color="#FF6D1B" variant="Bold" />
            </View>
            <View className="flex-1">
              <Text className="text-[16px] text-white font-PlusJakartaSansBold">
                Send via username
              </Text>
              <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
                Send funds instantly to other users using their username
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[12px] text-[#FF6D1B] font-PlusJakartaSansBold mb-1">
                Coming Soon
              </Text>
              <ArrowRight01Icon size={24} color="#787A80" />
            </View>
          </View>
        </View>

        {/* Send to credit card */}
        <View>
          <View className="bg-[#111318] opacity-50 p-4 rounded-[10px] flex-row items-center">
            <View className="w-10 h-10 bg-[#202227] rounded-full items-center justify-center mr-4">
              <CreditCardIcon size={24} color="#FF6D1B" variant="Bold" />
            </View>
            <View className="flex-1">
              <Text className="text-[16px] text-white font-PlusJakartaSansBold">
                Send to credit card
              </Text>
              <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
                Withdraw funds directly to your credit or debit card
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[12px] text-[#FF6D1B] font-PlusJakartaSansBold mb-1">
                Coming Soon
              </Text>
              <ArrowRight01Icon size={24} color="#787A80" />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WithdrawScreen;
