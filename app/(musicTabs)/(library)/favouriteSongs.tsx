import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Animated,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Search01Icon, ArrowLeft02Icon } from "@hugeicons/react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { artistsArr, fetchAllAlbumsAndEPs } from "../../../utils/ArstsisArr";
import ToggleFlatListView from "../../../components/view/ToggleFlatlistView";
import GridComponent from "../../../components/cards/GridComponents";
import ListComponent from "../../../components/cards/ListComponents";
import { useRouter } from "expo-router";
import { useQuery } from "../../../hooks/useQuery";

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const FavouriteSongs = () => {
  const fav = fetchAllAlbumsAndEPs(artistsArr);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const route = useRouter();
  const [likedSongs, setLikedSongs] = useState([]); // State to store fetched liked songs
  const [loading, setLoading] = useState(true); // Loading state for skeleton
  const { getLikedSongs, retrieveUserId } = useQuery();
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20;

  // Add these functions inside your component
  const handleRefresh = async () => {
    setPage(1);
    try {
      const userId = await retrieveUserId();
      if (userId) {
        const data = await getLikedSongs(userId);
        setLikedSongs(data);
        setFilteredSongs(data);
      }
    } catch (error) {
      console.error("Error refreshing liked songs:", error);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || loading) return;

    setLoadingMore(true);
    try {
      const userId = await retrieveUserId();
      if (userId) {
        const nextPage = page + 1;
        const data = await getLikedSongs(userId, nextPage, ITEMS_PER_PAGE);

        if (data.length > 0) {
          setLikedSongs((prev) => [...prev, ...data]);
          setFilteredSongs((prev) => [...prev, ...data]);
          setPage(nextPage);
        }
      }
    } catch (error) {
      console.error("Error loading more liked songs:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const searchAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const fetchLikedSongs = async () => {
      setLoading(true);
      try {
        const userId = await retrieveUserId();
        if (userId) {
          const data = await getLikedSongs(userId);
          setLikedSongs(data);
          setFilteredSongs(data);
        }
      } catch (error) {
        console.error("Error fetching liked songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, [getLikedSongs]);

  // Animations for the header
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [180, 80],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [150, 180],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    const filtered = likedSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(text.toLowerCase()) ||
        song.artist.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button and Page Title */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => route.back()}>
          <ArrowLeft02Icon size={24} color="#D2D3D5" variant="stroke" />
        </TouchableOpacity>
        <Animated.Text
          style={[styles.headerBarTitle, { opacity: headerTitleOpacity }]}
        >
          Favorite Songs
        </Animated.Text>
      </View>

      {/* Animated Header with Image Background */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <AnimatedImageBackground
          source={require("../../../assets/images/FavBackground.png")}
          style={[styles.imageBackground, { opacity: imageOpacity }]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Favorite Songs</Text>
            <Text style={styles.headerSubtitle}>
              All your saved songs in one place
            </Text>
          </View>
        </AnimatedImageBackground>
      </Animated.View>

      {/* Sticky Search Bar */}
      {showStickySearch && (
        <View style={styles.stickySearchContainer}>
          <Search01Icon size={24} color="#787A80" />
          <Text style={styles.searchPlaceholder}>
            What song are you looking for?
          </Text>
        </View>
      )}

      <Animated.ScrollView
        style={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event) => {
              const offsetY = event?.nativeEvent?.contentOffset.y;
              if (offsetY > 180) {
                setShowStickySearch(true);
              } else {
                setShowStickySearch(false);
              }
            },
          }
        )}
        scrollEventThrottle={16}
      >
        {/* Search Bar Below Header with Animation */}
        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            { transform: [{ scale: searchAnimation }] },
          ]}
        >
          <View style={styles.searchContent}>
            <Search01Icon size={24} color="#787A80" />
            <TextInput
              style={styles.searchInput}
              placeholder="What song are you looking for?"
              placeholderTextColor="#787A80"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        </Animated.View>

        {/* Content */}
        <View style={{ paddingTop: 20 }}>
          <ToggleFlatListView
            data={filteredSongs}
            GridComponent={GridComponent}
            ListComponent={ListComponent}
            title="Favourite"
            loading={loading}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0B0F",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#0A0B0F",
  },
  headerBarTitle: {
    fontSize: 18,
    color: "#D2D3D5",
    marginLeft: 10,
    fontFamily: "PlusJakartaSansBold",
  },
  header: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
  },
  imageBackground: {
    height: "100%",
    justifyContent: "flex-end",
  },
  headerContent: {
    position: "absolute",
    bottom: 12,
    left: 24,
  },
  headerTitle: {
    fontSize: 40,
    fontFamily: "PlusJakartaSansBold",
    color: "#f4f4f4",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSansMedium",
    color: "#12141B",
  },
  stickySearchContainer: {
    position: "absolute",
    top: 110,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "#0A0B0F",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#12141B",
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0A0B0F",
    borderBottomWidth: 2,
    borderBottomColor: "#12141B",
    marginTop: 20,
    marginHorizontal: "5%",
    borderRadius: 10,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchPlaceholder: {
    color: "#787A80",
    fontSize: 14,
    fontFamily: "PlusJakartaSansMedium",
    marginLeft: 16,
  },
  searchInput: {
    flex: 1,
    color: "#D2D3D5",
    fontSize: 14,
    fontFamily: "PlusJakartaSansMedium",
    marginLeft: 16,
  },
});

export default FavouriteSongs;
