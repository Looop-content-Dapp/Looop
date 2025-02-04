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

const WalletScreen = () => {
  const [timeFrame, setTimeFrame] = useState('Last 30 days');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Xion');
  const networkOptions: string[] = ['Xion', 'Starknet'];
  const filterTimeFrame: string[] = ["Last 30 days", "2 months", "1 year"];
  const [showConnectedAccounts, setShowConnectedAccounts] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const navigation = useNavigation()

  const networkData = {
    Xion: {
      balance: '$32,578.48',
      walletAddress: userdata?.wallets?.xion || '',
      icon: require('../../assets/images/xion.png')
    },
    Starknet: {
      balance: '$15,234.92',
      walletAddress: userdata?.wallets?.starknet || '',
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
      const numericBalance = parseFloat(balance.replace(/[$,]/g, ''));
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
      <ScrollView className="flex-1 px-4 mt-[32px]" showsVerticalScrollIndicator={false}>
        <View className="items-center mb-6 gap-y-[12px]">
          <View className="flex-row items-center space-x-2 bg-[#0A0B0F] p-2 rounded-lg">
            {availableCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.value}
                onPress={() => setSelectedCurrency(currency.value)}
                className={`flex-row items-center p-2 rounded-lg ${
                  selectedCurrency === currency.value ? 'bg-[#12141B]' : 'bg-transparent'
                }`}
                disabled={loading}
              >
                <Image
                  source={{ uri: currency.icon }}
                  className="w-5 h-5 rounded-full mr-2"
                />
                <Text className={`text-[14px] font-PlusJakartaSansMedium ${
                  selectedCurrency === currency.value ? 'text-white' : 'text-[#787A80]'
                }`}>
                  {currency.value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row items-center">
            {loading ? (
              <ActivityIndicator size="large" color="#FF8A49" />
            ) : (
              <>
                <Text className="text-white text-[40px] font-PlusJakartaSansMedium font-bold">
                  {isBalanceVisible 
                    ? formatBalance(networkData[selectedNetwork as keyof typeof networkData].balance, selectedCurrency)
                    : '****'
                  }
                </Text>
                <TouchableOpacity 
                  onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="ml-2"
                >
                  {isBalanceVisible 
                    ? <ViewIcon size={24} color="#787A80" />
                    : <ViewOffIcon size={24} color="#787A80" />
                  }
                </TouchableOpacity>
              </>
            )}
          </View>
          {error && (
            <Text className="text-red-500 text-sm mt-2">
              Using estimated rates due to network error
            </Text>
          )}
        </View>

        {/* Wallet Address */}
        <View className="bg-[#0A0B0F] border border-[#12141B] p-4 rounded-lg mb-4">
          {/* <Text className="text-[#787A80] mb-2">Account address</Text> */}
          <View className="flex-row items-center justify-between">
            <Text className="text-white">
              {networkData[selectedNetwork as keyof typeof networkData].walletAddress.slice(0, 36)}...
            </Text>
            <TouchableOpacity onPress={handleCopyAddress}>
              <Copy01Icon size={20} color="#787A80" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          className="bg-[#12141B] p-4 rounded-lg mb-4"
          onPress={() => router.push('/withdrawFundsScreen')}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                <ReverseWithdrawal02Icon size={24} color="#FF8A49" variant='stroke' />
              </View>
              <View>
                <Text className="text-white text-[16px] font-PlusJakartaSansMedium">Withdraw funds</Text>
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">
                Transfer to other exchanges
                </Text>
              </View>
            </View>
            <ArrowRight01Icon size={20} color="#FF8A49" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#12141B] p-4 rounded-lg mb-4"
          onPress={() => router.push('/connectedAccountsScreen')}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                <BankIcon size={24} color="#787A80" variant='stroke' />
              </View>
              <View>
                <Text className="text-white text-[16px] font-PlusJakartaSansMedium">Connected Accounts</Text>
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">
                  Manage connected bank accounts
                </Text>
              </View>
            </View>
            <ArrowRight01Icon size={20} color="#787A80" variant='stroke' />
          </View>
        </TouchableOpacity>

        {/* Earnings Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Earnings</Text>
            <FilterButton
              options={filterTimeFrame}
              selectedOption={timeFrame}
              onOptionSelect={setTimeFrame}
            />
          </View>

          {[
            { type: "Music streams", amount: "11,382.38", icon: <HeadphonesIcon variant='solid' color='#FFF0E8' size={32} />, bgColor: "bg-[#FF6D1B]", route: "/wallet/musicStreams" },
            { type: "Tribe subscriptions", amount: "11,382.38", icon: <UserGroupIcon variant='solid' color='#FFF0E8' size={32} />, bgColor: "bg-[#A187B5]", route: "/wallet/tribeSubscriptions" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-[#0A0B0F] py-[16px] pl-[16px] rounded-lg mb-4"
              onPress={() => router.push(item.route)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={`p-[16px] ${item.bgColor} rounded-lg items-center justify-center mr-3`}>
                    {item.icon}
                  </View>
                  <View>
                    <Text className="text-white text-[16px] font-PlusJakartaSansBold">{item.type}</Text>
                    <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">${item.amount}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
