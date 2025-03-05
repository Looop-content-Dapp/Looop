// DatePicker.tsx
import Calendar from '@/components/app-components/Calender';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

interface DatePickerProps {
  value: string; // Expected format: "YYYY-MM-DD"
  onChange: (date: string) => void;
  onBlur: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, onBlur }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value
      ? (() => {
          const [year, month, day] = value.split('-').map(Number);
          return new Date(year, month - 1, day); // Month is 0-based in JS Date
        })()
      : null
  );

  // Sync selectedDate with the value prop when it changes externally
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, adjust for display
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    setSelectedDate(date);
    onChange(dateString); // Pass the formatted string back to the parent
    setIsVisible(false); // Close the modal
    onBlur(); // Trigger blur event
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return 'Select date...';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          backgroundColor: '#1E1E1E',
          borderRadius: 10,
          padding: 10,
          height: 64,
        }}
      >
        <Text style={{ color: '#D2D3D5', padding: 10 }}>
          {value ? formatDisplayDate(value) : 'Select date...'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: '90%',
              maxWidth: 400,
              backgroundColor: '#12141B',
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              minDate={new Date(1900, 0, 1)} // Example minDate
            />
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#9B6AD4',
                borderRadius: 8,
                alignItems: 'center',
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
