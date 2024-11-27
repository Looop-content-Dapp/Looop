import React from 'react';
import Svg, { Path, G } from 'react-native-svg';

export const PriorityIcon = ({ size = 50, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 50 50">
      <G transform="translate(0, 0)">
        <Path
          d="M25,2.5 L32,17.5 L48,19.5 L36.5,31 L39,47 L25,39.5 L11,47 L13.5,31 L2,19.5 L18,17.5 Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          d="M25,15 L25,30 M25,33 L25,35"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};

export const InteractionIcon = ({ size = 50, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 50 50">
      <G transform="translate(0, 0)">
        <Path
          d="M15,25 A20,20 0 1,1 35,25 L40,20 M35,25 L30,30"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M35,25 A20,20 0 1,1 15,25 L10,30 M15,25 L20,20"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};

export const ExclusiveIcon = ({ size = 50, color = '#000000' }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 50 50">
      <G transform="translate(0, 0)">
        <Path
          d="M25,2 L45,25 L25,48 L5,25 Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          d="M15,25 L22,32 L35,18"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};
