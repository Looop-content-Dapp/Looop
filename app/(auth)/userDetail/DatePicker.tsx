import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import Calendar from '@/components/app-components/Calender';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  onBlur: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, onBlur }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(date.toISOString().split('T')[0]); 
    setIsVisible(false);
    onBlur();
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: 10,
          padding: 10,
          height: 64
        }}
      >
        <Text style={{ color: "#D2D3D5", padding: 10 }}>
          {value ? formatDisplayDate(value) : "Select date..."}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}>
          <View style={{
            width: '90%',
            maxWidth: 400,
            backgroundColor: '#12141B',
            borderRadius: 12,
            padding: 16
          }}>
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              minDate={new Date(1900, 0, 1)}
            />
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#9B6AD4',
                borderRadius: 8,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#FFFFFF' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePicker;

