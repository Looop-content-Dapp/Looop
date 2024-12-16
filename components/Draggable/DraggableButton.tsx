import React, { useRef, useEffect, useState } from 'react';
import {
  PanResponder,
  Animated,
  TouchableOpacity,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useMusicPlayer from '../../hooks/useMusicPlayer';

const DraggableButton = ({ icon: Icon, route, initialPosition, color }) => {
  const pan = useRef(new Animated.ValueXY(initialPosition)).current;
  const { currentTrack } = useMusicPlayer();
  const insets = useSafeAreaInsets();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // Constants for layout calculations
  const BUTTON_SIZE = 64; // 16 * 4 (h-16 w-16)
  const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;
  const SAFETY_MARGIN = 16;

  // Update dimensions on layout change
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Calculate safe boundaries for the button
  const getBoundaries = () => {
    const maxX = dimensions.width - BUTTON_SIZE - SAFETY_MARGIN;
    const minX = SAFETY_MARGIN;
    const maxY = dimensions.height - TAB_BAR_HEIGHT - BUTTON_SIZE - insets.bottom - SAFETY_MARGIN;
    const minY = SAFETY_MARGIN + (Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight || 0);

    return { maxX, minX, maxY, minY };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gesture) => {
        const boundaries = getBoundaries();

        // Calculate new position with boundaries
        const newX = Math.min(Math.max(pan.x._offset + gesture.dx, boundaries.minX), boundaries.maxX);
        const newY = Math.min(Math.max(pan.y._offset + gesture.dy, boundaries.minY), boundaries.maxY);

        pan.setValue({
          x: gesture.dx,
          y: gesture.dy,
        });
      },
      onPanResponderRelease: (_, gesture) => {
        const boundaries = getBoundaries();

        // Ensure final position is within boundaries
        const finalX = Math.min(Math.max(pan.x._offset + gesture.dx, boundaries.minX), boundaries.maxX);
        const finalY = Math.min(Math.max(pan.y._offset + gesture.dy, boundaries.minY), boundaries.maxY);

        Animated.spring(pan, {
          toValue: {
            x: finalX - pan.x._offset,
            y: finalY - pan.y._offset,
          },
          useNativeDriver: false,
        }).start(() => {
          pan.flattenOffset();
        });
      },
    })
  ).current;

  const handlePress = () => {
    router.push(route);
  };

  // Calculate initial position
  const getInitialPosition = () => {
    const boundaries = getBoundaries();
    return {
      x: Math.min(Math.max(initialPosition.x, boundaries.minX), boundaries.maxX),
      y: Math.min(Math.max(initialPosition.y, boundaries.minY), boundaries.maxY),
    };
  };

  // Set initial position on mount
  useEffect(() => {
    const position = getInitialPosition();
    pan.setValue(position);
  }, [dimensions]);

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          position: 'absolute',
          zIndex: 1000,
          ...(Platform.OS === 'android' && {
            elevation: 1000,
          }),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[
          {
            backgroundColor: color,
            ...(Platform.OS === 'android' && {
              elevation: 5,
            }),
          },
        ]}
        className="h-16 w-16 rounded-full flex items-center justify-center"
      >
        {Icon && <Icon size={32} color="#FFFFFF" variant="stroke" />}
      </TouchableOpacity>
    </Animated.View>
  );
};

DraggableButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  route: PropTypes.string.isRequired,
  initialPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  color: PropTypes.string.isRequired,
};

DraggableButton.defaultProps = {
  initialPosition: { x: 16, y: 100 },
};

export default DraggableButton;
