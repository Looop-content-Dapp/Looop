import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import {
  Copy01Icon,
  ArrowRight01Icon,
  ReverseWithdrawal02Icon,
  ViewOffIcon,
  ViewIcon,
} from '@hugeicons/react-native';
import { router, useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import { AppBackButton } from '@/components/app-components/back-btn';
import FilterButton from '@/components/app-components/FilterButton';
import * as Clipboard from 'expo-clipboard';

const UserWalletScreen = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('Xion');
  const networkOptions: string[] = ['Xion', 'Starknet'];
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const navigation = useNavigation();

  const networkData = {
    Xion: {
      balance: '0.00',
      walletAddress: userdata?.wallets?.xion || '',
      icon: require('../../../assets/images/xion.png')
    },
    Starknet: {
      balance: '0.00',
      walletAddress: userdata?.wallets?.starknet || '',
      icon: require('../../../assets/images/starknet.png')
    }
  };

  // Mock NFT data - replace with actual NFT fetching logic
  const userNFTs = [
    {
      id: '1',
      name: 'Looop Music Pass #1',
    },
    // Add more NFTs as needed
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name='Wallet' onBackPress={() => router.back()} />,
      headerRight: () => (
        <FilterButton
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
      ),
    });
  }, [selectedNetwork]);

  const handleCopyAddress = async () => {
    try {
      const walletAddress = networkData[selectedNetwork as keyof typeof networkData].walletAddress;
      if (walletAddress) {
        await Clipboard.setStringAsync(walletAddress);
        Alert.alert('Success', 'Wallet address copied to clipboard');
      } else {
        Alert.alert('Error', 'Wallet address not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to copy wallet address');
    }
  };

  return (
    <View className="flex-1 bg-[#040405]">
      <ScrollView className="flex-1 px-4 mt-[32px]" showsVerticalScrollIndicator={false}>
        {/* Balance Section */}
        <View className="items-center mb-6 gap-y-[12px]">
          <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">
            Available Balance
          </Text>
          <View className="flex-row items-center">
            <Text className="text-white text-[40px] font-PlusJakartaSansMedium font-bold">
              {isBalanceVisible 
                ? `${networkData[selectedNetwork as keyof typeof networkData].balance} USDC` 
                : '****'}
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
          </View>
        </View>

        {/* Wallet Address */}
        <View className="bg-[#0A0B0F] border border-[#12141B] p-4 rounded-lg mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-white">
              {networkData[selectedNetwork as keyof typeof networkData].walletAddress
                ? networkData[selectedNetwork as keyof typeof networkData].walletAddress.slice(0, 36) + "..."
                : "No wallet address"}
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
                <Text className="text-white text-[16px] font-PlusJakartaSansMedium">Withdraw USDC</Text>
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">
                  Transfer to other wallets
                </Text>
              </View>
            </View>
            <ArrowRight01Icon size={20} color="#FF8A49" />
          </View>
        </TouchableOpacity>

        {/* NFTs Section */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">Your NFTs</Text>
            <TouchableOpacity>
              <Text className="text-[#FF8A49] text-[14px] font-PlusJakartaSansMedium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="gap-x-4"
          >
            {userNFTs.map((nft) => (
              <TouchableOpacity
                key={nft.id}
                className="bg-[#0A0B0F] rounded-lg p-3 mr-4"
                onPress={() => router.push(`/wallet/nft/${nft.id}`)}
              >
                <Image
                  source={{
                    uri: "https://i.pinimg.com/736x/00/f7/63/00f763c5eadef94ab990797d621d46fe.jpg"
                  }}
                  className="w-[150px] h-[150px] rounded-lg mb-2"
                />
                <Text className="text-white font-PlusJakartaSansMedium">
                  {nft.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View className="h-8" />
      </ScrollView>
    </View>
  );
};

export default UserWalletScreen;