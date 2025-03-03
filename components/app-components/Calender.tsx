import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    minDate?: Date; // Optional prop
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

  // Helper function to get the number of days in the current month
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  // Helper function to get the weekday (0-6) of the first day of the month
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // Handle month/year selection from the picker
  const handleSelectMonthYear = (month, year) => {
    const newDate = new Date(currentMonth);
    if (month !== undefined) newDate.setMonth(month);
    if (year !== undefined) newDate.setFullYear(year);
    newDate.setDate(1); // Set day to 1 to avoid invalid dates
    setCurrentMonth(newDate);
    setShowPicker(false); // Close picker after selection
  };

  // Render day headers (Sun, Mon, etc.)
  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day) => (
      <Text key={day} style={styles.dayHeader}>
        {day}
      </Text>
    ));
  };

  // Render the calendar grid with days
  const renderCells = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const cells = [];

    // Add empty cells before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.emptyCell} />);
    }

    // Add date cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      cells.push(
        <TouchableOpacity
          key={day}
          onPress={() => onSelectDate(date)}
          style={styles.dateCell}
        >
          <Text style={styles.dateCellText}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  // Render the month/year picker modal
  const renderPicker = () => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      label: new Date(0, i).toLocaleString('en-US', { month: 'long' }),
      value: i,
    }));
    const years = Array.from({ length: 100 }, (_, i) => ({
      label: (new Date().getFullYear() - 50 + i).toString(),
      value: new Date().getFullYear() - 50 + i,
    }));

    return (
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerTitle}>Month</Text>
              <FlatList
                data={months}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectMonthYear(item.value, undefined)}>
                    <Text style={styles.pickerItem}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                style={styles.pickerList}
              />
            </View>
            <View style={styles.pickerSection}>
              <Text style={styles.pickerTitle}>Year</Text>
              <FlatList
                data={years}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleSelectMonthYear(undefined, item.value)}>
                    <Text style={styles.pickerItem}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                style={styles.pickerList}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with navigation and month/year picker trigger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
          <Ionicons name="chevron-back" size={24} color="#787A80" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
          <Ionicons name="chevron-forward" size={24} color="#787A80" />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.daysHeader}>{renderDays()}</View>

      {/* Calendar grid */}
      <View style={styles.datesContainer}>{renderCells()}</View>

      {/* Month/Year picker */}
      {renderPicker()}
    </View>
  );
};

// Styles for the calendar component
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12141B',
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    color: '#F4F4F4',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeader: {
    color: '#787A80',
    fontSize: 12,
    width: 40,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Medium',
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  emptyCell: {
    width: 40,
    height: 40,
  },
  dateCellText: {
    color: '#F4F4F4',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerContainer: {
    backgroundColor: '#12141B',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    width: '90%',
    flexDirection: 'row',
  },
  pickerSection: {
    flex: 1,
    marginHorizontal: 10,
  },
  pickerTitle: {
    color: '#F4F4F4',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerList: {
    maxHeight: 200,
  },
  pickerItem: {
    color: '#F4F4F4',
    fontSize: 14,
    paddingVertical: 8,
    textAlign: 'center',
    backgroundColor: '#1A1D26',
    marginVertical: 2,
    borderRadius: 4,
  },
});

export default Calendar;
