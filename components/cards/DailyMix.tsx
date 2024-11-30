import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { getGradientColors } from "../../utils";
import DailyMixSkeleton from "../SkeletonLoading/DailyMixSkelton";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 350;

const DailyMixCard = ({
  mix,
  onPress,
}: {
  mix: DailyMixesMix;
  onPress: () => void;
}) => {
  const colors = getGradientColors(mix.genre);
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[colors.start, colors.end]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Optional Pattern Overlay */}
        <View style={styles.pattern} />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          <Text style={styles.title} className="capitalize" numberOfLines={2}>
            {mix.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {mix.description}
          </Text>

          <View style={styles.footer}>
            <MaterialIcons
              name="playlist-play"
              size={24}
              color="rgba(255,255,255,0.9)"
            />
            <Text style={styles.trackCount}>
              {mix.tracks?.length || 0} tracks
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const DailyMixesSection = ({
  mixes,
  title = "",
  isLoading,
}: {
  mixes: DailyMixesMix[];
  title: string;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <DailyMixSkeleton count={3} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 20}
      >
        {mixes?.map((mix: DailyMixesMix) => (
          <DailyMixCard
            key={mix.id}
            mix={mix}
            onPress={() => {
              console.log("handle mix press");
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  pattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    // Add pattern if desired
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackCount: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 6,
  },
});

export default DailyMixesSection;
