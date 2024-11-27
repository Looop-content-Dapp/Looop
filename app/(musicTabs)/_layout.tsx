import React from 'react';
import { StatusBar } from 'expo-status-bar';
import DraggableButton from '../../components/Draggable/DraggableButton';
import { UserGroupIcon } from '@hugeicons/react-native';
import { View, StyleSheet, Dimensions } from 'react-native';
import MusicTab from '../../components/TabSection/MusicTab'; // Import your music tab
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Safe area hook
import useMusicPlayer from '../../hooks/useMusicPlayer';
import MusicPlayer from '../../components/MusicPlayer';

export default function _TabsLayout() {
  // Get screen height and safe area insets for dynamic positioning
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const tabBarHeight = 0; // Estimated height of the bottom tab bar
  const { currentTrack } = useMusicPlayer()

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#040405" />

      {/* Music Tab content */}
      <MusicTab />

      {/* Draggable button placed just above the tab bar */}
      <DraggableButton
      color="#8D4FB4"
        icon={UserGroupIcon}
        route="/(communityTabs)/(feed)"
        initialPosition={{
          x: 16,
          y: screenHeight - tabBarHeight - insets.bottom - 0, // Ensures the button stays above the tab bar
        }}
      />

      {/* Music player positioned above the bottom tab bar */}
      {currentTrack && (
        <MusicPlayer />
      )}
      {/*  */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
