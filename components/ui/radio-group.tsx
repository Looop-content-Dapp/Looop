import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const RadioGroup = ({
  label,
  options,
  value,
  onChange,
  error
}: RadioGroupProps) => {
  return (
    <View className="gap-y-[12px]">
      <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
      <View className="flex-row gap-x-4">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`px-[16px] py-[10px] rounded-[10px] ${
              value === option.value
                ? 'bg-[#F4F4F4]'
                : 'bg-[#202227]'
            }`}
          >
            <Text
              className={`${
                value === option.value
                  ? 'text-[#202227]'
                  : 'text-[#9A9B9F]'
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}
    </View>
  );
};
