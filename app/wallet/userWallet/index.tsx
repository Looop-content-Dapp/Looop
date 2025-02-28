import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, Image } from "react-native";
import { router, useNavigation, useRouter } from "expo-router";
import WalletBalance from "@/components/wallet/WalletBalance";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import { ArrowRight01Icon, CreditCardAddIcon, CreditCardIcon, Search01Icon } from "@hugeicons/react-native";
import { useLayoutEffect, useState } from "react";
import { ScreenStackHeaderLeftView } from "react-native-screens";
import { AppBackButton } from "@/components/app-components/back-btn";
import FilterButton from "@/components/app-components/FilterButton";

const WalletScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('Balances');
    const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
    const filterOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

    const handleTabPress = (tab: string) => {
        setActiveTab(tab);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name="Wallet" onBackPress={() => router.back()} />
        })
    })
  const walletData = {
    balances: {
      xion: 15789.23,
      starknet: 16789.25,
      total: 32578.48
    },
    addresses: [
      { chain: "XION", address: "0xA1B2C3D4E5F67890ABCDEF1234..." },
      { chain: "Starknet", address: "0xA1B2C3D4E5F67890ABCDEF1234..." },
    ],
    transactions: [
      { title: "Funded wallet on Starknet", amount: "+$10.4", date: "27-02-25 11:10", source: "From card" },
      { title: "Joined a tribe", amount: "-$1.2", date: "27-02-25 11:10", source: "Received a collectible" },
      { title: "Funded wallet on XION", amount: "+$4.6", date: "27-02-25 11:10", source: "From card" },
      { title: "Funded wallet on Starknet", amount: "+$10.4", date: "27-02-25 11:10", source: "From card" },
      { title: "Monthly subscription", amount: "-$1", date: "27-02-25 11:10", source: "From the wallet balance" },
    ],
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Tabs */}
      <View className="flex-row justify-around border-b border-[#1A1B1E]">
        <TouchableOpacity
          onPress={() => handleTabPress('Balances')}
          className={`border-b-2 ${activeTab === 'Balances' ? 'border-orange-500 py-[10px] px-[24px]' : 'border-transparent py-[10px] px-[24px]'}`}
        >
          <Text className={`text-[16px] font-PlusJakartaSansMedium  ${activeTab === 'Balances' ? 'text-white' : 'text-gray-400'}`}>
            Balances
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('Collectibles')}
        className={`border-b-2 ${activeTab === 'Collectibles' ? 'border-orange-500 py-[10px] px-[24px]' : 'border-transparent py-[10px] px-[24px]'}`}>
          <Text className={`text-[16px] font-PlusJakartaSansMedium  ${activeTab === 'Collectibles' ? 'text-white' : 'text-gray-400'}`}>
            Collectibles
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Balances' ? (
        <>
          {/* Wallet Balance */}
          <WalletBalance
            balances={walletData.balances}
            addresses={walletData.addresses}
            onCopyAddress={(address) => {/* Handle copy address */}}
          />

          {/* Fund with Card Button */}
          <TouchableOpacity className="bg-[#202227] mx-4 my-3 px-[16px] pt-[20px] pb-[19px] rounded-[10px] flex-row justify-between items-center">
            <View className="flex-1 flex-row items-center gap-[16px] ">
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
        <View className="flex-1">
          {/* Search Bar */}
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

          {/* Collectibles Grid */}
          <FlatList
            data={[
              {
                id: '1',
                title: 'Rave Pass',
                price: '$2/month',
                image: require('../../../assets/images/reave-pass.png'),
              },
              // Add more collectibles here
            ]}
            numColumns={2}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="w-[50%] h-[262px] p-[4px] m-2 bg-[#202227] rounded-[10px]"
                onPress={() => {/* Handle collectible press */}}
              >
                <Image
                  source={item.image}
                  className="w-full h-[60%]"
                  resizeMode="cover"
                />
                <View className="p-3 px-[12px]">
                  <Text className="text-white font-PlusJakartaSansMedium text-[16px]">
                    {item.title}
                  </Text>
                  <View className="bg-[#A187B5] self-start rounded-full mt-[38px] px-3 py-1">
                    <Text className="text-[#111318] text-[14px] font-PlusJakartaSansMedium">
                      {item.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default WalletScreen;
