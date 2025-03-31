import { Animated, Text, StyleSheet, Dimensions, Platform } from "react-native";

// Constants for styling and animation
const TOAST_DURATION = 3000;
const ANIMATION_DURATION = 300;
const TOAST_MARGIN = 20;
const TOAST_TOP = 120;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: TOAST_TOP,
    left: TOAST_MARGIN,
    right: TOAST_MARGIN,
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 10,
    maxWidth: Dimensions.get('window').width - (TOAST_MARGIN * 2),
    zIndex: 999999,
    ...Platform.select({
      ios: {
        position: 'absolute',
      },
      android: {
        position: 'absolute',
        elevation: 999999,
      },
    }),
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999,
    elevation: 999999,
    pointerEvents: 'box-none',
  },
  icon: {
    fontWeight: 'bold',
    marginRight: 12,
    fontSize: 18,
  },
  message: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSansRegular',
    lineHeight: 20,
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
  const translateY = new Animated.Value(-50);
  const scale = new Animated.Value(0.9);

  const ToastMessage = () => {
    const colors = TOAST_TYPES[type];

    // Enhanced animation with scale for better pop effect
    Animated.parallel([
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        velocity: 3
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        velocity: 3
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        velocity: 3
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
          toValue: -50,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        })
      ]).start();
    }, TOAST_DURATION);

    return (
      <Animated.View style={styles.wrapper}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity,
              transform: [
                { translateY },
                { scale }
              ],
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
      </Animated.View>
    );
  };

  return ToastMessage;
};
