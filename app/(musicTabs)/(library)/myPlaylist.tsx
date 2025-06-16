import GridComponent from "@/components/cards/GridComponents";
import ListComponent from "@/components/cards/ListComponents";
import ToggleFlatListView from "@/components/view/ToggleFlatlistView";
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import { useUserPlaylists } from "@/hooks/music/usePlaylist";
import { ArrowLeft02Icon, Search01Icon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
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

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const MyPlaylist = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const musicPlayer = useMusicPlayerContext();
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const route = useRouter();

  // Replace useLibrary with useUserPlaylists
  const { data: playlistResponse, isLoading, error } = useUserPlaylists();

  // Update how we extract the playlist data
  const playlistData = playlistResponse?.data || [];

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

  const handleSearchPress = () => {
    // Start animation for transition effect
    Animated.timing(searchAnimation, {
      toValue: 1.05,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to Search Screen after animation completes
      route.navigate("/(musicTabs)/(library)/musicSearch"); // Replace 'SearchScreen' with the correct route name
    });
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (playlistData) {
      const filtered = playlistData.filter((playlist: any) =>
        playlist.title.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPlaylists(filtered);
    }
  };

  // Update filtered playlists when data changes
  React.useEffect(() => {
    if (playlistData) {
      setFilteredPlaylists(playlistData);
    }
  }, [playlistData]);

  const handlePlaylistPress = (playlistId: string) => {
    route.push({
      pathname: "/(musicTabs)/(library)/_Libscreens/PlaylistDetails",
      params: { id: playlistId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button and Page Title */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => route.back()}>
          <ArrowLeft02Icon size={24} color="#D2D3D5" variant="stroke" />
        </TouchableOpacity>
        <Animated.Text
          className="text-[28px] font-TankerRegular text-[#f4f4f4]"
          style={{ opacity: headerTitleOpacity }}
        >
          My Playlist
        </Animated.Text>
      </View>

      {/* Animated Header with Image Background */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <AnimatedImageBackground
          source={require("../../../assets/images/playlistBackground.png")}
          style={[styles.imageBackground, { opacity: imageOpacity }]}
        >
          <View style={styles.headerContent}>
            <Text className="text-[40px] font-TankerRegular text-[#f4f4f4]">
              My Playlist
            </Text>
            <Text style={styles.headerSubtitle}>
              All your created playlists in one place
            </Text>
          </View>
        </AnimatedImageBackground>
      </Animated.View>

      {/* Sticky Search Bar */}
      {showStickySearch && (
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
              placeholder="What playlist are you looking for?"
              placeholderTextColor="#787A80"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        </Animated.View>
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
        contentContainerStyle={{
          paddingBottom: musicPlayer.currentTrack ? 80 : 40,
        }}
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
              placeholder="What playlist are you looking for?"
              placeholderTextColor="#787A80"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        </Animated.View>

        <View style={{ paddingTop: 20 }}>
          <ToggleFlatListView
            data={filteredPlaylists}
            GridComponent={GridComponent}
            ListComponent={ListComponent}
            title="My Playlists"
            loading={isLoading}
            error={error}
            renderItem={(item) => ({
              _id: item._id,
              track: { title: item.title },
              artist: { name: `${item.totalTracks} tracks` },
              release: {
                artwork: { medium: item.coverImage },
                title: item.description || "Playlist",
              },
              onPress: () => handlePlaylistPress(item._id),
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

export default MyPlaylist;
