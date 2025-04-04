import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps {
  label: string;
  description?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  quickNote?: string;
}

export const DatePicker = ({
  label,
  description,
  value,
  onChange,
  error,
  quickNote
}: DatePickerProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-[#F4F4F4] text-base font-medium">{label}</Text>
        {description && (
          <Text className="text-[#787A80] text-sm mt-1">{description}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="bg-[#12141B] p-4 rounded-lg flex-row justify-between items-center"
      >
        <Text className="text-[#F4F4F4]">
          {value ? format(value, 'dd-MM-yyyy') : 'Select date'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#787A80" />
      </TouchableOpacity>

      {quickNote && (
        <View className="bg-[#12141B] p-4 rounded-lg">
          <View className="flex-row items-center space-x-2">
            <Ionicons name="information-circle-outline" size={20} color="#787A80" />
            <Text className="text-[#787A80] text-sm flex-1">{quickNote}</Text>
          </View>
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}

      <DateTimePickerModal
        isVisible={isVisible}
        mode="date"
        onConfirm={(date) => {
          onChange(date);
          setIsVisible(false);
        }}
        onCancel={() => setIsVisible(false)}
        minimumDate={new Date()}
      />
    </View>
  );
};
