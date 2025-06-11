import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, Image, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import FilterButton from '@/components/app-components/FilterButton';
import { AppBackButton } from '@/components/app-components/back-btn';
import { countries } from '@/data/data';
import { useExchangeRates } from '@/hooks/payment/useExchangeRates';
import * as Clipboard from 'expo-clipboard';
import { useWalletBalance } from '@/hooks/payment/useWalletBalance';

import WithdrawFunds from '@/components/wallet/WithdrawFunds';
import ConnectedAccounts from '@/components/wallet/ConnectedAccounts';
import Earnings from '@/components/wallet/Earnings';
import WalletBalance from '@/components/wallet/WalletBalance';

const WalletScreen = () => {
  const [timeFrame, setTimeFrame] = useState('Last 30 days');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Xion');
  const networkOptions: string[] = ['Xion', 'Starknet'];
  const { userdata } = useAppSelector((state) => state.auth);
  const navigation = useNavigation();
  const { data: walletBalanceData, isLoading: walletLoading } = useWalletBalance();

  // Initialize wallet data state
  const [walletData, setWalletData] = useState({
    balances: {
      xion: 0,
      starknet: 0,
      total: 0,
    },
    addresses: [
      { chain: "XION", address: userdata?.wallets?.xion?.address || '' },
      { chain: "Starknet", address: userdata?.wallets?.starknet?.address || '' },
    ],
  });

  // Update wallet balances when data is available
  useEffect(() => {
    if (walletBalanceData) {
      const xionBalance = walletBalanceData?.data?.xion?.balances?.[0]?.usdValue ?? 0;
      const starknetBalance = walletBalanceData?.data?.starknet?.balance?.usdValue ?? 0;

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

  const networkIcons = {
    Xion: require('@/assets/images/xion.png'),
    Starknet: require('@/assets/images/starknet.png'),
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name='Wallet' onBackPress={() => router.back()} />,
      headerRight: () => <FilterButton
        options={networkOptions}
        selectedOption={selectedNetwork}
        onOptionSelect={setSelectedNetwork}
        icon={
          <Image
            source={networkIcons[selectedNetwork as keyof typeof networkIcons]}
            className="w-5 h-5 mr-2"
          />
        }
      />
    });
  }, [navigation, selectedNetwork]);

  const handleCopyAddress = async (address: string) => {
    try {
      await Clipboard.setStringAsync(address);
      Alert.alert('Success', 'Wallet address copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy wallet address');
    }
  };

  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Filter only the countries we want to show
  const availableCurrencies = React.useMemo(() =>
    countries.filter(country => ['US', 'NG', 'UK'].includes(country.value))
  , []);

  const { rates, loading: ratesLoading, error } = useExchangeRates();

  const handleWithdrawFunds = () => {
    router.push('/wallet/withdraw');
  };

  const handleConnectedAccounts = () => {
    router.push('/connectedAccounts');
  };

  return (
    <View className="flex-1 bg-[#040405]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <WalletBalance
          balances={walletData.balances}
          addresses={walletData.addresses}
          isLoading={walletLoading}
          usdcPrice={walletBalanceData?.data?.usdcPrice}
          onCopyAddress={handleCopyAddress}
        />

        {/* Withdraw Funds Component */}
        <WithdrawFunds onPress={handleWithdrawFunds} />

        {/* Connected Accounts Component */}
        <ConnectedAccounts onPress={handleConnectedAccounts} />

        {/* Earnings Component */}
        <Earnings
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
        />
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
