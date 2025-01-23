import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import CreatorTab from "../../components/TabSection/CreatorTabs";
import { PortalProvider } from "@gorhom/portal";

export default function _CreatorModeLayout() {
  return (
    <View style={styles.container}>
        <PortalProvider>
          <StatusBar style="light" backgroundColor="#040405" translucent={true} />
        <CreatorTab />
      </PortalProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
