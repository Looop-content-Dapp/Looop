import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';

const CommunityLoading = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Fade and slide animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
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
          transform: [{ translateY }],
        }}
      >
        <View className="mb-8">
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Feather name="refresh-ccw" size={48} color="#3b82f6" />
          </Animated.View>
        </View>

        <View className="items-center space-y-2">
          <Text className="text-xl font-semibold text-gray-800">
            Checking Your Community
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            We're looking for communities you own...
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default CommunityLoading;
