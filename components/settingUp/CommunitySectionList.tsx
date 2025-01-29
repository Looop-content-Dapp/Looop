import React from "react";
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

const { width } = Dimensions.get("window");

const CommunityCard = ({
  artist,
  onFollow,
  isFollowing,
}: {
  artist: any;
  onFollow: any;
  isFollowing: any;
}) => (
  <View style={styles.card}>
    <Image source={{ uri: artist.profileImage }} style={styles.artistImage} />
    <Text style={styles.artistName}>{artist?.name}</Text>
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>{artist?.tribestars} Tribestars</Text>
    </View>
    <TouchableOpacity
      style={[styles.followButton, isFollowing && styles.followingButton]}
      onPress={() => onFollow(artist.id)}
    >
      <Text style={styles.followButtonText}>
        {isFollowing ? "Following" : "Follow"}
      </Text>
    </TouchableOpacity>
  </View>
);

const CommunitySection = ({
  section,
  onFollow,
  followingArtists,
}: {
  section: any;
  onFollow: any;
  followingArtists: any;
}) => {
  return (
    <View style={styles.section}>
      <FlatList
        horizontal
        data={section}
        keyExtractor={(item, index) => index.toString() + Date.now()}
        renderItem={({ item }) => (
          <CommunityCard
            artist={item}
            onFollow={onFollow}
            isFollowing={followingArtists.includes(item.id)}
          />
        )}
        contentContainerStyle={styles.artistList}
      />
    </View>
  );
};

const CommunitySectionList = ({
  sections = [],
  onFollow,
  followingArtists = [],
}: {
  sections: any[];
  onFollow?: any;
  followingArtists?: any[];
}) => {
  const listsections = sections.map((item: any) => ({
    title: item.genreName,
    data: item.artists,
  }));

  return (
    <SectionList
      sections={listsections}
      keyExtractor={(item, index) => index.toString() + Date.now()}
      renderSectionHeader={({ section }) => (
        <View className="mt-[44px]">
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <CommunitySection
            section={section.data}
            onFollow={onFollow}
            followingArtists={followingArtists}
          />
        </View>
      )}
      renderItem={() => null}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      disableVirtualization={true}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  artistList: {
    flexGrow: 1,
  },
  card: {
    width: width * 0.4,
    marginHorizontal: 8,
    backgroundColor: "#12141B",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  artistName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: "#A0A0A0",
    marginBottom: 4,
  },
  tribeText: {
    fontSize: 12,
    color: "#808080",
  },
  followButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: "#555555",
  },
  followButtonText: {
    color: "#040405",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default CommunitySectionList;
