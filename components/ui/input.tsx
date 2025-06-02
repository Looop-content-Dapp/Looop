import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';

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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
      {description && (
        <Text className="text-[#9A9B9F] text-[14px] font-PlusJakartaSansMedium">{description}</Text>
      )}
      <TextInput
        className={`bg-[#202227] text-[#F4F4F4] w-full text-[16px] font-PlusJakartaSansMedium py-[21px] pl-[24px] rounded-[56px] border ${
          error ? 'border-red-500' : isFocused ? '' : 'border-transparent'
        }`}
        style={styles.input}
        placeholderTextColor="#63656B"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-[14px] font-PlusJakartaSansMedium">{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    minHeight: 90,
  },
  input: {
    height: 64,
    minHeight: 64,
  }
});
