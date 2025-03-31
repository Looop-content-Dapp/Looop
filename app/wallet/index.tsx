import React, { useLayoutEffect, useState } from 'react';
import { View, ScrollView, Image, Alert } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import FilterButton from '@/components/app-components/FilterButton';
import { AppBackButton } from '@/components/app-components/back-btn';
import { countries } from '@/data/data';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import * as Clipboard from 'expo-clipboard';

import WithdrawFunds from '@/components/wallet/WithdrawFunds';
import ConnectedAccounts from '@/components/wallet/ConnectedAccounts';
import Earnings from '@/components/wallet/Earnings';
import EarningsBalance from '@/components/wallet/EarningsBalance';

const WalletScreen = () => {
  const [timeFrame, setTimeFrame] = useState('Last 30 days');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Xion');
  const networkOptions: string[] = ['Xion', 'Starknet'];
  const { userdata } = useAppSelector((state) => state.auth);
  const navigation = useNavigation();

  const networkData = {
    Xion: {
      balance: '$32,578.48',
      walletAddress: userdata?.wallets?.xion?.address || '0xA1B2C3D4E5F6789ABCDEF1234567890ABCDEF123',
      icon: require('../../assets/images/xion.png')
    },
    Starknet: {
      balance: '$15,234.92',
      walletAddress: userdata?.wallets?.starknet?.address || '0xA1B2C3D4E5F6789ABCDEF1234567890ABCDEF123',
      icon: require('../../assets/images/starknet.png')
    }
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
            source={networkData[selectedNetwork as keyof typeof networkData].icon}
            className="w-5 h-5 mr-2"
          />
        }
      />
    });
  }, [navigation, selectedNetwork]);

  const handleCopyAddress = async () => {
    const walletAddress = networkData[selectedNetwork as keyof typeof networkData].walletAddress;
    try {
      await Clipboard.setStringAsync(walletAddress);
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

  const { rates, loading, error } = useExchangeRates();

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

  const handleWithdrawFunds = () => {
    // Navigate to withdraw funds screen
    router.push('/wallet/withdraw');
  };

  const handleConnectedAccounts = () => {
    // Navigate to connected accounts screen
    router.push('/wallet/connected-accounts');
  };

  return (
    <View className="flex-1 bg-[#040405]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

        {/* Wallet Balance Component */}
        <EarningsBalance
         balance={networkData[selectedNetwork as keyof typeof networkData].balance}
         addresses={[
           {
             chain: selectedNetwork,
             address: networkData[selectedNetwork as keyof typeof networkData].walletAddress || ''
           }
         ]}
         onCopyAddress={handleCopyAddress}
         formatBalance={formatBalance}
         selectedCurrency={selectedCurrency}
         onCurrencySelect={setSelectedCurrency}
         availableCurrencies={availableCurrencies}
         rates={rates || {}}
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
