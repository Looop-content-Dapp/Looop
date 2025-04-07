import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  Platform,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StatusBar,
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
  console.log("artist Profile", artistProfile)

  const animations = useMemo(
    () => ({
      headerContentOpacity: scrollY.interpolate({
        inputRange: [0, 80],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
      headerScale: scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [1, 0.95],
        extrapolate: "clamp",
      }),
      overlayOpacity: scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0.3, 0.6],
        extrapolate: "clamp",
      }),
    }),
    [scrollY]
  );

  const layoutAnimations = useMemo(
    () => ({
      headerHeight: scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [hp("30%"), hp("8%")],
        extrapolate: "clamp",
      }),
    }),
    [scrollY]
  );

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

  const renderTabContent = useMemo(() => {
    const components = {
      releases: <ArtistReleases artistId={userdata?.artist} />,
      collectible: <ArtistCollectible />,
      about: <ArtistAbout />,
    };
    return components[activeTab];
  }, [activeTab, userdata?.artist]);

  const formatNumber = (num: number = 0) => num.toLocaleString();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View
        style={[
          styles.header,
          {
            height: layoutAnimations.headerHeight,
            transform: [{ scale: animations.headerScale }],
          },
        ]}
      >
        {isLoading ? (
          <ProfilePlaceholder />
        ) : (
          <ImageBackground
            source={{ uri: artistProfile?.profileImage }}
            style={styles.headerBackground}
            imageStyle={styles.headerBackgroundImage}
            resizeMode="cover"
          >
            <Animated.View
              style={[
                styles.headerOverlay,
                { opacity: animations.overlayOpacity },
              ]}
            />
            <Animated.View
              style={[
                styles.headerContent,
                { opacity: animations.headerContentOpacity },
              ]}
            >
              <View style={styles.artistInfo}>
                <View style={styles.artistNameContainer}>
                  <Text style={styles.artistName} numberOfLines={1}>
                    {artistProfile?.name}
                  </Text>
                  {artistProfile?.verified && (
                    <CheckmarkBadge01Icon
                      size={wp("5%")}
                      color="#2DD881"
                      variant="solid"
                    />
                  )}
                </View>
                <View style={styles.statsContainer}>
                  <Text style={styles.statsText}>
                    {formatNumber(artistProfile?.followers.length)} Followers
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
            </Animated.View>
          </ImageBackground>
        )}
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate("/(musicTabs)")}
          >
            <HeadphonesIcon size={wp("6%")} color="#FF8A49" variant="solid" />
            <Text style={styles.actionText}>Back to Listen Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate("/wallet")}
          >
            <Wallet01Icon size={wp("5%")} color="#A187B5" variant="stroke" />
            <Text style={styles.actionText}>Wallet & Earnings</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: "#0A0A0A",
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerBackground: {
    height: "100%",
    width: "100%",
  },
  headerBackgroundImage: {
    opacity: 0.9,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: hp("15%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
  },
  artistInfo: {
    flex: 1,
    marginRight: wp("2%"),
  },
  artistNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
    marginBottom: hp("1%"),
  },
  artistName: {
    fontSize: wp("6%"),
    fontFamily: "PlusJakartaSansBold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("1.5%"),
  },
  statsText: {
    fontSize: wp("3.5%"),
    fontFamily: "PlusJakartaSansMedium",
    color: "#FFFFFF",
    opacity: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  changeCoverButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("3.5%"),
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  changeCoverText: {
    fontSize: wp("3.5%"),
    fontFamily: "PlusJakartaSansMedium",
    color: "white",
  },
  scrollView: {
    flex: 1,
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
    paddingVertical: hp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    color: "#f4f4f4",
    fontSize: wp("3.5%"),
    fontFamily: "PlusJakartaSansMedium",
    marginTop: hp("1%"),
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
    marginTop: hp("2%"),
    paddingHorizontal: wp("1%"),
  },
  tab: {
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("6%"),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF8A49",
  },
  tabText: {
    fontSize: wp("4%"),
    fontFamily: "PlusJakartaSansMedium",
    color: "#A5A6AA",
  },
  activeTabText: {
    color: "white",
  },
  tabContent: {
    flex: 1,
    paddingTop: hp("2%"),
  },
  placeholderContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  placeholderImage: {
    height: hp("30%"),
    backgroundColor: "#2D2D2D",
  },
  placeholderTextContainer: {
    paddingHorizontal: wp("5%"),
    marginTop: hp("2%"),
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
