import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import WalletBalance from "@/components/wallet/WalletBalance";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import { ArrowRight01Icon, CreditCardIcon, Search01Icon } from "@hugeicons/react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import FilterButton from "@/components/app-components/FilterButton";
import { useAppSelector } from "@/redux/hooks";
import * as Clipboard from 'expo-clipboard';
import PayWithCard from "@/components/bottomSheet/payWithCard";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import {startOnrampSDK, onRampSDKNativeEvent} from '@onramp.money/onramp-react-native-sdk';
import { widthPercentageToDP as wp} from 'react-native-responsive-screen'

const WalletScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Balances');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [isLoading, setIsLoading] = useState(true);
  const { userdata } = useAppSelector(state => state.auth);
  const { data: walletBalanceData, isLoading: loading } = useWalletBalance(userdata?._id);
  const filterOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

  const [walletData, setWalletData] = useState({
    balances: {
      xion: 0,
      starknet: 0,
      total: 0,
    },
    addresses: [
      { chain: "XION", address: `${userdata?.wallets?.xion?.address || ''}` },
      { chain: "Starknet", address: `${userdata?.wallets?.starknet?.address || ''}` },
    ],
    transactions: [
      { title: "Funded wallet on Starknet", amount: "+$10.4", date: "27-02-25 11:10", source: "From card" },
      { title: "Joined a tribe", amount: "-$1.2", date: "27-02-25 11:10", source: "Received a collectible" },
      { title: "Funded wallet on XION", amount: "+$4.6", date: "27-02-25 11:10", source: "From card" },
      { title: "Funded wallet on Starknet", amount: "+$10.4", date: "27-02-25 11:10", source: "From card" },
      { title: "Monthly subscription", amount: "-$1", date: "27-02-25 11:10", source: "From the wallet balance" },
    ],
  });

  // Set navigation header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Wallet" onBackPress={() => router.back()} />,
    });
  }, [navigation]);


  // Fetch wallet balances
  useEffect(() => {
    if (walletBalanceData) {
      const xionBalance = walletBalanceData.data.xion.balances[0].usdValue
      const starknetBalance = walletBalanceData.data.starknet.balance.usdValue;

      setWalletData(prev => ({
        ...prev,
        balances: {
          xion: xionBalance,
          starknet: starknetBalance,
          total: xionBalance + starknetBalance,
        },
      }));
    }
  }, [walletBalanceData]);

  const handleTabPress = (tab: string) => setActiveTab(tab);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  const handleFundWithFiat = () => {
    startOnrampSDK({
        appId: 1, // Replace this with the appID obtained during onboarding
        walletAddress: "xion1dm77sl3ny2sxzuqwue4fmx2tmyp34memsm4qpp", // Replace with the user's wallet address
        flowType: 1, // 1 -> Onramp, 2 -> Offramp, 3 -> Merchant checkout
        fiatType: 6, // 1 -> INR, 2 -> TRY (Turkish Lira) etc. visit Fiat Currencies page to view full list of supported fiat currencies
        paymentMethod: 1, // 1 -> Instant transfer (UPI), 2 -> Bank transfer (IMPS/FAST)
        // ... Include other configuration options here
       network: "NOBLE",
       coinCode: "usdc",
       paymentAddress: "xion1dm77sl3ny2sxzuqwue4fmx2tmyp34memsm4qpp"
    });
  }

  useEffect(() => {
    const onRampEventListener = onRampSDKNativeEvent.addListener(
      'widgetEvents',
      eventData => {
        // Handle all events here
        console.log('Received onRampEvent:', eventData);
      },
    );

    return () => {
      onRampEventListener.remove();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      {/* Tab Navigation */}
      <View className="flex-row justify-around border-b border-[#1A1B1E]">
        <TouchableOpacity
          onPress={() => handleTabPress('Balances')}
          className={`border-b-2 ${activeTab === 'Balances' ? 'border-orange-500 py-[10px] px-[24px]' : 'border-transparent py-[10px] px-[24px]'}`}
        >
          <Text className={`text-[16px] font-PlusJakartaSansMedium ${activeTab === 'Balances' ? 'text-white' : 'text-gray-400'}`}>
            Balances
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleTabPress('Collectibles')}
          className={`border-b-2 ${activeTab === 'Collectibles' ? 'border-orange-500 py-[10px] px-[24px]' : 'border-transparent py-[10px] px-[24px]'}`}
        >
          <Text className={`text-[16px] font-PlusJakartaSansMedium ${activeTab === 'Collectibles' ? 'text-white' : 'text-gray-400'}`}>
            Collectibles
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Balances' ? (
        <>
          <WalletBalance
            balances={walletData.balances}
            addresses={walletData.addresses}
            isLoading={loading}
            usdcPrice={walletBalanceData?.data?.usdcPrice}
            onCopyAddress={async (address) => {
              await Clipboard.setStringAsync(address);
              Alert.alert("Address Copied")
            }}
          />
          {/* Fund with Card Button */}
          <TouchableOpacity
            className="bg-[#202227] mx-4 my-3 px-[16px] pt-[20px] pb-[19px] rounded-[10px] flex-row justify-between items-center"
            onPress={handleFundWithFiat}
          >
            <View className="flex-1 flex-row items-center gap-[16px]">
              <CreditCardIcon size={24} color="#FF8A49" variant="stroke" />
              <View>
                <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium">Fund with card</Text>
                <Text className="text-[14px] text-[#63656B] font-PlusJakartaSansMedium">Fund with Debit or Credit cards</Text>
              </View>
            </View>
            <ArrowRight01Icon size={24} color="#FF8A49" />
          </TouchableOpacity>
          {/* Transaction History */}
          <View className="flex-1 mt-[48px] px-[16px]">
            <View className="flex-row items-center justify-between px-4 py-[12px]">
              <Text className="text-[#D2D3D5] text-[20px] font-PlusJakartaSansMedium">History</Text>
              <FilterButton
                options={filterOptions}
                selectedOption={selectedPeriod}
                onOptionSelect={setSelectedPeriod}
              />
            </View>
            <TransactionHistory transactions={walletData.transactions} />
          </View>
        </>
      ) : (
        <>
          {/* Collectibles Search */}
          <View className="mx-4 my-4">
            <View className="bg-[#111318] py-[15px] rounded-[10px] px-4 flex-row items-center gap-x-[12px] border border-[#202227]">
              <Search01Icon size={16} color="#63656B" variant="stroke" />
              <TextInput
                placeholder="Search collectibles"
                placeholderTextColor="#63656B"
                className="flex-1 text-[14px] text-white font-PlusJakartaSansMedium"
              />
            </View>
          </View>
          {/* Collectibles List */}
          <FlatList
            data={[
              {
                id: '1',
                title: 'Rave Pass',
                price: '$5/month',
                image: require('../../../assets/images/reave-pass.png'),
              },
              {
                id: '1',
                title: 'Rave Pass',
                price: '$5/month',
                image: require('../../../assets/images/reave-pass.png'),
              },
            ]}
            numColumns={2}
            contentContainerStyle={{
              padding: 16,
              alignItems: 'center',
              gap: 16
            }}
            columnWrapperStyle={{
              gap: 16,
              justifyContent: 'center'
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: wp('45%') }}
                className="h-[262px] bg-[#111318] rounded-[10px] border-2 border-[#202227] overflow-hidden"
                onPress={() => { /* Handle collectible press */ }}
              >
                <Image
                  source={item.image}
                  className="w-full h-[140px]"
                  resizeMode="cover"
                />
                <View className="flex-1 p-3">
                  <View className="flex-1">
                    <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium text-[16px] leading-[22px]">
                      {item.title}
                    </Text>
                    <Text className="text-[#63656B] font-PlusJakartaSansMedium text-[12px] leading-[16px] mt-1">
                      {item.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between w-full mt-3">
                    <View className="bg-[#202227] border-[0.5px] border-[#63656B] rounded-full px-3 py-1">
                      <Text className="text-[#f4f4f4] text-[12px] font-PlusJakartaSansMedium">
                        Tribes
                      </Text>
                    </View>
                    <Image
                      source={require("../../../assets/images/logo-gray.png")}
                      className="w-[40px] h-[18px]"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </>
      )}


      <PayWithCard
        isVisible={showPaymentSheet}
        onClose={() => setShowPaymentSheet(false)}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;
