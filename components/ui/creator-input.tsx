import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from './input';
import { Ionicons } from '@expo/vector-icons';
import { CheckmarkCircle02Icon } from '@hugeicons/react-native';

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
  onAddCreator = () => {},
  onRemoveCreator = () => {},
  error
}: CreatorInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const buttonLabel = label.toLowerCase().startsWith('add') ? label.toLowerCase() : `add ${label.toLowerCase()}`;

  const handleAddCreator = () => {
    if (inputValue.trim()) {
      onAddCreator(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <View className="gap-y-[12px]">
      <View className='flex-row items-center gap-x-[8px] w-full'>
        <Input
          label={label}
          description={description}
          placeholder={placeholder}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity onPress={() => setInputValue('')}>
          <Ionicons name="close" size={24} color="#787A80" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName='w-full gap-x-[8px]'>
        {selectedCreators.map((creator) => (
          <View
            key={creator}
            className="flex-row items-center gap-x-[8px] bg-[#A187B5] w-[40%] py-[8px] px-[8px] rounded-[10px]"
          >
            <CheckmarkCircle02Icon size={24} color='#FFFFFF' variant='solid' />
            <Text className="text-[#202227] text-[16px] font-PlusJakartaSansMedium">{creator}</Text>
            <TouchableOpacity onPress={() => onRemoveCreator(creator)}>
              <Ionicons name="close" size={20} color="#202227" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleAddCreator}
        className="mx-auto py-[10px] px-[16px] rounded-[10px] bg-[#202227]"
      >
        <Text className="text-[#9A9B9F] text-[14px] font-PlusJakartaSansMedium">+ {buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};
