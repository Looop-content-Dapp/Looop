import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

interface CalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
}

const Calendar = ({ selectedDate, onSelectDate, minDate }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    return date < new Date(minDate.setHours(0, 0, 0, 0));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => (
      <Text key={day} style={styles.dayHeader}>
        {day}
      </Text>
    ));
  };

  const renderCells = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const cells = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.emptyCell} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isDisabled = isDateDisabled(date);
      const isSelected = isSelectedDate(date);

      cells.push(
        <TouchableOpacity
          key={date.toISOString()}
          style={[
            styles.dateCell,
            isSelected && styles.selectedDate,
            isDisabled && styles.disabledDate,
          ]}
          onPress={() => !isDisabled && onSelectDate(date)}
          disabled={isDisabled}
        >
          <Text style={[
            styles.dateCellText,
            isSelected && styles.selectedDateText,
            isDisabled && styles.disabledDateText,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={24} color="#787A80" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{formatDate(currentMonth)}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="#787A80" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysHeader}>
        {renderDays()}
      </View>

      <View style={styles.datesContainer}>
        {renderCells()}
      </View>
    </View>
  );
};

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
  selectedDate: {
    backgroundColor: '#9B6AD4',
    borderRadius: 20,
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  disabledDate: {
    opacity: 0.5,
  },
  disabledDateText: {
    color: '#787A80',
  },
});

export default Calendar;
