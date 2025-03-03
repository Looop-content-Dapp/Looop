import React, { memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SectionList,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

// Constants for reusability
const CARD_WIDTH = width * 0.4;
const SKELETON_ANIMATION = {
  from: { opacity: 0.3 },
  animate: { opacity: 0.7 },
  transition: { type: "timing", duration: 1000, repeatReverse: true, loop: true },
} as const;

// Memoized Skeleton Card
const SkeletonArtistCard = memo(() => (
  <View style={styles.card}>
    <MotiView {...SKELETON_ANIMATION} style={[styles.artistImage, { backgroundColor: "#2e2e2e" }]} />
    <MotiView {...SKELETON_ANIMATION} style={styles.skeletonTextLarge} />
    <MotiView {...SKELETON_ANIMATION} style={styles.skeletonTextMedium} />
    <MotiView {...SKELETON_ANIMATION} style={styles.skeletonButton} />
  </View>
));

// Memoized Artist Card
const ArtistCard = memo(({ artist, onFollow }: { artist: any; onFollow: (id: string) => void }) => (
  <View style={styles.card}>
    <Image source={{ uri: artist.profileImage }} style={styles.artistImage} />
    <Text style={styles.artistName}>{artist.name}</Text>
    <Text style={styles.statsText}>{artist.tribestars} Tribestars</Text>
    <TouchableOpacity
      style={[styles.followButton, artist.isFavourite && styles.followingButton]}
      onPress={() => onFollow(artist.id)}
    >
      <Text
        style={[styles.followButtonText, artist.isFavourite && { color: "#ffffff" }]}
      >
        {artist.isFavourite ? "Following" : "Follow"}
      </Text>
    </TouchableOpacity>
  </View>
));

// Memoized Artist Section
const ArtistSection = memo(
  ({ section, onFollow, loading }: { section: any[]; onFollow: (id: string) => void; loading?: boolean }) => {
    if (!loading && (!section || section.length === 0)) {
      return (
        <View style={styles.emptySection}>
          <Text style={styles.emptyText}>No artists found. Try a different genre?</Text>
        </View>
      );
    }

    return (
      <FlatList
        horizontal
        data={loading ? Array(5).fill({}) : section}
        keyExtractor={(_, index) => `artist-${index}-${Date.now()}`}
        renderItem={({ item }) =>
          loading || !item ? <SkeletonArtistCard /> : <ArtistCard artist={item} onFollow={onFollow} />
        }
        contentContainerStyle={styles.artistList}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
);

const ArtistSectionList = ({
  sections = [],
  onFollow,
  loading,
}: {
  sections: any[];
  onFollow?: (id: string) => void;
  loading?: boolean;
}) => {
  const listSections = loading
    ? [{ title: "Pop", data: [] }, { title: "Rock", data: [] }, { title: "Hip Hop", data: [] }]
    : sections
        .map((item) => ({ title: item.genreName, data: item.artists || [] }))
        .filter((section) => section.data.length > 0); // Only keep sections with artists

  return (
    <SectionList
      sections={listSections}
      keyExtractor={(_, index) => `section-${index}-${Date.now()}`}
      renderSectionHeader={({ section }) => (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 300 }}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <ArtistSection section={section.data} onFollow={onFollow} loading={loading} />
        </MotiView>
      )}
      renderItem={() => null}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.sectionListContainer}
    />
  );
};

const styles = StyleSheet.create({
  sectionHeader: { marginTop: 44 },
  sectionTitle: { fontSize: 24, fontWeight: "bold", color: "#ffffff", marginBottom: 16 },
  artistList: { flexGrow: 1 },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
    backgroundColor: "#12141B",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  artistImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  artistName: { fontSize: 18, fontWeight: "600", color: "#ffffff", marginBottom: 8 },
  statsText: { fontSize: 14, color: "#A0A0A0", marginBottom: 12 },
  followButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  followingButton: { backgroundColor: "#555555" },
  followButtonText: { color: "#040405", fontSize: 14, fontWeight: "500" },
  emptySection: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#12141B",
    borderRadius: 16,
    marginHorizontal: 8,
  },
  emptyText: { color: "#A0A0A0", fontSize: 14, textAlign: "center" },
  skeletonTextLarge: { height: 20, width: "80%", backgroundColor: "#2e2e2e", borderRadius: 4, marginBottom: 8 },
  skeletonTextMedium: { height: 16, width: "60%", backgroundColor: "#2e2e2e", borderRadius: 4, marginBottom: 12 },
  skeletonButton: { height: 36, width: "80%", backgroundColor: "#2e2e2e", borderRadius: 20 },
  sectionListContainer: { flexGrow: 1 },
});

export default memo(ArtistSectionList);
