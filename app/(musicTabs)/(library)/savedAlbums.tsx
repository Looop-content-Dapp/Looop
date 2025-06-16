import { ArrowLeft02Icon, Search01Icon } from "@hugeicons/react-native";
import { router, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GridComponent from "../../../components/cards/GridComponents";
import ListComponent from "../../../components/cards/ListComponents";
import ToggleFlatListView from "../../../components/view/ToggleFlatlistView";

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const SavedAlbums = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const route = useRouter();
  const [savedAlbums, setSavedAlbums] = useState([]); // State to store fetched saved albums
  const [loading, setLoading] = useState(true); // Loading state for skeleton

  const searchAnimation = useRef(new Animated.Value(1)).current;

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
    const filtered = savedAlbums.filter(
      (album: any) =>
        album.title.toLowerCase().includes(text.toLowerCase()) ||
        album.artist.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAlbums(filtered);
  };

  useEffect(() => {
    const fetchSavedAlbums = async () => {
      setLoading(true);
      try {
      } catch (error) {
        console.error("Error fetching saved albums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedAlbums();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button and Page Title */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft02Icon size={24} color="#D2D3D5" variant="stroke" />
        </TouchableOpacity>
        <Animated.Text
          className="text-[28px] font-TankerRegular text-[#f4f4f4]"
          style={{ opacity: headerTitleOpacity }}
        >
          Downloads
        </Animated.Text>
      </View>

      {/* Animated Header with Image Background */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <AnimatedImageBackground
          source={require("../../../assets/images/savedABackground.png")}
          style={[styles.imageBackground, { opacity: imageOpacity }]}
        >
          <View style={styles.headerContent}>
            <Text className="text-[40px] font-TankerRegular text-[#f4f4f4]">
              Downloads
            </Text>
            <Text style={styles.headerSubtitle}>
              Browse through your downloads
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
            listener: (event: any) => {
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
              placeholder="What album are you looking for?"
              placeholderTextColor="#787A80"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        </Animated.View>

        <View style={{ paddingTop: 20 }}>
          <ToggleFlatListView
            data={filteredAlbums}
            GridComponent={GridComponent}
            ListComponent={ListComponent}
            title="Downloads"
            loading={loading}
            renderItem={(item: any) => ({
              _id: item._id,
              track: { title: item.title },
              artist: { name: item.artist },
              release: {
                artwork: { medium: item.coverImage },
                title: item.title,
              },
            })}
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
    color: "#ffffff",
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

export default SavedAlbums;
