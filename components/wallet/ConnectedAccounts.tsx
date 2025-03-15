import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BankIcon, ArrowRight01Icon } from '@hugeicons/react-native';

interface ConnectedAccountsProps {
  onPress: () => void;
}

const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="mx-4 bg-[#0A0B0F] rounded-xl p-4 mb-4 flex-row items-center"
      onPress={onPress}
    >
      <View className="w-12 h-12 rounded-xl bg-[#12141B] mr-4 items-center justify-center">
        <BankIcon size={24} color="#FFFFFF" />
      </View>
      <View className="flex-1">
        <Text className="text-white text-lg font-PlusJakartaSansBold">Connected Accounts</Text>
        <Text className="text-[#787A80] text-sm font-PlusJakartaSansMedium">Manage connected bank accounts</Text>
      </View>
      <ArrowRight01Icon size={20} color="#787A80" />
    </TouchableOpacity>
  );
};

export default ConnectedAccounts;
