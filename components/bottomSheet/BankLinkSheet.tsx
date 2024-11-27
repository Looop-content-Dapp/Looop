import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { BankIcon, Shield02Icon, LockKeyIcon, InfoCircleIcon, Copy01Icon, StarIcon } from '@hugeicons/react-native';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';

const BankLinkSheet = ({ isVisible, closeSheet, onSuccess }) => {
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
  });
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      closeSheet();
    }
  }, [closeSheet]);

  const handleSubmit = () => {
    // Add validation logic here
    onSuccess();
    closeSheet();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      onChange={handleSheetChanges}
      snapPoints={['79%']}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#040405' }}
      handleIndicatorStyle={{
        backgroundColor: '#787A80',
        width: 80,
        height: 4,
        borderRadius: 10,
      }}
    >
      <BottomSheetScrollView style={{ backgroundColor: '#040405', padding: 16 }}>
        {/* Header */}
        <View className="flex-row items-center gap-x-2 mb-6">
          <BankIcon size={24} color="#A187B5" variant="solid" />
          <Text className="text-white text-[20px] font-PlusJakartaSansBold">Link Bank Account</Text>
        </View>

        {/* Security Info */}
        <View className="bg-[#1D2029] p-4 rounded-[10px] mb-6">
          <View className="flex-row items-center gap-x-2 mb-3">
            <Shield02Icon size={20} color="#2DD881" variant="solid" />
            <Text className="text-white text-[16px] font-PlusJakartaSansMedium">Bank Details Security</Text>
          </View>
          <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular">
            Your bank details are encrypted and securely stored. We use industry-standard security measures to protect your information.
          </Text>
        </View>

        {/* Bank Details Form */}
        <View className="gap-y-4">
          <View>
            <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular mb-2">Bank Name</Text>
            <View className="bg-[#1D2029] rounded-[10px] px-4 py-3">
              <TextInput
                placeholder="Select your bank"
                placeholderTextColor="#787A80"
                value={bankDetails.bankName}
                onChangeText={(text) => setBankDetails(prev => ({ ...prev, bankName: text }))}
                className="text-white text-[16px] font-PlusJakartaSansMedium"
              />
            </View>
          </View>

          <View>
            <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular mb-2">Account Number</Text>
            <View className="bg-[#1D2029] rounded-[10px] px-4 py-3">
              <TextInput
                placeholder="Enter account number"
                placeholderTextColor="#787A80"
                keyboardType="numeric"
                maxLength={10}
                value={bankDetails.accountNumber}
                onChangeText={(text) => setBankDetails(prev => ({ ...prev, accountNumber: text }))}
                className="text-white text-[16px] font-PlusJakartaSansMedium"
              />
            </View>
          </View>

          <View>
            <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansRegular mb-2">Account Name</Text>
            <View className="bg-[#1D2029] rounded-[10px] px-4 py-3">
              <TextInput
                placeholder="Enter account name"
                placeholderTextColor="#787A80"
                value={bankDetails.accountName}
                onChangeText={(text) => setBankDetails(prev => ({ ...prev, accountName: text }))}
                className="text-white text-[16px] font-PlusJakartaSansMedium"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-[#A187B5] py-4 rounded-[10px] mt-4"
          >
            <Text className="text-white text-center text-[16px] font-PlusJakartaSansBold">
              Link Bank Account
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center gap-x-2 mt-4 mb-6">
            <LockKeyIcon size={16} color="#787A80" variant="stroke" />
            <Text className="text-[#787A80] text-[12px] font-PlusJakartaSansRegular">
              Your data is encrypted and secure
            </Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default BankLinkSheet;
