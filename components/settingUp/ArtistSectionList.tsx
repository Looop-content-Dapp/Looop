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
import { MotiView } from "moti";

const { width } = Dimensions.get("window");

const SkeletonArtistCard = () => {
  return (
    <View style={styles.card}>
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={[styles.artistImage, { backgroundColor: '#2e2e2e' }]}
      />
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={{
          height: 20,
          width: '80%',
          backgroundColor: '#2e2e2e',
          borderRadius: 4,
          marginBottom: 8,
        }}
      />
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={{
          height: 16,
          width: '60%',
          backgroundColor: '#2e2e2e',
          borderRadius: 4,
          marginBottom: 12,
        }}
      />
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={{
          height: 36,
          width: '80%',
          backgroundColor: '#2e2e2e',
          borderRadius: 20,
        }}
      />
    </View>
  );
};

const ArtistCard = ({
  artist,
  onFollow,
}: {
  artist: any;
  onFollow: any;
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: artist.profileImage }} style={styles.artistImage} />
      <Text style={styles.artistName}>{artist?.name}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{artist?.tribestars} Tribestars</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.followButton, 
          artist.isFavourite && styles.followingButton
        ]}
        onPress={() => onFollow(artist.id)}
      >
        <Text style={[
          styles.followButtonText,
          artist.isFavourite && { color: '#ffffff' }
        ]}>
          {artist.isFavourite ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
//&& !item

const ArtistSection = ({
  section,
  onFollow,
  loading,
}: {
  section: any;
  onFollow: any;
  loading?: boolean;
}) => {
  return (
    <View style={styles.section}>
      <FlatList
        horizontal
        data={loading ? Array(3).fill({}) : section}
        keyExtractor={(item, index) => index.toString() + Date.now()}
        renderItem={({ item }) => (
          loading && !item  ? (
            <SkeletonArtistCard />
          ) : (
            <ArtistCard
              artist={item}
              onFollow={onFollow}
            />
          )
        )}
        contentContainerStyle={styles.artistList}
      />
    </View>
  );
};

const ArtistSectionList = ({
  sections = [],
  onFollow,
  loading,
}: {
  sections: any[];
  onFollow?: any;
  loading?: boolean;
}) => {
  const listsections = loading 
    ? [{ title: 'Loading...', data: [] }] 
    : sections.map((item: any) => ({
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
          <ArtistSection
            section={section.data}
            onFollow={onFollow}
            loading={loading}
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

  continueButton: {
    backgroundColor: "#FF6D1B",
    width: "90%",
    alignSelf: "center",
    padding: 16,
    borderRadius: 56,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default ArtistSectionList;
