import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';

interface SkeletonProps {
  width: number;
  height: number;
  borderRadius?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ width, height, borderRadius = 24 }) => (
  <MotiView
    from={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{
      type: 'timing',
      duration: 1000,
      loop: true,
    }}
    style={[
      styles.skeleton,
      {
        width,
        height,
        borderRadius,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 8,
  },
});
