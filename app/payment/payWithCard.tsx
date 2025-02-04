import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { FormField } from '@/components/app-components/formField';
import { AppButton } from '@/components/app-components/button';
import { useNavigation, useRouter } from 'expo-router';
import useUserInfo from '@/hooks/useUserInfo';
import { Currency, useFlutterwavePayment } from '@/hooks/useFlutterwavePayment';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { AppBackButton } from '@/components/app-components/back-btn';
import ChainPicker from '@/components/app-components/ChainPicker';

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

const CELL_COUNT = 6;

const PayWithCard = () => {
  const router = useRouter();
  const { location } = useUserInfo();
  const { preAuthenticateCard } = useFlutterwavePayment();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [value, setValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean>();
  // Replace useRef with useState
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });
  const { validatePayment } = useFlutterwavePayment();
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name='Card Payment' onBackPress={() => null} />
    })
  })

  // Set currency based on user location
  useEffect(() => {
    if (location?.country) {
      const currencyMap: { [key: string]: string } = {
        'Nigeria': 'NGN',
        'Ghana': 'GHS',
        'Kenya': 'KES',
        'Uganda': 'UGX',
        'Tanzania': 'TZS',
        'United States': 'USD',
        'United Kingdom': 'GBP',
      };
      setCurrency(currencyMap[location.country] || 'USD');
    }
  }, [location]);

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s/]/g, '');
    
    if (field === 'cardNumber') {
      const formattedValue = sanitizedValue.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
    } else if (field === 'expiryDate') {
      const formatted = sanitizedValue
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
      setCardDetails(prev => ({ ...prev, [field]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [field]: sanitizedValue }));
    }
  };

  // Add new states for OTP verification
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [flwRef, setFlwRef] = useState('');
  const [verifying, setVerifying] = useState(false);
  
  const ref = useBlurOnFulfill({ value: otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });

  const handleContinue = async () => {
    try {
      setLoading(true);
      // if (!cardDetails.cardNumber || 
      //     !cardDetails.expiryDate || 
      //     !cardDetails.cvv || 
      //     !cardDetails.cardHolderName) {
      //   Alert.alert('Validation Error', 'Please fill in all fields');
      //   return;
      // }
  
      // const [expiryMonth, expiryYear] = cardDetails.expiryDate.split('/');
      // const txRef = `TX-${Date.now()}`;
  
      // // Format card data according to Flutterwave requirements
      // const payload = {
      //   card_number: cardDetails.cardNumber.replace(/\s/g, ''),
      //   cvv: cardDetails.cvv,
      //   expiry_month: expiryMonth.padStart(2, '0'),
      //   expiry_year: `20${expiryYear}`,
      //   currency: currency as Currency,
      //   amount: '1000',
      //   email: 'user@example.com',
      //   fullname: cardDetails.cardHolderName,
      //   tx_ref: txRef,
      //   redirect_url: 'https://webhook.site/redirect-url',
      //   client: 'api'
      // };
  
      // const response = await preAuthenticateCard(payload);
      setShowOTP(true);
  
      // if (response.data?.auth_model === 'pin' || response.data?.auth_model === 'PIN' || response.data?.auth_url) {
      //   setFlwRef(response.data.flw_ref);
       
      // }
  
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'An error occurred while validating your card');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);
      
      const validationPayload = {
        otp: otpValue,
        flw_ref: flwRef,
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
    } finally {
      setVerifying(false);
    }
  };

  if (showOTP) {
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
            value={otpValue}
            onChangeText={setOtpValue}
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
              <Text
              key={index}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                isCorrect === false &&
                  value.length === CELL_COUNT &&
                  styles.errorCell,
                isCorrect === true &&
                  value.length === CELL_COUNT &&
                  styles.successCell,
              ]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
            )}
          />
        </View>

        <View className="mb-6">
          <AppButton.Primary
            color="#FF6D1B"
            text="Verify"
            onPress={handleVerify}
            disabled={otpValue.length !== CELL_COUNT}
            loading={verifying}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 px-6">
      <View className="flex-1">
        <View className="mt-6 mb-8">
          <Text className="text-[24px] font-PlusJakartaSansBold text-white">
            Enter Card Details
          </Text>
          <Text className="text-[16px] font-PlusJakartaSansMedium text-[#787A80] mt-2">
            Please provide your card information below
          </Text>
          <View className="mt-4 bg-[#1E1E1E] p-4 rounded-lg">
            <Text className="text-[14px] font-PlusJakartaSansMedium text-[#FF6D1B]">
              ⓘ Secure Environment
            </Text>
            <Text className="text-[12px] font-PlusJakartaSansRegular text-[#787A80] mt-1">
              Your card data is encrypted and processed according to PCI DSS requirements
            </Text>
          </View>
        </View>

        <ChainPicker />

        <View className="gap-y-4 mt-[30px]">
          <FormField.TextField
            label="Card Number"
            placeholder="•••• •••• •••• ••••"
            value={cardDetails.cardNumber}
            onChangeText={(text) => handleInputChange('cardNumber', text)}
            keyboardType="numeric"
            maxLength={19}
            secureTextEntry
          />

          <View className="flex-row gap-x-4">
            <View className="flex-1">
              <FormField.TextField
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChangeText={(text) => handleInputChange('expiryDate', text)}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
            <View className="flex-1">
              <FormField.TextField
                label="CVV"
                placeholder="•••"
                value={cardDetails.cvv}
                onChangeText={(text) => handleInputChange('cvv', text)}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>

          <FormField.TextField
            label="Card Holder Name"
            placeholder="Enter name as shown on card"
            value={cardDetails.cardHolderName}
            onChangeText={(text) => handleInputChange('cardHolderName', text)}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View className="mb-6">
        <AppButton.Primary
          color="#FF6D1B"
          text="Continue"
          onPress={handleContinue}
          loading={loading}
        />
        
        <View className="mt-6 items-center">
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
            Protected by
          </Text>
          <View className="mt-2 flex-row items-center">
            <Text className="text-[12px] font-PlusJakartaSansRegular text-[#787A80]">
              PCI DSS Certified | TLS 1.3 Encryption
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PayWithCard;

const styles = StyleSheet.create({
  codeFieldRoot: { marginTop: 32, marginHorizontal: 14 },
  cell: {
    width: 56,
    height: 72,
    lineHeight: 36,
    fontSize: 28,
    borderWidth: 2,
    borderColor: "#12141B",
    textAlign: "center",
    borderRadius: 10,
    color: "#FFFFFF",
    fontWeight: "400",
    paddingTop: 13,
  },
  focusCell: {
    borderColor: "#12141B",
  },
  errorCell: {
    borderColor: "#FF0000",
  },
  successCell: {
    borderColor: "#45F42E",
  },
  errorMessage: {
    color: "#FF0000",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});