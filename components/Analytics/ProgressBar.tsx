import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Rect } from 'react-native-svg';

interface ProgressBarProps {
  label?: string;
  percentage: number;
  totalValue?: string | number;
  barColor?: string;
  backgroundColor?: string;
  labelPosition?: 'left' | 'right' | 'center';
  height?: number;
  variant?: 'default' | 'compact';
  totalStreams?: string | number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  totalValue,
  barColor = '#7e57c2',
  backgroundColor = '#2e2e2e',
  labelPosition = 'right',
  height = 8,
  variant = 'default',
  totalStreams
}) => {
  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactLabel}>{label}</Text>
        <View style={[styles.progressBarCompact, { backgroundColor }]}>
          <Svg width={`${percentage}%`} height={height}>
            <Rect x={0} y={0} width="100%" height="100%" fill={barColor} rx={height / 2} />
          </Svg>
        </View>
        <Text style={styles.compactPercentage}>{totalValue}%</Text>
      </View>
    );
  }

  return (
    <View style={styles.defaultContainer}>
      <View style={styles.labelContainer}>
        {label && <Text style={styles.label} className='text-[16px] font-PlusJakartaSansMedium'>{label}</Text>}
        {labelPosition === 'right' && totalValue !== undefined && (
          <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>{totalValue}</Text>
        )}
      </View>
      <View style={[styles.progressBar, { backgroundColor, height }]}>
        <Svg width={`${percentage}%`} height={height}>
          <Rect x={0} y={0} width="100%" height="100%" fill={barColor} rx={height / 2} />
        </Svg>
      </View>
      {labelPosition === 'right' && totalValue !== undefined && (
        <Text style={styles.totalValueLeft} className='text-[16px] font-PlusJakartaSansMedium text-Grey/06'>{totalStreams?.toLocaleString()} Streams</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultContainer: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  totalValue: {
    color: '#fff',
    fontSize: 14,
  },
  totalValueLeft: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  progressBar: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  // Styles for compact variant
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 4,
  },
  compactLabel: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  progressBarCompact: {
    flex: 2,
    marginHorizontal: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  compactPercentage: {
    color: '#fff',
    fontSize: 14,
    flex: 0.5,
  },
});

export default ProgressBar;
