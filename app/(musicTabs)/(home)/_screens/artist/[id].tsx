import ArtistInfo from "@/components/ArtistInfo";
import ArtistReleases from "@/components/ArtistProfile/ArtistReleases";
import JoinCommunity from "@/components/cards/JoinCommunity";
import { useArtistCommunity } from "@/hooks/artist/useArtistCommunity";
import { useFetchArtist } from "@/hooks/artist/useFetchArtist"; // Import the hook
import { useAppSelector } from "@/redux/hooks";
import { ArrowLeft02Icon, CheckmarkBadge01Icon } from "@hugeicons/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Add this component for animated FastImage background
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

// Add these imports at the top
import { LinearGradient } from "expo-linear-gradient";
import { getColors } from "react-native-image-colors";

const ArtistDetails = () => {
  const { id } = useLocalSearchParams(); // Use only id
  const [showFullDesc, setShowFullDesc] = useState(false);
  const { data: artistData, isLoading: isArtistLoading } = useFetchArtist(
    id as string
  ); // Fetch artist data
  const { userdata } = useAppSelector((state) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isMember, setIsMember] = useState(false);
  const { data: communityDataRaw, isLoading: isCommunityLoading } =
    useArtistCommunity(id as string);
  const communityData = communityDataRaw
    ? {
        ...communityDataRaw,
        coverImage: communityDataRaw.image || "",
        members: (communityDataRaw as any).members || [],
      }
    : null;
  const router = useRouter();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const handleJoinPress = () => {
    router.push({
      pathname: "/payment",
      params: {
        name: communityData?.tribePass?.collectibleName,
        image: communityData?.tribePass?.collectibleImage,
        communityId: communityData?._id,
        collectionAddress: communityData?.tribePass?.contractAddress,
        type: "xion",
        userAddress: userdata?.wallets?.xion?.address,
        currentRoute: `/(musicTabs)/(home)/_screens/artist/${id}`,
      },
    });
  };

  useEffect(() => {
    if (artistData?.joinSuccess === "true") {
      setIsMember(true);
    }
  }, [artistData]);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.3],
    outputRange: [0, -SCREEN_HEIGHT * 0.4],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.3],
    outputRange: ["rgba(0,0,0,0)", "rgba(0,0,0,1)"],
    extrapolate: "clamp",
  });

  // Add these states
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#FFFFFF");

  // Add this function after other functions
  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  // Add this effect to extract colors
  useEffect(() => {
    const fetchColors = async () => {
      if (artistData?.profileImage) {
        try {
          const result = await getColors(artistData.profileImage, {
            fallback: "#000000",
            cache: true,
          });
          let bgColor = "#000000";
          if (result.platform === "android") {
            bgColor = result.dominant;
          } else if (result.platform === "ios") {
            bgColor = result.background;
          }
          setBackgroundColor(bgColor);
          setTextColor(getContrastColor(bgColor));
        } catch (error) {
          setBackgroundColor("#000000");
          setTextColor("#FFFFFF");
        }
      }
    };
    fetchColors();
  }, [artistData?.profileImage]);

  // Add this animation value
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT * 0.3],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  // Add this animation value for the scroll header
  const scrollHeaderOpacity = scrollY.interpolate({
    inputRange: [SCREEN_HEIGHT * 0.08, SCREEN_HEIGHT * 0.15],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Scroll header */}
        <Animated.View
          style={[styles.scrollHeader, { opacity: scrollHeaderOpacity }]}
          pointerEvents={scrollHeaderOpacity ? "auto" : "none"}
        >
          <TouchableOpacity
            onPress={() => router.push("/(musicTabs)")}
            style={styles.scrollHeaderBack}
          >
            <ArrowLeft02Icon size={24} color="#fff" variant="solid" />
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            className="text-[28px] font-TankerRegular text-[#f4f4f4]"
          >
            {artistData?.name}
          </Text>
        </Animated.View>
        {isArtistLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        ) : (
          <>
            <Animated.View
              style={[
                styles.header,
                {
                  backgroundColor: headerBackgroundOpacity,
                  transform: [{ translateY: headerTranslateY }],
                },
              ]}
            >
              <View style={styles.headerContent}>
                <TouchableOpacity
                  onPress={() => router.push("/(musicTabs)")}
                  style={styles.backButtonContainer}
                >
                  <ArrowLeft02Icon size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.imageContainer,
                {
                  opacity: imageOpacity,
                  transform: [{ translateY: headerTranslateY }],
                  height: SCREEN_HEIGHT * 0.4,
                },
              ]}
            >
              <AnimatedFastImage
                source={{
                  uri: artistData?.profileImage,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
              {/* Gradient overlay at the bottom */}
              <LinearGradient
                colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)", "rgba(0,0,0,1)"]}
                style={styles.bottomGradient}
                pointerEvents="none"
              />
              {/* Artist name and verified badge on top of gradient */}
              <View style={styles.bottomTextContainer} pointerEvents="box-none">
                {artistData?.verified && (
                  <View style={styles.verifiedContainer}>
                    <CheckmarkBadge01Icon
                      size={16}
                      variant="solid"
                      color="#2DD881"
                    />
                    <Text style={styles.verifiedText}>Verified Artist</Text>
                  </View>
                )}
                <Text numberOfLines={1} style={styles.artistNameOnImage}>
                  {artistData?.name}
                </Text>
              </View>
            </Animated.View>

            <Animated.ScrollView
              contentContainerStyle={styles.scrollViewContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              bounces={false}
            >
              <View style={styles.contentContainer}>
                <ArtistInfo
                  image={artistData?.profileImage}
                  name={artistData?.name}
                  follow={artistData?.noOfFollowers.toString()}
                  desc={artistData?.biography}
                  follower={artistData?.communityMembers.length.toString()}
                  isVerfied={artistData?.verified.toString()}
                  index={id as string}
                  isFollow={artistData?.followers.includes(userdata?._id)}
                />

                <JoinCommunity
                  isLoading={isCommunityLoading}
                  communityData={communityData}
                  onJoinPress={handleJoinPress}
                  userId={userdata?._id}
                />

                <ArtistReleases artistId={id as string} />

                {artistData?.biography && (
                  <View className="bg-[#12141B] p-[16px] gap-y-[8px] rounded-[15px] mx-[16px] mt-6">
                    <Text
                      numberOfLines={1}
                      className="text-[14px] font-PlusJakartaSansBold text-[#9A9B9F]"
                    >
                      About {artistData.name}
                    </Text>
                    <Text
                      numberOfLines={showFullDesc ? undefined : 1}
                      className="text-[14px] font-PlusJakartaSansRegular text-[#9A9B9F]"
                    >
                      {artistData.biography}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowFullDesc(!showFullDesc)}
                    >
                      <Text className="text-[14px] text-[#D2D3D5] font-PlusJakartaSansBold">
                        {showFullDesc ? "See less" : "See more"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.ScrollView>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "5%",
    marginTop: Platform.OS === "ios" ? "15%" : "10%",
  },
  backButtonContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: "50%",
    justifyContent: "flex-end",
    paddingBottom: 0, // Remove padding, handled by bottomTextContainer
  },
  artistNameContainer: {
    paddingHorizontal: 15,
  },
  artistName: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    fontFamily: "PlusJakartaSans-Bold",
  },
  contentContainer: {
    paddingTop: "38%",
    marginTop: "50%",
    zIndex: 2,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  scrollViewContent: {
    paddingBottom: "14%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120, // Adjust as needed for coverage
    zIndex: 2,
  },
  bottomTextContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20, // Padding from bottom
    zIndex: 3,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  verifiedText: {
    color: "#2DD881",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    fontWeight: "bold",
    marginLeft: 4,
  },
  artistNameOnImage: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "TankerRegular",
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
    letterSpacing: -0.56,
  },
  scrollHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#040405",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 36 : 32,
    paddingHorizontal: 16,
    zIndex: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollHeaderBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollHeaderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    fontFamily: "PlusJakartaSans-Bold",
  },
});

export default React.memo(ArtistDetails);
