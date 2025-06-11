import React from "react";
import { StatusBar } from "expo-status-bar";
import { UserGroupIcon } from "@hugeicons/react-native";
import { View, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Safe area hook

import MusicTab from "@/components/TabSection/MusicTab"; // Import your music tab
import useMusicPlayer from "@/hooks/music/useMusicPlayer";
import MusicPlayer from "@/components/MusicPlayer";
import StaticButton from "@/components/Draggable/DraggableButton";
import { PortalProvider } from "@gorhom/portal";

export default function _TabsLayout() {
  const screenHeight = Dimensions.get("window").height;
  const insets = useSafeAreaInsets();
  const tabBarHeight = 0;
  const { currentTrack } = useMusicPlayer();


  return (
    <View style={styles.container}>
        <PortalProvider>
        <StatusBar style="light" backgroundColor="#040405" />

    {/* Music Tab content */}
   <MusicTab />

   {/* Draggable button placed just above the tab bar */}
    <StaticButton
  color="#8D4FB4"
  icon={UserGroupIcon}
  route="/(communityTabs)/(feed)"
  initialPosition={{
    x: 16,
    y: screenHeight - tabBarHeight - insets.bottom - 0, // Ensures the button stays above the tab bar
  }}
  />

  {/* Music player positioned above the bottom tab bar */}
  {currentTrack && <MusicPlayer />}
 </PortalProvider>

      {/*  */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
