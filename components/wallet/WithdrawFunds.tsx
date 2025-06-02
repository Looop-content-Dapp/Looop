import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ReverseWithdrawal02Icon, ArrowRight01Icon } from '@hugeicons/react-native';

interface WithdrawFundsProps {
  onPress: () => void;
}

const WithdrawFunds: React.FC<WithdrawFundsProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="mx-4 bg-[#0A0B0F] rounded-xl p-4 mb-4 flex-row items-center"
      onPress={onPress}
    >
      <View className="w-12 h-12 rounded-xl bg-[#FF7A00] mr-4 items-center justify-center">
        <ReverseWithdrawal02Icon size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-lg font-PlusJakartaSansBold">Withdraw Funds</Text>
        <Text className="text-[#787A80] text-sm font-PlusJakartaSansMedium">Transfer to other wallets and exchanges</Text>
      </View>
      <ArrowRight01Icon size={20} color="#787A80" />
    </TouchableOpacity>
  );
};

export default WithdrawFunds;
