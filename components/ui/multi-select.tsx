import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label: string;
  description?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (values: string[]) => void;
  error?: string;
}

export const MultiSelect = ({
  label,
  description,
  options,
  value,
  onValueChange,
  error
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = useMemo(() =>
    options.filter(option => value.includes(option.value)),
    [options, value]
  );

  // Remove the incorrect console.log
  // console.log("options", options.label) // This was causing the error

  const handleSelect = useCallback((optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onValueChange(newValue);
    // Don't close the modal after selection to allow multiple selections
  }, [value, onValueChange]);

  const getDisplayText = useCallback(() => {
    if (selectedOptions.length === 0) return 'Select options';
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} options selected`;
  }, [selectedOptions]);

  return (
    <View className="gap-y-[12px]">
      <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
      {description && (
        <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">{description}</Text>
      )}

      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={`bg-[#111318] py-[20px] px-[24px] rounded-[56px] border-2 ${
          error ? 'border-red-500' : 'border-[#202227]'
        } flex-row justify-between items-center`}
      >
        <Text
          className={`text-[16px] font-PlusJakartaSansRegular ${
            selectedOptions.length > 0 ? 'text-[#F4F4F4]' : 'text-[#787A80]'
          }`}
        >
          {getDisplayText()}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#787A80" />
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-sm font-PlusJakartaSansRegular">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-[#111318] rounded-t-[24px] p-6"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#F4F4F4] text-lg font-PlusJakartaSansMedium">{label}</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                className="bg-[#FF7A1B] px-4 py-2 rounded-full flex-row items-center gap-2"
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text className="text-white font-PlusJakartaSansMedium">Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[400px]">
              {Array.isArray(options) && options.map((option, index) => (
                <TouchableOpacity
                  key={`${option.value}-${index}`}
                  onPress={() => handleSelect(option.value)}
                  className={`p-4 flex-row justify-between items-center ${
                    value.includes(option.value) ? 'bg-[#202227]' : ''
                  }`}
                >
                  <Text
                    className={`text-[16px] font-PlusJakartaSansMedium ${
                      value.includes(option.value) ? 'text-[#FF7A1B]' : 'text-[#F4F4F4]'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {value.includes(option.value) && (
                    <Ionicons name="checkmark" size={24} color="#FF7A1B" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
