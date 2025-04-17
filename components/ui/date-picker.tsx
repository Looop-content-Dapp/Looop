import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps extends Omit<React.ComponentProps<typeof DateTimePickerModal>, 'isVisible' | 'onConfirm' | 'onCancel'> {
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
  quickNote,
  ...props
}: DatePickerProps) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <View className="gap-y-4">
      <View>
        <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
        {description && (
          <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium mt-1">{description}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        className="bg-[#202227] py-[20px] px-[24px]  rounded-[56px] flex-row gap-x-[8px] items-center"
      >
          <Ionicons name="calendar-outline" size={20} color="#787A80" />
        <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">
          {value ? format(value, 'dd-MM-yyyy') : 'Select date'}
        </Text>

      </TouchableOpacity>

      {quickNote && (
        <View className="bg-[#202227] pt-[16px] px-[16px] pb-[24px] rounded-[24px]">
          <View className="items-start space-x-2">
            <Ionicons name="information-circle-outline" size={20} color="#787A80" />
            <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansRegular flex-1">{quickNote}</Text>
          </View>
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}

      <DateTimePickerModal
       {...props}
        isVisible={isVisible}
        mode="date"
        onConfirm={(date) => {
          onChange(date);
          setIsVisible(false);
        }}
         onCancel={() => setIsVisible(false)}
          isDarkModeEnabled={true}
        themeVariant="dark"

      />
    </View>
  );
};
