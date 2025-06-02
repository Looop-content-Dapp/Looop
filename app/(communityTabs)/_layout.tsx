import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommunityTab from '../../components/TabSection/CommunityTab';
import DraggableButton from '../../components/Draggable/DraggableButton';
import { MusicNote03Icon, UserGroupIcon } from '@hugeicons/react-native';
import { PortalProvider } from "@gorhom/portal";

export default function _TabsLayout() {
  // Get screen height and safe area insets for dynamic positioning
  const screenHeight = Dimensions.get('window').height;
  const insets = useSafeAreaInsets();
  const tabBarHeight = 0; // Assuming the tab bar has a height of 56 (can vary)

  return (
    <View style={styles.container}>
    <PortalProvider>
      <StatusBar style="light" />

      {/* Community Tab content */}
      <CommunityTab />

      {/* Draggable button placed on top of the tab bar */}
      <DraggableButton
      color="#FF6D1B"
        icon={MusicNote03Icon}
        route="/(musicTabs)/(home)"
        initialPosition={{
          x: 25,
          y: screenHeight - tabBarHeight - insets.bottom - 0 // Ensures it stays above tab bar dynamically
        }}
      />
     </PortalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
