import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import type { Genre } from "@/hooks/useGenre";
import { MotiView } from "moti";
const { width } = Dimensions.get("window");
const ITEM_WIDTH = width / 2 - 15;

const MusicCategoryGrid = ({
  data,
  selectedGenres = [],
  onSelectGenre,
  isLoading,
}: {
  data: Genre[];
  selectedGenres?: string[];
  onSelectGenre: (genreName: string) => void;
  isLoading?: boolean;
}) => {
  const renderItem = ({ item }: { item: Genre }) => {
    const isSelected = selectedGenres.includes(item.name);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onSelectGenre(item.name)}
        activeOpacity={0.7}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <View
            style={[styles.overlay, isSelected && styles.selectedOverlay]}
          />

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          )}

          <Text style={styles.itemName}>{item.name}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={isLoading ? SkeletonInterest : renderItem}
      keyExtractor={(item, index) => item.name || index.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <Text className="text-[14px] text-[#f4f4f4] font-PlusJakartaSansBold">
          Select one or more genres and we’ll help you discover amazing sounds
        </Text>
      }
    />
  );
};

const SkeletonInterest = () => (
  <View style={styles.skeletonInterestContainer}>
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, duration: 1000 }}
      style={styles.skeletonInterest}
    />
  </View>
);
const styles = StyleSheet.create({
  skeletonInterestContainer: {
    width: "33%",
    padding: 3,
  },
  skeletonInterest: {
    backgroundColor: "#2e2e2e",
    height: 48,
    borderRadius: 56,
  },
  container: {
    width: "100%",
  },
  listContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 8,
    overflow: "hidden",
    margin: 5,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  selectedOverlay: {
    backgroundColor: "rgba(255, 122, 27, 0.5)",
  },
  selectedIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF7A1B",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    padding: 12,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default MusicCategoryGrid;
