import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { useLayoutEffect } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import * as Clipboard from 'expo-clipboard';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const schema = yup.object().shape({
  crypto: yup.string().required('Crypto is required'),
  network: yup.string().required('Network is required'),
  walletAddress: yup.string().required('Wallet address is required')
    .min(42, 'Invalid wallet address length')
    .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format'),
});

type FormData = {
  crypto: string;
  network: string;
  walletAddress: string;
};

const CryptoWithdrawScreen = () => {
  const navigation = useNavigation();
  const params = useLocalSearchParams();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      crypto: 'USDC',
      network: '',
      walletAddress: ''
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Send to a new recipient" onBackPress={() => router.back()} />,
    });
  }, [navigation]);

  const cryptoOptions = [
    { label: 'USDC', value: 'USDC' }
  ];

  const networkOptions = [
    { label: 'Xion', value: 'XION' },
    { label: 'Starknet', value: 'STARKNET' }
  ];

  const handlePaste = async (onChange: (value: string) => void) => {
    const text = await Clipboard.getStringAsync();
    onChange(text);
  };

  const onSubmit = (data: FormData) => {
    router.push({
      pathname: "/wallet/confirmWithdraw",
      params: {
        network: data.network,
        address: data.walletAddress,
        crypto: data.crypto
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#040405]">
      <View className="px-6 mt-6">
        <Text className="text-[#787A80] text-base mb-6">
          Enter recipient's details
        </Text>

        {/* Crypto Selection */}
        <Controller
          control={control}
          name="crypto"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Select
                label="Crypto"
                options={cryptoOptions}
                value={value}
                onValueChange={onChange}
                error={errors.crypto?.message}
              />
            </View>
          )}
        />

        {/* Network Selection */}
        <Controller
          control={control}
          name="network"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <Select
                label="Network"
                description="Select the network for your transfer"
                options={networkOptions}
                value={value}
                onValueChange={onChange}
                error={errors.network?.message}
              />
            </View>
          )}
        />

        {/* Wallet Address Input */}
        <Controller
          control={control}
          name="walletAddress"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <Input
                    label="Wallet address"
                    placeholder="Enter wallet address"
                    value={value}
                    onChangeText={onChange}
                    error={errors.walletAddress?.message}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handlePaste(onChange)}
                  className="ml-2 h-[58px] justify-center"
                >
                  <Text className="text-[#3B82F6] text-base">Paste</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        {/* Warning Message */}
        <View className="bg-[#FEF3C7] p-4 rounded-lg mb-6 flex-row items-center">
          <Text className="text-[#92400E] text-sm flex-1">
             Ensure you're sending to the right wallet address, funds cannot be reversed
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="p-4 rounded-[56px]  bg-[#FF6D1B]"
        >
          <Text className="text-white text-center text-base font-semibold">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CryptoWithdrawScreen;
