import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { router, useNavigation } from "expo-router";
import WalletBalance from "@/components/wallet/WalletBalance";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import { ArrowRight01Icon, CreditCardIcon, Search01Icon } from "@hugeicons/react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import FilterButton from "@/components/app-components/FilterButton";
import { useAppSelector } from "@/redux/hooks";
import { getXionBalance, getStarknetBalance } from '@/services/walletService';
import * as Clipboard from 'expo-clipboard';

const WalletScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Balances');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  const [isLoading, setIsLoading] = useState(true);
  const { userdata } = useAppSelector(state => state.auth);
  const filterOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

  const [walletData, setWalletData] = useState({
    balances: {
      xion: 0,
      starknet: 0,
      total: 0,
    },
    addresses: [
      { chain: "XION", address: `${userdata?.wallets?.xion?.address?.slice(0, 35) || ''}...` },
      { chain: "Starknet", address: `${userdata?.wallets?.starknet?.address.slice(0, 33) || ''}...` },
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
    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        const xionAddress = userdata?.wallets?.xion?.address;
        const starknetAddress = userdata?.wallets?.starknet.address;
        if (!xionAddress || !starknetAddress) {
          throw new Error('Wallet addresses not found');
        }

        let xionBalance = 0;
        let starknetBalance = 0;

        // Fetch XION balance
        try {
          const xionData = await getXionBalance(xionAddress);
          xionBalance = parseFloat(xionData.data.balance) / 1000000;
        } catch (error: any) {
          console.error('Error fetching XION balance:', error.message);
        }

        // Fetch Starknet balance
        try {
          const starknetData = await getStarknetBalance(starknetAddress);
          starknetBalance = Number(BigInt(starknetData.data.balance) / BigInt(1e18));
        } catch (error: any) {
          console.error('Error fetching Starknet balance:', error.message);
        }

        // Update state with fetched balances
        setWalletData(prev => ({
          ...prev,
          balances: {
            xion: xionBalance,
            starknet: starknetBalance,
            total: xionBalance + starknetBalance,
          },
        }));
      } catch (error) {
        console.error('Error in fetchBalances:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [userdata]);

  const handleTabPress = (tab: string) => setActiveTab(tab);

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
            isLoading={isLoading}
            onCopyAddress={async (address) => {
              await Clipboard.setStringAsync(address);
               Alert.alert("Address Copied")
            }}
          />
          {/* Fund with Card Button */}
          <TouchableOpacity className="bg-[#202227] mx-4 my-3 px-[16px] pt-[20px] pb-[19px] rounded-[10px] flex-row justify-between items-center">
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
        <View className="flex-1">
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
                price: '$2/month',
                image: require('../../../assets/images/reave-pass.png'),
              },
            ]}
            numColumns={2}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="w-[50%] h-[262px] p-[4px] m-2 bg-[#202227] rounded-[10px]"
                onPress={() => { /* Handle collectible press */ }}
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
