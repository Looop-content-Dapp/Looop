import { View, Text, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { AppButton } from '@/components/app-components/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useFlutterwavePayment } from '@/hooks/payment/useFlutterwavePayment';

const CELL_COUNT = 6;
const RESEND_TIMEOUT = 30; // 30 seconds timeout for resend

// Add type definitions
interface FlutterwaveResponse {   
  status: 'successful' | 'failed' | 'pending';
  transaction_id?: string;
  tx_ref?: string;
  message?: string;
}

interface ValidationParams {
  txRef: string;
  otp: string;
}

const CardAuthentication = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { txRef, encryptedData } = params;
  const [value, setValue] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { validatePayment } = useFlutterwavePayment();

  const handleVerify = async () => {
    try {
      const { flw_ref } = params;
      
      const validationPayload = {
        otp: value,
        flw_ref: flw_ref as string,
        type: 'card' as const
      };
      
      const response = await validatePayment(validationPayload);
      
      if (response.status === 'success') {
        router.push({
          pathname: '/payment/MintingSuccess',
          params: {
            name: 'Payment Successful',
            transactionId: response.data?.id?.toString() || ''
          }
        });
      } else {
        Alert.alert('Error', response.message || 'Payment verification failed');
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred during verification');
    }
  };

  
  const handleResendCode = useCallback(async () => {
    // try {
    //   // Start the countdown
    //   setResendTimer(RESEND_TIMEOUT);
    //   // Reset the input
    //   setValue('');
      
    //   // Implement Flutterwave resend OTP
    //   await FlutterwaveInit.resendOtp({
    //     txRef: txRef as string
    //   });
      
    //   // Countdown timer
    //   const interval = setInterval(() => {
    //     setResendTimer((currentTimer) => {
    //       if (currentTimer <= 1) {
    //         clearInterval(interval);
    //         return 0;
    //       }
    //       return currentTimer - 1;
    //     });
    //   }, 1000);

    //   return () => clearInterval(interval);
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to resend verification code');
    // }
  }, [txRef]);

  return (
    <View className="flex-1 px-6">
      <View className="flex-1">
        <View className="mt-6 mb-8">
          <Text className="text-[24px] font-PlusJakartaSansBold text-white">
            Authentication Required
          </Text>
          <Text className="text-[16px] font-PlusJakartaSansMedium text-[#787A80] mt-2">
            Please enter the verification code sent to your phone
          </Text>
        </View>

        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={{
            marginTop: 20,
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              className={`w-12 h-14 justify-center items-center border-2 rounded-lg mx-1
                ${isFocused ? 'border-[#FF6D1B]' : symbol ? 'border-[#2A2D3A]' : 'border-[#12141B]'}
                ${symbol ? 'bg-[#2A2D3A]' : 'bg-transparent'}
                shadow-sm`}
              style={{
                transform: [{ scale: isFocused ? 1.05 : 1 }],
              transition: 'all 0.2s ease'
              }}
            >
              <Text className="text-[20px] font-PlusJakartaSansBold text-white">
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
            Didn't receive code?{' '}
          </Text>
          {resendTimer > 0 ? (
            <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
              Resend in {resendTimer}s
            </Text>
          ) : (
            <Text 
              onPress={handleResendCode}
              className="text-[14px] font-PlusJakartaSansBold text-[#FF6D1B] active:opacity-70"
            >
              Resend
            </Text>
          )}
        </View>
      </View>

      <View className="mb-6">
        <AppButton.Primary
          color="#FF6D1B"
          text="Verify"
          onPress={handleVerify}
          disabled={value.length !== CELL_COUNT}
          loading={false}
        />
        
        <View className="mt-6 items-center">
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
            Powered by
          </Text>
          {/* <Image
            source={require('../../assets/images/flutterwave-logo.png')}
            className="h-6 w-32 mt-2"
            resizeMode="contain"
          /> */}
        </View>
      </View>
    </View>
  );
};

export default CardAuthentication;