import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import * as Clipboard from 'expo-clipboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from "@/components/ui/input";
import { BlurView } from 'expo-blur';
import { ArrowRight01Icon, IrisScanIcon } from "@hugeicons/react-native";
import { useWalletBalance } from "@/hooks/useWalletBalance";

const schema = yup.object().shape({
  amount: yup.string().required('Amount is required')
    .test('valid-amount', 'Amount must be greater than 0', val => Number(val) > 0)
    .test('max-amount', 'Insufficient balance', function(val) {
      const balance = this.parent.maxAmount;
      return Number(val) <= Number(balance);
    }),
  walletAddress: yup.string().required('Wallet address is required')
    .min(42, 'Invalid wallet address length')
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format'),
});

type FormData = {
  amount: string;
  walletAddress: string;
  maxAmount: string;
};

const CryptoWithdrawScreen = () => {
  const navigation = useNavigation();
  const [selectedNetwork, setSelectedNetwork] = useState('XION');
  const { data: walletData, isLoading } = useWalletBalance();

  const getAvailableBalance = () => {
    if (!walletData) return '0';
    if (selectedNetwork === 'XION') {
      const usdcBalance = walletData.data.xion.balances.find(b => b.denom === 'usdc');
      return usdcBalance ? usdcBalance.amountFloat.toString() : '0';
    } else {
      return walletData.data.starknet.balance.balanceFloat.toString();
    }
  };

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: '',
      walletAddress: '',
      maxAmount: getAvailableBalance()
    }
  });

  useEffect(() => {
    setValue('maxAmount', getAvailableBalance());
  }, [walletData, selectedNetwork]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Send to a new recipient" onBackPress={() => router.back()} />,
    });
  }, [navigation]);

  const handlePaste = async (onChange: (value: string) => void) => {
    const text = await Clipboard.getStringAsync();
    onChange(text);
  };

  const handleMax = () => {
    setValue('amount', getAvailableBalance());
  };

  const onSubmit = (data: FormData) => {
    router.push({
      pathname: "/wallet/confirmWithdraw",
      params: {
        network: selectedNetwork,
        address: data.walletAddress,
        amount: data.amount,
        crypto: 'USDC'
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <View className="flex-1 px-6">
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-[20px] font-PlusJakartaSansBold text-white">Transfer USDC</Text>
            <View className="flex-row items-center">
              <Text className="text-[#787A80] mr-2 text-[14px]">Network</Text>
              <TouchableOpacity
                onPress={() => setSelectedNetwork(selectedNetwork === 'XION' ? 'STARKNET' : 'XION')}
                className="flex-row items-center bg-[#1A1B1E] rounded-full px-4 py-2"
              >
                <Image
                  source={selectedNetwork === 'XION' ? require('@/assets/images/XIONB.png') : require('@/assets/images/StarknetB.png')}
                  className="w-6 h-6 mr-2"
                />
                <Text className="text-white font-PlusJakartaSansMedium">
                  {selectedNetwork === 'XION' ? 'XION' : 'Starknet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Section */}
          <View className="space-y-6">
            {/* Amount Input */}
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Text className="text-[14px] text-[#787A80] mb-3 font-PlusJakartaSansMedium">Amount</Text>
                  <View className="bg-[#1A1B1E] rounded-2xl p-6">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white text-[36px] font-PlusJakartaSansBold">
                        {value || '0'} <Text className="text-[24px]">USDC</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={handleMax}
                        className="bg-[#FF6D1B] bg-opacity-20 px-4 py-2 rounded-full"
                      >
                        <Text className="text-[#FF6D1B] font-PlusJakartaSansBold">Max</Text>
                      </TouchableOpacity>
                    </View>
                    <Text className="text-[#787A80] mt-4 font-PlusJakartaSansMedium text-[14px]">
                      Available: {getAvailableBalance()} USDC
                    </Text>
                    {errors.amount && (
                      <Text className="text-[#FF3B30] text-sm mt-2 font-PlusJakartaSansMedium">{errors.amount.message}</Text>
                    )}
                  </View>
                </View>
              )}
            />

            {/* Wallet Address Input */}
            <View>
              <Text className="text-[14px] text-[#787A80] mb-3 font-PlusJakartaSansMedium">Send to</Text>
              <View className='flex-row items-center gap-x-[12px] w-full'>
                <View className="flex-1">
                  <Controller
                    control={control}
                    name="walletAddress"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="Paste or scan address"
                        value={value}
                        onChangeText={onChange}
                        error={errors.walletAddress?.message}
                        placeholderTextColor="#787A80"
                        className="bg-[#1A1B1E] rounded-xl px-4 py-3 text-white"
                      />
                    )}
                  />
                </View>

              </View>
            </View>

            {/**
             *     <TouchableOpacity
                  onPress={() => handlePaste(setValue.bind(null, 'walletAddress'))}
                  className="bg-[#1A1B1E] p-3 rounded-xl"
                >
                  <IrisScanIcon size={24} color="#787A80" />
                </TouchableOpacity>
             */}

            {/* Save Address Option */}
            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <Text className="text-[#6366F1] text-[14px] font-PlusJakartaSansBold">
                Save address
              </Text>
              <ArrowRight01Icon size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Button */}
        <View className="py-6">
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading || !watch('amount') || !watch('walletAddress')}
            className={`p-4 rounded-full ${
              isLoading || !watch('amount') || !watch('walletAddress')
                ? 'bg-[#2A2A2A]'
                : 'bg-[#FF6D1B]'
            }`}
          >
            <Text className={`text-center font-PlusJakartaSansBold text-[16px] ${
              isLoading || !watch('amount') || !watch('walletAddress')
                ? 'text-[#787A80]'
                : 'text-white'
            }`}>
              {isLoading ? 'Loading...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CryptoWithdrawScreen;
