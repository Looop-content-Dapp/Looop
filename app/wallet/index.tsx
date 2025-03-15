import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import {
  Copy01Icon,
  ArrowRight01Icon,
  ReverseWithdrawal02Icon,
  ViewOffIcon,
  ViewIcon,
  HeadphonesIcon,
  UserGroupIcon,
  BankIcon,
} from '@hugeicons/react-native';
import { router, useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import FilterButton from '@/components/app-components/FilterButton';
import { AppBackButton } from '@/components/app-components/back-btn';
import { countries } from '@/data/data';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import WalletBalance from '@/components/wallet/WalletBalance';
import TransactionHistory from '@/components/wallet/TransactionHistory';

const WalletScreen = () => {
  const [timeFrame, setTimeFrame] = useState('Last 30 days');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Xion');
  const networkOptions: string[] = ['Xion', 'Starknet'];
  const filterTimeFrame: string[] = ["Last 30 days", "2 months", "1 year"];
  const [showConnectedAccounts, setShowConnectedAccounts] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const navigation = useNavigation()

  // Add sample transactions data
  const transactions = [
    { title: "Funded wallet on Starknet", amount: "+$10.4", date: "27-02-25 11:10", source: "From card" },
      { title: "Joined a tribe", amount: "-$1.2", date: "27-02-25 11:10", source: "Received a collectible" },
      { title: "Funded wallet on XION", amount: "+$4.6", date: "27-02-25 11:10", source: "From card" },
      { title: "Funded wallet on Starknet", amount: "+$10.4", date: "27-02-25 11:10", source: "From card" },
      { title: "Monthly subscription", amount: "-$1", date: "27-02-25 11:10", source: "From the wallet balance" },
  ];

  const networkData = {
    Xion: {
      balance: '$32,578.48',
      walletAddress: userdata?.wallets?.xion?.address || '',
      icon: require('../../assets/images/xion.png')
    },
    Starknet: {
      balance: '$15,234.92',
      walletAddress: userdata?.wallets?.starknet?.address || '',
      icon: require('../../assets/images/starknet.png')
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerLeft: () => <AppBackButton name='Earnings' onBackPress={() => router.back()} />,
        headerRight: () =>  <FilterButton
        options={networkOptions}
        selectedOption={selectedNetwork}
        onOptionSelect={setSelectedNetwork}
        icon={
          <Image
            source={networkData[selectedNetwork as keyof typeof networkData].icon}
            className="w-5 h-5 mr-2"
          />
        }
      />
    })
  })

  const handleCopyAddress = async () => {
    const walletAddress = networkData[selectedNetwork as keyof typeof networkData].walletAddress;
    try {
      await Clipboard.setStringAsync(walletAddress);
      Alert.alert('Success', 'Wallet address copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy wallet address');
    }
  };

  const [selectedCurrency, setSelectedCurrency] = useState('US');

  // Filter only the countries we want to show
  const availableCurrencies = React.useMemo(() =>
    countries.filter(country => ['US', 'NG', 'UK'].includes(country.value))
  , []);

  const { rates, loading, error } = useExchangeRates();
  console.log(rates)

  // Remove the static currencyRates and use the dynamic rates from the hook
  const formatBalance = (balance: string, currency: string) => {
    try {
      // Check if rates and the specific currency rate exist
      if (!rates || !rates[currency]) {
        return balance; // Return original balance if rates aren't loaded yet
      }

      const numericBalance = parseFloat(balance.replace(/[$,]/g, ''));
      if (isNaN(numericBalance)) {
        return balance; // Return original balance if parsing fails
      }

      const convertedBalance = numericBalance * rates[currency].rate;
      const symbol = rates[currency].symbol;

      return `${symbol}${convertedBalance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } catch (err) {
      return balance; // Fallback to original balance if conversion fails
    }
  };

  // Update the balance display section
  return (
    <View className="flex-1 bg-[#040405]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Currency Selector */}
        <View className="px-4 pt-8">
          <View className="flex-row items-center space-x-2 bg-[#0A0B0F] p-2 rounded-lg mb-6">
            {availableCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.value}
                onPress={() => setSelectedCurrency(currency.value)}
                className={`flex-row items-center p-2 rounded-lg ${
                  selectedCurrency === currency.value ? "bg-[#12141B]" : "bg-transparent"
                }`}
              >
                <Image
                  source={{ uri: currency.icon }}
                  className="w-5 h-5 rounded-full mr-2"
                />
                <Text className={`text-[14px] font-PlusJakartaSansMedium ${
                  selectedCurrency === currency.value ? "text-white" : "text-[#787A80]"
                }`}>
                  {currency.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wallet Balance Component */}
        <WalletBalance
          balance={networkData[selectedNetwork as keyof typeof networkData].balance}
          addresses={[
            {
              chain: selectedNetwork,
              address: networkData[selectedNetwork as keyof typeof networkData].walletAddress || ''
            }
          ]}
          onCopyAddress={handleCopyAddress}
          formatBalance={formatBalance}  // Pass the formatBalance function
          selectedCurrency={selectedCurrency}  // Pass the selected currency
          rates={rates || {}}  // Pass rates with a fallback empty object
        />

        {/* Transaction History */}
        <View className="px-4 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-PlusJakartaSansBold">History</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#787A80] mr-2">Last 30 days</Text>
              <Text className="text-[#787A80]">▼</Text>
            </TouchableOpacity>
          </View>
          <TransactionHistory transactions={transactions} />
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
