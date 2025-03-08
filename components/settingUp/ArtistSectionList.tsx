import React, { memo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { useQuery } from "@/hooks/useQuery"; // Adjust the import path as necessary
import { MotiView } from "moti";
import { Tick01Icon, Search01Icon } from "@hugeicons/react-native"; // Adjust icon names as necessary
import { useAppSelector } from "@/redux/hooks";

const { width } = Dimensions.get("window");

// Type definitions
interface Artist {
  _id: string;
  name: string;
  profileImage?: string;
  isFollowing?: boolean; // Optional, defaults to false
}

interface ArtistSectionListProps {
  loading?: boolean;
  userId?: string; // Optional userId prop
}

const CARD_WIDTH = width * 0.3; // Adjusted for a 3-column grid
const SKELETON_ANIMATION = {
  from: { opacity: 0.3 },
  animate: { opacity: 0.7 },
  transition: { type: "timing", duration: 1000, repeatReverse: true, loop: true },
} as const;

// Memoized Skeleton Card
const SkeletonArtistCard = memo(() => (
  <View style={styles.card}>
    <MotiView
      {...SKELETON_ANIMATION}
      style={[styles.artistImage, { backgroundColor: "#2e2e2e" }]}
    />
    <MotiView {...SKELETON_ANIMATION} style={styles.skeletonText} />
  </View>
));

// Memoized Artist Card
const ArtistCard = memo(({ artist, onFollow }: { artist: Artist; onFollow: (id: string, follow: boolean) => void }) => {
  const [isFollowing, setIsFollowing] = useState(artist.isFollowing || false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(artist._id, !isFollowing); // Pass the artist ID and new follow state
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleFollow} style={styles.imageContainer}>
        <Image
          source={{ uri: artist.profileImage || "https://via.placeholder.com/100" }} // Fallback image
          style={styles.artistImage}
          resizeMode="cover"
        />
        {isFollowing && (
          <View style={styles.checkmarkOverlay}>
            <Tick01Icon size={24} color="#040405" />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.artistName} numberOfLines={1}>
        {artist.name}
      </Text>
    </View>
  );
});

const ArtistSectionList: React.FC<ArtistSectionListProps> = ({ loading: initialLoading = false }) => {
  const { getAllArtists, followArtist } = useQuery();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { userdata } = useAppSelector((auth) => auth.auth)

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const response = await getAllArtists();
        if (response && response.data) {
          const artistsWithFollowState = response.data.map((artist: Artist) => ({
            ...artist,
            isFollowing: artist.isFollowing || false, // Ensure isFollowing is initialized
          }));
          setArtists(artistsWithFollowState);
          setFilteredArtists(artistsWithFollowState); // Initially show all artists
        } else {
          setArtists([]);
          setFilteredArtists([]);
        }
      } catch (err) {
        setError("Failed to load artists. Please try again.");
        setArtists([]);
        setFilteredArtists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [getAllArtists]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredArtists(artists);
    } else {
      const filtered = artists.filter((artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArtists(filtered);
    }
  };

  const handleFollow = async (artistId: string, newFollowState: boolean) => {
    try {
      if (newFollowState && userdata?._id) {
        const response = await followArtist(userdata?._id, artistId);
        if (response?.status !== "success") throw new Error("Failed to follow artist");
      }
      // Update the artists state to reflect the follow state
      setArtists((prevArtists) =>
        prevArtists.map((artist) =>
          artist._id === artistId ? { ...artist, isFollowing: newFollowState } : artist
        )
      );
      setFilteredArtists((prevArtists) =>
        prevArtists.map((artist) =>
          artist._id === artistId ? { ...artist, isFollowing: newFollowState } : artist
        )
      );
    } catch (err) {
      console.error("Error following artist:", err);
      // Revert the follow state on failure
      setArtists((prevArtists) =>
        prevArtists.map((artist) =>
          artist._id === artistId ? { ...artist, isFollowing: !newFollowState } : artist
        )
      );
      setFilteredArtists((prevArtists) =>
        prevArtists.map((artist) =>
          artist._id === artistId ? { ...artist, isFollowing: !newFollowState } : artist
        )
      );
    }
  };

  const renderItem = ({ item }: { item: Artist | null }) => {
    if (loading || !item) return <SkeletonArtistCard />;
    return <ArtistCard artist={item} onFollow={handleFollow} />;
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search01Icon size={20} color="#A0A0A0" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an artist"
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={loading ? Array(15).fill(null) : filteredArtists} // 15 skeletons for initial loading
          renderItem={renderItem}
          keyExtractor={(item, index) => item?._id || `skeleton-${index}`}
          numColumns={3} // 3-column grid to match the image layout
          contentContainerStyle={styles.artistList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111318",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderColor: "#202227",
    borderWidth: 1,
    height: 48
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#f4f4f4",
    fontSize: 16,
  },
  artistList: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "transparent", // No background to match the image
    borderRadius: 8,
  },
  imageContainer: {
    position: "relative",
  },
  artistImage: {
    width: 110,
    height: 110,
    borderRadius: 50,
    marginBottom: 8,
  },
  checkmarkOverlay: {
    position: "absolute",
    top: 8,
    right: 0,
    backgroundColor: "#2DD881",
    borderRadius: 40,
    padding: 2,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22
  },
  skeletonText: {
    height: 16,
    width: "80%",
    backgroundColor: "#2e2e2e",
    borderRadius: 4,
    marginBottom: 8,
  },
  errorText: {
    color: "#A0A0A0",
    textAlign: "center",
    padding: 16,
  },
});

export default memo(ArtistSectionList);
