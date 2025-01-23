import { Animated, Text, StyleSheet, Dimensions } from "react-native";

// Constants for styling and animation
const TOAST_DURATION = 3000;
const ANIMATION_DURATION = 300;
const TOAST_MARGIN = 20;
const TOAST_TOP = 120; // Changed from TOAST_BOTTOM to TOAST_TOP

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: TOAST_TOP,
    left: TOAST_MARGIN,
    right: TOAST_MARGIN,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: Dimensions.get('window').width - (TOAST_MARGIN * 2),
    zIndex: 9999,
  },
  icon: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  message: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSansRegular',
  }
});

interface ToastColors {
  border: string;
  text: string;
  icon: string;
}

const TOAST_TYPES: Record<'success' | 'error', ToastColors> = {
  success: {
    border: '#4CAF50',
    text: '#4CAF50',
    icon: '✓'
  },
  error: {
    border: '#F44336',
    text: '#F44336',
    icon: '✕'
  }
};

export const showToast = (message: string, type: 'success' | 'error') => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-50); // Changed from 50 to -50 for top animation

  const ToastMessage = () => {
    const colors = TOAST_TYPES[type];

      // Animate toast with spring for more natural feel
  Animated.parallel([
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
    }),
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 15,
    })
  ]).start();

  // Hide toast after duration
  setTimeout(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50, // Changed from 50 to -50 for top animation
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      })
    ]).start();
  }, TOAST_DURATION);

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ translateY }],
            borderLeftColor: colors.border,
          }
        ]}
      >
        <Text style={[
          styles.icon,
          { color: colors.text }
        ]}>
          {colors.icon}
        </Text>
        <Text
          style={styles.message}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {message}
        </Text>
      </Animated.View>
    );
  };



  return ToastMessage;
};
