import React from 'react';
import {
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';
import { router } from 'expo-router';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useMusicPlayer from '../../hooks/useMusicPlayer';

const StaticButton = ({ icon: Icon, route, color }) => {
  const { currentTrack } = useMusicPlayer();
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    router.push(route);
  };

  return (
    <View
      style={[
        {
          position: 'absolute',
          right: 16, // SAFETY_MARGIN
          bottom: Platform.OS === 'ios' ? insets.bottom + 50 : 16,
          zIndex: 1000,
          ...(Platform.OS === 'android' && {
            elevation: 1000,
          }),
        },
      ]}
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
    </View>
  );
};

StaticButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  route: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default StaticButton;
