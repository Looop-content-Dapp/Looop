import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { MotiView } from "moti";

const SkeletonLoader = () => {
  const { width, height } = useWindowDimensions();

  return (
    <MotiView
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, duration: 1000 }}
      style={[styles.skeletonContainer, { height: height * 0.6 }]} // Adjusted height
    >
      {/* Album Cover Skeleton */}
      <View style={[styles.skeletonBox, { width: width * 0.4, height: width * 0.4 }]} />

      {/* Title Skeleton */}
      <View style={[styles.skeletonTitle, { width: width * 0.6 }]} />

      {/* Description Skeleton */}
      <View style={[styles.skeletonDescription, { width: width * 0.8 }]} />
      <View style={[styles.skeletonDescription, { width: width * 0.75 }]} />

      {/* Buttons Skeleton */}
      <View style={styles.skeletonButtonsContainer}>
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeletonButton,
              { width: index === 2 ? 64 : 48, height: index === 2 ? 64 : 48 },
            ]}
          />
        ))}
      </View>

      {/* Tracks Skeleton */}
      <View style={styles.trackListContainer}>
        {[...Array(5)].map((_, index) => (
          <View key={index} style={styles.trackItem}>
            <View style={[styles.skeletonTrackTitle, { width: width * 0.6 }]} />
            <View style={[styles.skeletonTrackDuration, { width: width * 0.15 }]} />
          </View>
        ))}
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  skeletonBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    marginBottom: 24,
  },
  skeletonTitle: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 28,
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonDescription: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 20,
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
    marginBottom: 24,
  },
  skeletonButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 32,
  },
  trackListContainer: {
    width: "100%",
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  skeletonTrackTitle: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 24,
    borderRadius: 4,
  },
  skeletonTrackDuration: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    height: 24,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
