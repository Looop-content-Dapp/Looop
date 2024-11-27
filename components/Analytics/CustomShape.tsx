import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

const CustomShape = ({ dataPoints }) => {
  // Convert data points into coordinates for the polygon shape
  const width = 183; // Width of the SVG container
  const height = 90; // Height of the SVG container

  // Assume dataPoints is an array of numbers representing a y-value
  const coordinates = dataPoints.map((point, index) => {
    const x = (width / (dataPoints.length - 1)) * index;
    const y = height - point; // Invert y to match SVG's top-left origin
    return `${x},${y}`;
  }).join(' ');

  return (
    <View style={styles.container}>
      <Svg height={height} width={width}>
        <Polygon
          points={`0,${height} ${coordinates} ${width},${height}`}
          fill="#15171F"
          stroke="#0A0B0F"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomShape;
