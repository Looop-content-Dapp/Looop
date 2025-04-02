import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Platform,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft02Icon,
  Wallet01Icon,
  CheckmarkBadge01Icon,
  HeadphonesIcon,
} from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { Artist } from "@/types/index";
import Ellipse from "../../../components/Ellipse";
import ArtistReleases from "../../../components/ArtistProfile/ArtistReleases";
import ArtistCollectible from "../../../components/ArtistProfile/ArtistCollectible";
import ArtistAbout from "../../../components/ArtistProfile/ArtistAbout";

const TABS = ["releases", "collectible", "about"] as const;
type TabType = typeof TABS[number];

// Placeholder Component
const ProfilePlaceholder = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.placeholderImage} />
    <View style={styles.placeholderTextContainer}>
      <View style={styles.placeholderName} />
      <View style={styles.placeholderStats} />
    </View>
  </View>
);

const ArtistProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>("releases");
  const [artistProfile, setArtistProfile] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { userdata } = useAppSelector((state) => state.auth);
  const { navigate } = useRouter();

  // Memoized animations
  const animations = useMemo(
    () => ({
      headerHeight: scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [hp("40.9%"), hp("10%")],
        extrapolate: "clamp",
      }),
      headerOpacity: scrollY.interpolate({
        inputRange: [100, 200],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      imageOpacity: scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    }),
    [scrollY]
  );

  // Fetch artist info
  const retrieveArtistInfo = useCallback(async () => {
    if (!userdata?.artist) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/api/artist/${userdata.artist}`);
      setArtistProfile(response?.data?.data?.artist || null);
    } catch (error) {
      console.error("Failed to fetch artist info:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userdata?.artist]);

  useEffect(() => {
    retrieveArtistInfo();
  }, [retrieveArtistInfo]);

  // Memoized tab content renderer
  const renderTabContent = useMemo(() => {
    const components = {
      releases: <ArtistReleases artistId={userdata?.artist} />,
      collectible: <ArtistCollectible />,
      about: <ArtistAbout />,
    };
    return components[activeTab];
  }, [activeTab, userdata?.artist]);

  // Handle scroll for sticky tabs
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const formatNumber = (num: number = 0) => num.toLocaleString();

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: animations.headerHeight }]}>
        {isLoading ? (
          <ProfilePlaceholder />
        ) : (
          <ImageBackground
            source={{ uri: artistProfile?.profileImage }}
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <View style={styles.artistInfo}>
                <View style={styles.artistNameContainer}>
                  <Text style={styles.artistName} numberOfLines={1}>
                    {artistProfile?.name}
                  </Text>
                  {artistProfile?.verified && (
                    <CheckmarkBadge01Icon size={20} color="#2DD881" variant="solid" />
                  )}
                </View>
                <View style={styles.statsContainer}>
                  <Text style={styles.statsText}>
                    {formatNumber(artistProfile?.followers)} Followers
                  </Text>
                  <Ellipse />
                  <Text style={styles.statsText} numberOfLines={1}>
                    {formatNumber(artistProfile?.monthlyListeners)} Monthly Listeners
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.changeCoverButton}>
                <Text style={styles.changeCoverText}>Change Cover</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate("/(musicTabs)")}
          >
            <HeadphonesIcon size={24} color="#FF8A49" variant="solid" />
            <Text style={styles.actionText}>Back to Listen Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate("/wallet")}
          >
            <Wallet01Icon size={20} color="#A187B5" variant="stroke" />
            <Text style={styles.actionText}>Wallet & Earnings</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>{renderTabContent}</View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    overflow: "hidden",
  },
  headerBackground: {
    height: "100%",
    width: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp("25%"),
    paddingHorizontal: wp("5%"),
  },
  artistInfo: {
    flex: 1,
    marginRight: wp("2%"),
  },
  artistNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  artistName: {
    fontSize: 24,
    fontFamily: "PlusJakartaSansBold",
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
    marginTop: hp("0.5%"),
  },
  statsText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSansMedium",
    color: "#A5A6AA",
  },
  changeCoverButton: {
    borderWidth: 1,
    borderColor: "#D2D3D5",
    paddingVertical: hp("1.2%"),
    paddingHorizontal: wp("3.5%"),
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  changeCoverText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSansMedium",
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp("5%"),
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp("4%"),
    paddingHorizontal: wp("4%"),
    marginTop: hp("2%"),
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#12141B",
    borderRadius: 16,
    height: hp("11%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    color: "#f4f4f4",
    fontSize: 14,
    fontFamily: "PlusJakartaSansMedium",
    textAlign: "center",
    marginTop: hp("0.5%"),
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
    marginTop: hp("2%"),
    paddingHorizontal: wp("1%"),
  },
  tab: {
    paddingVertical: hp("2.5%"),
    paddingHorizontal: wp("6%"),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF8A49",
  },
  tabText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSansMedium",
    color: "#A5A6AA",
  },
  activeTabText: {
    color: "white",
  },
  tabContent: {
    paddingVertical: hp("2%"),
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  placeholderImage: {
    height: hp("40.9%"),
    backgroundColor: "#2D2D2D",
  },
  placeholderTextContainer: {
    paddingHorizontal: wp("3%"),
    marginTop: hp("5%"),
  },
  placeholderName: {
    height: hp("3%"),
    width: wp("60%"),
    backgroundColor: "#404040",
    borderRadius: 4,
    marginBottom: hp("1%"),
  },
  placeholderStats: {
    height: hp("2%"),
    width: wp("40%"),
    backgroundColor: "#404040",
    borderRadius: 4,
  },
});

export default ArtistProfileScreen;
