import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import CreatorTab from '../../components/TabSection/CreatorTabs';

export default function _CreatorModeLayout() {

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#040405" />
      <CreatorTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
