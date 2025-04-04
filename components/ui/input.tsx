import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  description?: string;
  error?: string;
}

export const Input = ({
  label,
  description,
  error,
  ...props
}: InputProps) => {
  return (
    <View className="gap-y-[8px]">
      <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
      {description && (
        <Text className="text-[#9A9B9F] text-[14px] font-PlusJakartaSansMedium">{description}</Text>
      )}
      <TextInput
        className={`bg-[#202227] text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium py-[21px] pl-[24px] rounded-[56px] border ${
          error ? 'border-red-500' : 'border-transparent'
        }`}
        placeholderTextColor="#63656B"
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-[14px] font-PlusJakartaSansMedium">{error}</Text>
      )}
    </View>
  );
};
