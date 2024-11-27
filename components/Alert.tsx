import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

type AlertType = 'error' | 'success' | 'warning';

interface AlertAndLogProps {
  title: string;
  message: any;
  type: AlertType;
}

export function AlertAndLog({ title, message, type }: AlertAndLogProps) {
    const [visible, setVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity value

    useEffect(() => {
      setVisible(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // 500ms to fade in
        useNativeDriver: true,
      }).start();

      console.log(message);

      const timeout = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 6000);

      return () => clearTimeout(timeout);
    }, [message]);

    const alertStyles = {
      error: { backgroundColor: 'red', color: 'white' },
      success: { backgroundColor: 'green', color: 'white' },
      warning: { backgroundColor: 'orange', color: 'black' },
    };

  const { backgroundColor, color } = alertStyles[type];

  if (!visible) return null;

  return (
    <Animated.View className='items-center py-[10px] rounded-[50px]'
     style={[styles.alertContainer, { backgroundColor, opacity: fadeAnim }]}>
      <Text className='text-center' style={[{ color }]}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 50,
    left:10,
    right: 10,
    zIndex: 1000,
    width: wp("90%"),
  },
});
