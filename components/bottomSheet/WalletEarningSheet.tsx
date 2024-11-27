import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, Image } from 'react-native';
import {
  BankIcon,
  ArrowDownLeft01Icon,
  Copy01Icon,
  ArrowRight01Icon,
  ArrowDown01Icon,
  ReverseWithdrawal02Icon,
} from '@hugeicons/react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import BankLinkSheet from './BankLinkSheet';

const WalletEarningSheet = ({ isVisible, closeSheet }) => {
  const [showEarnings, setShowEarnings] = useState(true);
  const [isBankLinked, setIsBankLinked] = useState(false);
  const [showBankLinkSheet, setShowBankLinkSheet] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    closeSheet();
  }, [closeSheet]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      closeSheet();
    }
  }, [closeSheet]);

  const walletAddress = "0xA1B2C3D4E5F67890ABCDEF1234567890ABCDEF12";
  const balance = "32,578.48";

  const copyToClipboard = (text) => {
    // Implement clipboard functionality
  };

  return (
    <>
      <BottomSheet
        ref={bottomSheetRef}
        index={isVisible ? 0 : -1}
        onChange={handleSheetChanges}
        snapPoints={['85%']}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#040405' }}
        handleIndicatorStyle={{
          backgroundColor: '#787A80',
          width: 80,
          height: 4,
          borderRadius: 10,
        }}
      >
        {/* Fixed Header Outside ScrollView */}
        <View style={{ backgroundColor: '#040405', padding: 1 }}>
          <View className="flex-row items-center justify-between mb-8">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-row items-center px-3 py-2 active:opacity-70"
              activeOpacity={0.7}
            >
              <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium ml-2">Close</Text>
            </TouchableOpacity>
            <Text className="text-white text-[20px] font-PlusJakartaSansBold">Wallet</Text>
            <View className="w-16" />
          </View>
        </View>

        {/* Scrollable Content */}
        <BottomSheetScrollView
          style={{ backgroundColor: '#040405' }}
          contentContainerStyle={{ paddingHorizontal: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Currency Selector */}
          <TouchableOpacity className="flex-row items-center justify-center mb-4 bg-[#0A0B0F] self-center px-4 py-2 rounded-full">
          <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular mr-2">Wallet balance</Text>
            <View className='bg-[#040405] flex-row items-center p-[4px]'>
            <Text className="text-white text-[14px] font-PlusJakartaSansMedium mr-1">{selectedCurrency}</Text>
            <ArrowDown01Icon size={16} color="#787A80" variant="solid" />
            </View>
          </TouchableOpacity>

          {/* Balance Display */}
          <View className="items-center mb-8">
            <Text className="text-[#f4f4f4] text-[32px] font-PlusJakartaSansBold">
              ${balance}
            </Text>
          </View>

          {/* Wallet Address */}
          <View className="bg-[#1D2029] p-4 rounded-lg mb-6">
            <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular mb-2">Wallet address</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-[16px] font-PlusJakartaSansMedium">
                {walletAddress.slice(0, 30)}...
              </Text>
              <TouchableOpacity onPress={() => copyToClipboard(walletAddress)}>
                <Copy01Icon size={20} color="#787A80" variant="stroke" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity className="flex-row items-center justify-between bg-[#1D2029] p-4 rounded-lg mb-4">
            <View className="flex-row gap-x-3 items-center">
              <ReverseWithdrawal02Icon size={24} color="#FF8A49" variant="solid" />
              <View>
                <Text className="text-white text-[16px] font-PlusJakartaSansMedium">Withdraw funds</Text>
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular">Transfer to other wallets and exchanges</Text>
              </View>
            </View>
            <ArrowRight01Icon size={20} color="#787A80" variant="solid" />
          </TouchableOpacity>

          {/* Bank Link Button */}
          {/* <TouchableOpacity
            className="flex-row items-center justify-between bg-[#1D2029] p-4 rounded-lg"
            onPress={() => setShowBankLinkSheet(true)}
          >
            <View className="flex-row gap-x-3 items-center">
              <BankIcon size={24} color="#A187B5" variant="solid" />
              <View>
                <Text className="text-white text-[16px] font-PlusJakartaSansMedium">
                  {isBankLinked ? 'Bank Account Linked' : 'Link Bank Account'}
                </Text>
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular">
                  {isBankLinked ? 'Zenith Bank ****4589' : 'Required for withdrawals'}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full ${isBankLinked ? 'bg-[#2DD881]' : 'bg-[#787A80]'} mr-2`} />
              <ArrowRight01Icon size={20} color="#787A80" variant="solid" />
            </View>
          </TouchableOpacity> */}

          {/* Earnings Section */}
          <View className="mt-8">
            <Text className="text-white text-[20px] font-PlusJakartaSansBold mb-4">Earnings</Text>
            <View className="flex-row gap-x-4">
              <TouchableOpacity className="bg-[#1D2029] px-4 py-2 rounded-full">
                <Text className="text-white text-[14px] font-PlusJakartaSansMedium">Streams</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-2">
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">Subscriptions</Text>
              </TouchableOpacity>
              <TouchableOpacity className="px-4 py-2">
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">Collectibles</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add some bottom padding for better scrolling */}
          <View className="h-8" />
        </BottomSheetScrollView>
      </BottomSheet>

      <BankLinkSheet
        isVisible={showBankLinkSheet}
        closeSheet={() => setShowBankLinkSheet(false)}
        onSuccess={() => {
          setIsBankLinked(true);
          setShowBankLinkSheet(false);
        }}
      />
    </>
  );
};

export default WalletEarningSheet;
