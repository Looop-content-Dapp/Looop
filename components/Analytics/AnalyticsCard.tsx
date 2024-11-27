import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ImageSourcePropType, ViewStyle, TextStyle } from 'react-native';

interface AnalyticsCardProps {
    title?: string;
    value?: string | number;
    changePercentage?: number;
    positive?: boolean;
    backgroundImage?: ImageSourcePropType;
    cardStyle?: ViewStyle;
    titleStyle?: TextStyle;
    valueStyle?: TextStyle;
    percentageStyle?: TextStyle;
    customContent?: React.ReactNode;
  }

const AnalyticsCard = ({
  title,
  value,
  changePercentage,
  positive,
  backgroundImage,
  cardStyle,
  titleStyle,
  valueStyle,
  percentageStyle,
  customContent,
}: AnalyticsCardProps) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.card, cardStyle]}
      imageStyle={{ borderRadius: 12 }}
    >
      <View style={styles.overlay}>
        {/* <CustomShape /> */}
        {customContent ? (
          customContent
        ) : (
          <>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <Text
              style={[
                styles.percentage,
                percentageStyle,
                positive ? styles.positive : styles.negative,
              ]}
            >
              {positive ? '+' : '-'}
              {Math?.abs(changePercentage)}%
            </Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, valueStyle]} className="font-PlusJakartaSansBold">
                {value}
              </Text>
              <Text className="font-PlusJakartaSansRegular text-[24px] text-[#f4f4f4]">
                Streams
              </Text>
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    height: 150,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  valueContainer: {
    position: 'absolute',
    bottom: 16,
    zIndex: 30,
    paddingLeft: 16
  },
  value: {
    color: '#fff',
    fontSize: 32,
  },
  percentage: {
    fontSize: 14,
    marginTop: 8,
  },
  positive: {
    color: '#4cd964',
  },
  negative: {
    color: '#ff3b30',
  },
});

export default AnalyticsCard;
