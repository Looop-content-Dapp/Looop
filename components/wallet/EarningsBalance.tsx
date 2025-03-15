import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Copy01Icon, ViewOffIcon, ViewIcon } from '@hugeicons/react-native';
import CurrencySelector from './CurrencySelector';

interface WalletBalanceProps {
  balance: string;
  addresses: Array<{
    chain: string;
    address: string;
  }>;
  onCopyAddress: () => void;
  formatBalance: (balance: string, currency: string) => string;
  selectedCurrency: string;
  onCurrencySelect: (currency: string) => void;
  availableCurrencies: Array<{
    value: string;
    icon: string;
    label?: string;
  }>;
  rates: Record<string, any>;
}

const EarningsBalance: React.FC<WalletBalanceProps> = ({
  balance,
  addresses,
  onCopyAddress,
  formatBalance,
  selectedCurrency,
  onCurrencySelect,
  availableCurrencies,
  rates
}) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const formattedBalance = formatBalance(balance, selectedCurrency);
  const displayAddress = addresses[0]?.address || '';
  const truncatedAddress = displayAddress.length > 20
    ? `${displayAddress.substring(0, 10)}...${displayAddress.substring(displayAddress.length - 10)}`
    : displayAddress;

  return (
    <View className="mx-4 bg-[#0A0B0F] rounded-xl p-6 mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Text className="text-[#787A80] text-base font-PlusJakartaSansMedium mr-2">Wallet balance</Text>
          <CurrencySelector
            availableCurrencies={availableCurrencies}
            selectedCurrency={selectedCurrency}
            onCurrencySelect={onCurrencySelect}
          />
        </View>
        <TouchableOpacity onPress={toggleBalanceVisibility}>
          {isBalanceVisible ? (
            <ViewOffIcon size={20} color="#787A80" />
          ) : (
            <ViewIcon size={20} color="#787A80" />
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-white text-3xl font-PlusJakartaSansBold mb-6">
        {isBalanceVisible ? formattedBalance : '••••••••'}
      </Text>

      <View className="bg-[#12141B] p-4 rounded-lg flex-row justify-between items-center">
        <Text className="text-[#787A80] text-sm font-PlusJakartaSansMedium">Wallet address</Text>
        <View className="flex-row items-center">
          <Text className="text-white mr-2 font-PlusJakartaSansMedium">
            {truncatedAddress}
          </Text>
          <TouchableOpacity onPress={onCopyAddress}>
            <Copy01Icon size={18} color="#787A80" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EarningsBalance;
