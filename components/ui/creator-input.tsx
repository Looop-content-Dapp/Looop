import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from './input';
import { Ionicons } from '@expo/vector-icons';

interface CreatorInputProps {
  label: string;
  description?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  selectedCreators: string[];
  onAddCreator: (value: string) => void;
  onRemoveCreator: (value: string) => void;
  error?: string;
}

export const CreatorInput = ({
  label,
  description,
  placeholder,
  value,
  onChange,
  selectedCreators = [],
  onAddCreator = () => {}, // Add default empty function
  onRemoveCreator = () => {}, // Also add for onRemoveCreator
  error
}: CreatorInputProps) => {
  const buttonLabel = label.toLowerCase().startsWith('add') ? label.toLowerCase() : `add ${label.toLowerCase()}`;

  return (
    <View className="gap-y-[12px]">
      <Input
        label={label}
        description={description}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        error={error}
      />
      <TouchableOpacity
        onPress={() => onAddCreator(value)}
        className="mx-auto py-[10px] px-[16px] rounded-[10px] bg-[#202227]"
      >
        <Text className="text-[#9A9B9F] text-[14px] font-PlusJakartaSansMedium">+ {buttonLabel}</Text>
      </TouchableOpacity>

      {selectedCreators.map((creator) => (
        <View
          key={creator}
          className="flex-row items-center justify-between bg-[#12141B] p-3 rounded-lg"
        >
          <Text className="text-[#F4F4F4]">{creator}</Text>
          <TouchableOpacity onPress={() => onRemoveCreator(creator)}>
            <Ionicons name="close" size={20} color="#787A80" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
