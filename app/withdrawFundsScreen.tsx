import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock02Icon } from '@hugeicons/react-native';
import { router } from 'expo-router';
import Ellipse60 from '@/assets/svg/Ellipse60';

interface Account {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  logo: any;
}

interface WithdrawFundsScreenProps {
  availableBalance: number;
}

type StepType = 'amount' | 'selectAccount' | 'verifyEmail' | 'processing' | 'success';

const WithdrawFundsScreen = ({ availableBalance = 32540.40 }: WithdrawFundsScreenProps) => {
  const [amount, setAmount] = useState('0');
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<StepType>('amount');
  const [otpCode, setOtpCode] = useState('');

  // Mock user email
  const userEmail = "a****@gmail.com";

  // Mock accounts data
  const accounts: Account[] = [
    {
      id: '1',
      bankName: 'First Bank',
      accountNumber: '3273840488',
      accountName: 'Antony Joshua',
      logo: require('../assets/images/firstbank-logo.png'),
    },
    {
      id: '2',
      bankName: 'Access Bank',
      accountNumber: '3273840488',
      accountName: 'Antony Joshua',
      logo: require('../assets/images/access-logo.png'),
    },
  ];

  const handleNumberPress = (num: string) => {
    if (currentStep === 'verifyEmail') {
      if (otpCode.length < 7) {
        setOtpCode(prev => prev + num);
      }
    } else {
      if (amount === '0' && num !== '0') {
        setAmount(num);
      } else {
        setAmount(prev => prev + num);
      }
    }
  };

  const handleBackspace = () => {
    if (currentStep === 'verifyEmail') {
      setOtpCode(prev => prev.slice(0, -1));
    } else {
      setAmount(prev => prev.slice(0, -1) || '0');
    }
  };

  const handleContinue = () => {
    switch (currentStep) {
      case 'amount':
        setCurrentStep('selectAccount');
        break;
      case 'selectAccount':
        if (selectedAccount) {
          setCurrentStep('verifyEmail');
        }
        break;
      case 'verifyEmail':
        if (otpCode.length === 6) {
          setCurrentStep('processing');
          setTimeout(() => {
            setCurrentStep('success');
          }, 2000);
        }
        break;
      case 'success':
        router.back();
        break;
    }
  };

  const renderNumpad = () => {
    const numbers = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace']
    ];

    return (
      <View className="mt-auto">
        {numbers.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row justify-around">
            {row.map((num, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                className="w-[120px] h-[60px] items-center justify-center"
                onPress={() => num === 'backspace' ? handleBackspace() : handleNumberPress(num)}
              >
                {num === 'backspace' ? (
                  <Text className="text-white text-2xl">⌫</Text>
                ) : num ? (
                  <View>
                    <Text className="text-white text-2xl font-PlusJakartaSansBold text-center">{num}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderAmountInput = () => (
    <View className="flex-1">
      <View className="items-center mt-12">
        <Text className="text-[56px] font-PlusJakartaSansExtraBold font-medium">
          <Text className="text-white">$</Text>
          <Text className={amount === '0' ? 'text-[#787A80]' : 'text-white'}>
            {Number(amount).toLocaleString()}
          </Text>
        </Text>
        <Text className="text-[#787A80] font-PlusJakartaSansMedium text-lg mt-2">
          {Number(amount)} USDT
        </Text>
      </View>

      <View className="mt-[179px] mx-4">
        <View className="flex-row justify-between items-center bg-[#0A0B0F] border border-[#12141B] p-[20px] rounded-lg">
          <View className="fitems-center">
            <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">Available balance</Text>
            <Text className="text-[#f4f4f4] text-[20px] font-PlusJakartaSansBold">${availableBalance.toLocaleString()}</Text>
          </View>
          <TouchableOpacity
            className="ml-2 bg-[#12141B] p-[12px] border border-[#12141B] rounded-[24px]"
            onPress={() => setAmount(availableBalance.toString())}
          >
            <Text className="text-white">Withdraw max</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderNumpad()}
    </View>
  );

  const renderOTPVerification = () => (
    <View className="flex-1">
      <View className="items-center mt-12">
        <Text className="text-white text-xl font-bold mb-2">Enter verification code</Text>
        <Text className="text-[#787A80] text-center mb-8">
          We've sent a verification code to {userEmail}
        </Text>

        {/* OTP Display */}
        <View className="flex-row justify-center gap-x-2 mb-[30px]">
          {[...Array(7)].map((_, index) => (
            <View
              key={index}
              className={`w-[49px] h-[49px] rounded-lg items-center justify-center ${
                index < otpCode.length ? 'border-2 border-[#1D2029]' : 'bg-[#0A0B0F]'
              }`}
            >
              <Text className="text-white text-xl">
                {index < otpCode.length ? otpCode[index] : ''}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity className="mt-4">
          <Text className="text-[#FF8A49]">Resend code</Text>
        </TouchableOpacity>
      </View>

      {renderNumpad()}
    </View>
  );

  const renderAccountSelection = () => (
    <View className="flex-1 px-4">
      <Text className="text-white text-xl mt-6 mb-4">Select withdrawal account</Text>

      {accounts.map((account) => (
        <TouchableOpacity
          key={account.id}
          className={`flex-row items-center px-[16px] py-[19px] rounded-lg border-1 border-[#12141B] mb-3 bg-[#0A0B0F]`}
          onPress={() => setSelectedAccount(account.id)}
        >
          <View className="h-6 w-6 rounded-full border border-[#FF8A49] mr-3 items-center justify-center">
            {selectedAccount === account.id && (
              <View className="h-4 w-4 rounded-full bg-[#FF8A49]" />
            )}
          </View>
          <Image source={account.logo} className="w-8 h-8 rounded-full mr-3" />
          <View>
            <Text className="text-white">{account.accountNumber}</Text>
            <Text className="text-[#787A80]">{account.accountName}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        className="flex-row items-center justify-center mt-4 bg-[#1D2029] p-4 rounded-lg"
        onPress={() => router.push('/add-bank-account')}
      >
        <Text className="text-[#787A80]">+ Add bank account</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessing = () => (
    <View className="flex-1 items-center justify-center px-4">
      <View className="bg-[#1D2029] p-6 rounded-full mb-6">
        <Clock02Icon size={40} color="#787A80" />
      </View>
      <Text className="text-white text-2xl text-center mb-2">
        Processing your payment request.
      </Text>
    </View>
  );

  const renderSuccess = () => (
    <View className="flex-1 items-center justify-center px-4">
      <View className="bg-[#1D2029] p-6 rounded-full mb-6">
        <Ellipse60 />
      </View>
      <Text className="text-white text-2xl text-center mb-2">
        Your payment request has been submitted successfully!
      </Text>
      <Text className="text-[#787A80] text-center mb-8">
        Good news! Your funds will be available in your withdrawal account soon!
      </Text>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'amount':
        return renderAmountInput();
      case 'selectAccount':
        return renderAccountSelection();
      case 'verifyEmail':
        return renderOTPVerification();
      case 'processing':
        return renderProcessing();
      case 'success':
        return renderSuccess();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-[#787A80]">Close</Text>
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium">Withdraw funds</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Content */}
        {renderContent()}

        {/* Bottom Button */}
        {(currentStep === 'amount' || currentStep === 'selectAccount' ||
          currentStep === 'verifyEmail' || currentStep === 'success') && (
          <View className="px-4 pb-8">
            <TouchableOpacity
              className={`py-[16px] rounded-[56px] ${
                (currentStep === 'amount' && Number(amount) > 0) ||
                (currentStep === 'selectAccount' && selectedAccount) ||
                (currentStep === 'verifyEmail' && otpCode.length === 7) ||
                currentStep === 'success'
                  ? 'bg-[#FF6D1B]'
                  : 'bg-[#FF6D1B] opacity-50'
              }`}
              onPress={handleContinue}
              disabled={
                (currentStep === 'amount' && Number(amount) === 0) ||
                (currentStep === 'selectAccount' && !selectedAccount) ||
                (currentStep === 'verifyEmail' && otpCode.length !== 7)
              }
            >
              <Text className="text-white text-center font-bold">
                {currentStep === 'success' ? 'Done' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WithdrawFundsScreen;
