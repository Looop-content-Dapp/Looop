import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import {
  ArrowDown01Icon,
  Copy01Icon,
  ArrowRight01Icon,
  ReverseWithdrawal02Icon,
  ViewOffIcon,
  ViewIcon,
  HeadphonesIcon,
  UserGroupIcon,
  BankIcon,
} from '@hugeicons/react-native';
import BottomSheet, { BottomSheetScrollView, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Portal } from "@gorhom/portal";
import { SheetType } from '@/app/(artisteTabs)/(Artistprofile)';
import FilterButton from '../app-components/FilterButton';
import { router } from 'expo-router';
import ConnectedAccountsSheet from './ConnectedAccountsSheet';
import { useAppSelector } from '@/redux/hooks';



interface WalletEarningSheetProps {
  activeSheet: SheetType | null;
  onSheetChange: (sheet: SheetType | null) => void;
}

interface Bank {
    label: string;
    value: string;
    logo: string;
    branches: string[];
}

const WalletEarningSheet = ({ activeSheet, onSheetChange }: WalletEarningSheetProps) => {
  const [timeFrame, setTimeFrame] = useState('Last 30 days');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const filterBalanceOptions: string[] = ['All', 'Xion', 'Starknet'];
  const filterTimeFrame: string[] =  ["Last 30 days", "2 months", "1 year"]
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [showConnectedAccounts, setShowConnectedAccounts] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (activeSheet !== null) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [activeSheet]);

  const handleClose = useCallback(() => {
    onSheetChange(null);
  }, [onSheetChange]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onSheetChange(null);
    }
  }, [onSheetChange]);

  const handleBackNavigation = () => {
    if (activeSheet !== 'main') {
      onSheetChange('main');
    } else {
      handleClose();
    }
  };

  const handleCopyAddress = () => {
    // Implement clipboard functionality
    const walletAddress = '0xA1B2C3D4E5F67890ABCDEF1234567...';
    // Copy to clipboard logic here
  };

  const renderMainContent = () => (
    <BottomSheetScrollView
      className="px-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Balance */}
      <View className="items-center mb-6">
        <Text className="text-white text-[40px] font-PlusJakartaSansMedium font-bold">$32,578.48</Text>
      </View>

      {/* Wallet Address */}
      <View className="bg-[#0A0B0F] p-4 rounded-lg mb-4">
        <Text className="text-[#787A80] mb-2">Wallet address</Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-white">{userdata?.wallets.xion.slice(0, 36)}...</Text>
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
              Transfer to other wallets and exchanges
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
          <ArrowRight01Icon size={20} color="#FF8A49" />
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
          { type: "Music streams", amount: "11,382.38", icon:   <HeadphonesIcon variant='solid' color='#FFF0E8' size={32} />, bgColor: "bg-[#FF6D1B]" },
          { type: "Tribe subscriptions", amount: "11,382.38", icon:   <UserGroupIcon variant='solid' color='#FFF0E8' size={32} />, bgColor: "bg-[#A187B5]" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-[#0A0B0F] py-[16px] pl-[16px] rounded-lg mb-4"
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
      <ConnectedAccountsSheet
  isVisible={showConnectedAccounts}
  onClose={() => setShowConnectedAccounts(false)}
/>
      <View className="h-8" />
    </BottomSheetScrollView>
  );

  const renderContent = () => {
    switch (activeSheet) {
      case 'main':
      default:
        return renderMainContent();
    }
  };

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={activeSheet !== null ? 0 : -1}
        snapPoints={['95%']}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: '#040405' }}
        handleIndicatorStyle={{
          backgroundColor: '#787A80',
          width: 80,
          height: 4,
          borderRadius: 10,
        }}
        onChange={handleSheetChanges}
      >
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={handleBackNavigation}>
              <Text className="text-[#787A80] text-base">
                {activeSheet !== 'main' ? 'Back' : 'Close'}
              </Text>
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Wallet</Text>
            <FilterButton
      options={filterBalanceOptions}
      selectedOption={selectedFilter}
      onOptionSelect={setSelectedFilter}
    />
          </View>
        </View>

        {renderContent()}
      </BottomSheet>
    </Portal>
  );
};

export default WalletEarningSheet;
