import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { MotiView } from "moti";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  ArrowRight02Icon,
  HeadphonesIcon,
  UserGroupIcon,
  ArrowLeft02Icon,
  CheckmarkBadge01Icon, 
} from "@hugeicons/react-native";
const { width } = Dimensions.get("window");
const ARTIST_CARD_WIDTH = width / 2 - 20;
const ARTIST_CARD_HEIGHT = 200;

interface Artist {
  id: string;
  name: string;
  profileImage: string;
  tribeName: string;
}

interface GenreData {
  genreName: string;
  artists: Artist[];
}

interface ArtistsByGenreProps {
  data: GenreData[];
  onJoinTribe: (id: string, name: string) => void;
}

const ArtistsByGenre: React.FC<ArtistsByGenreProps> = ({
  data,
  onJoinTribe,
}) => {
  const filteredData =
    data?.filter((item) => item.artists && item.artists.length > 0) || [];

  const renderArtistItem = ({ item }: { item: Artist }) => {
    return (
      <View style={styles.artistCardContainer}>
        <ImageBackground
          source={{ uri: item.profileImage }}
          style={styles.artistCard}
          imageStyle={styles.artistImage}
        >
          <View style={styles.artistOverlay} />
          <View style={styles.ArtistNameTopContainer}>
            <CheckmarkBadge01Icon size={20} color="#ffffff" 
            variant="solid"
            />
            <Text style={styles.artistNameTop}>{item.name}</Text>
          </View>
          
          <View style={styles.artistInfoOverlay}>
            <Text style={styles.artistName}>{item.name}</Text>
            <Text style={styles.tribeName}>{item.tribeName}</Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => onJoinTribe(item.id, item.name)}
            >
              <Text style={styles.joinButtonText}>Join Tribe</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderGenreSection = ({ item }: { item: GenreData }) => {
    return (
      <View style={styles.genreSection}>
        <View style={styles.genreHeader}>
          <Text className="text-[16px] text-Grey/02 font-PlusJakartaSansBold text-[#f4f4f4]">
            {item.genreName}
            </Text>
          
          
        </View>
        <FlatList
          data={item.artists}
          renderItem={renderArtistItem}
          keyExtractor={(artist) => artist.id}
          horizontal={false}
          numColumns={2}
          scrollEnabled={false}
          contentContainerStyle={styles.artistsContainer}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderGenreSection}
          keyExtractor={(item) => item.genreName}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No artists found for your selected genres
          </Text>
          <MotiView
            from={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ loop: true, duration: 1000 }}
            style={styles.loadingIndicator}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#040405",
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: hp("15%"),
  },
  genreSection: {
    marginBottom: 20,
  },
  genreHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#333",
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f4f4f4",
    fontFamily: "PlusJakartaSansBold",
    flex: 1,
  },
  artistCount: {
    fontSize: 14,
    color: "#A0A0A0",
    fontFamily: "PlusJakartaSansRegular",
    marginRight: 10,
  },
  artistsContainer: {
    paddingTop: 10,
  },
  artistCardContainer: {
    width: "50%",
    padding: 8,
  },
  artistCard: {
    width: "100%",
    height: ARTIST_CARD_HEIGHT,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  artistImage: {
    borderRadius: 12,
  },
  artistOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  artistNameTop: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSansBold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  artistInfoOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  artistName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSansBold",
  },
  tribeName: {
    color: "#A0A0A0",
    fontSize: 12,
    fontFamily: "PlusJakartaSansRegular",
    marginTop: 2,
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#000000",
    fontSize: 12,
    fontFamily: "PlusJakartaSansRegular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#f4f4f4",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "PlusJakartaSansRegular",
    marginBottom: 20,
  },
  loadingIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2e2e2e",
  },
  ArtistNameTopContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: 10,
    elevation: 5,
    flexDirection: "row",
    gap: 5,
  },
});

export default ArtistsByGenre;