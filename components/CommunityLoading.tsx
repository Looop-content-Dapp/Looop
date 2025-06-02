import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CommunityLoading = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade and slide animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Animated.View
        className="items-center"
        style={{
          opacity: fadeValue,
          transform: [{ translateY }, { scale: pulseValue }],
        }}
      >
        <View className="mb-10 bg-blue-50 p-6 rounded-full">
          <Animated.View
            className="bg-blue-100 rounded-full p-3"
            style={{ transform: [{ rotate: spin }] }}
          >
            <Feather name="refresh-ccw" size={48} color="#2563eb" />
          </Animated.View>
        </View>

        <View className="items-center space-y-3">
          <Text className="text-2xl font-bold text-gray-800">
            Checking Your Community
          </Text>
          <Text className="text-base text-gray-600 text-center max-w-[280px]">
            We're looking for communities you own...
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default CommunityLoading;
