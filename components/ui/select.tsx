import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  description?: string;
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
}

export const Select = ({
  label,
  description,
  options,
  value,
  onValueChange,
  error
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  return (
    <View className="gap-y-[12px]">
      <Text className="text-[#F4F4F4] text-b[16px] font-PlusJakartaSansMedium">{label}</Text>
      {description && (
        <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">{description}</Text>
      )}

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-[#111318] py-[20px] px-[24px] rounded-[56px] border-2 border-[#202227] flex-row justify-between items-center flex-1"
      >
        <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansRegular">
          {selectedOption ? selectedOption.label : 'Select option'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#787A80" />
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-[#111318] rounded-t-[24px] p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#F4F4F4] text-lg font-medium">{label}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#787A80" />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-[400px]">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`p-4 border-b border-[#2C2F36] flex-row justify-between items-center`}
                >
                  <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{option.label}</Text>
                  {value === option.value && (
                    <Ionicons name="checkmark" size={24} color="#57E09A" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
