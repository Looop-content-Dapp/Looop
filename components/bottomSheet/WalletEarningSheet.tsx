import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  ArrowDown01Icon,
  Copy01Icon,
  ArrowRight01Icon,
  ReverseWithdrawal02Icon,
} from '@hugeicons/react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

const WalletEarningSheet = ({ isVisible, closeSheet }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('STRK');
  const [timeFrame, setTimeFrame] = useState('Last 30 days');
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback((index) => {
    if (index === -1) {
      closeSheet();
    }
  }, [closeSheet]);

  const walletAddress = "0xA1B2C3D4E5F67890ABCDEF1234567...";
  const balance = "32,578.48";
  const earningsData = [
    {
      type: "Music streams",
      amount: "11,382.38",
      icon: "🎧",
      bgColor: "bg-[#FF8A49]"
    },
    {
      type: "Tribe subscriptions",
      amount: "11,382.38",
      icon: "👥",
      bgColor: "bg-[#A187B5]"
    },
    {
      type: "Collectibles",
      amount: "11,382.38",
      icon: "💳",
      bgColor: "bg-[#2DD881]"
    }
  ];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      onChange={handleSheetChanges}
      snapPoints={['90%']}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#040405' }}
      handleIndicatorStyle={{
        backgroundColor: '#787A80',
        width: 80,
        height: 4,
        borderRadius: 10,
      }}
    >
      {/* Header */}
      <View className="px-4 mb-6">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={closeSheet}>
            <Text className="text-[#787A80] text-base">Close</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Wallet</Text>
          <View className="w-16" />
        </View>
      </View>

      <BottomSheetScrollView
        className="px-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Currency Selector */}
        <View className="items-center mb-6">
          <TouchableOpacity className="flex-row items-center bg-[#0A0B0F] rounded-full px-4 py-2">
            <Text className="text-[#787A80] mr-2">Wallet balance</Text>
            <View className="flex-row items-center bg-[#040405] rounded-full px-2 py-1">
              <Text className="text-white mr-1">{selectedCurrency}</Text>
              <ArrowDown01Icon size={16} color="#787A80" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <View className="items-center mb-6">
          <Text className="text-white text-4xl font-bold">${balance}</Text>
        </View>

        {/* Wallet Address */}
        <View className="bg-[#0A0B0F] p-4 rounded-lg mb-4">
          <Text className="text-[#787A80] mb-2">Wallet address</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-white">{walletAddress}</Text>
            <TouchableOpacity>
              <Copy01Icon size={20} color="#787A80" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity className="bg-[#1D2029] p-4 rounded-lg mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full items-center justify-center mr-3">
                <ReverseWithdrawal02Icon size={24} color="#FF8A49" variant='stroke' />
              </View>
              <View>
                <Text className="text-white text-base">Withdraw funds</Text>
                <Text className="text-[#787A80] text-sm">Transfer to other wallets and exchanges</Text>
              </View>
            </View>
            <ArrowRight01Icon size={20} color="#FF8A49" variant='stroke' />
          </View>
        </TouchableOpacity>

        {/* Earnings Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Earnings</Text>
            <TouchableOpacity className="flex-row items-center border border-[#12141B] rounded-[10px] px-[12px] py-2">
              <Text className="text-white mr-2">{timeFrame}</Text>
              <ArrowDown01Icon size={16} color="#787A80" />
            </TouchableOpacity>
          </View>

          {/* Earnings Items */}
          {earningsData.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="bg-[#0A0B0F] p-[16px] rounded-lg mb-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={`w-10 h-10 ${item.bgColor} rounded-lg items-center justify-center mr-3`}>
                    <Text className="text-2xl">{item.icon}</Text>
                  </View>
                  <View>
                    <Text className="text-white text-base">{item.type}</Text>
                    <Text className="text-[#787A80] text-sm">${item.amount}</Text>
                  </View>
                </View>
                <ArrowRight01Icon size={20} color="#787A80" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default WalletEarningSheet;
