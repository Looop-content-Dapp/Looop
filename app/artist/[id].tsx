import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import ArtistInfo from "../../components/ArtistInfo";
import JoinCommunity from "../../components/cards/JoinCommunity";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PaymentBottomSheet from "../../components/Subscribe/PaymentBottomsheet";
import ArtistReleases from "../../components/ArtistProfile/ArtistReleases";
import { useAppSelector } from "@/redux/hooks";
import { Skeleton } from "moti/skeleton";
import { prefetchArtistData } from '@/utils/prefetch';

const ArtistDetails = () => {
  const {
    id,
  } = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [communityData, setCommunityData] = useState<any | null>(null);
  const [artistData, setArtistData] = useState<any | null>(null)
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  console.log(artistData?._id)

  const toggleDescription = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          throw new Error('Artist ID is missing');
        }

        // Try to get prefetched data first
        const prefetchedData = await prefetchArtistData(id as string);
        
        setArtistData(prefetchedData.artist);
        setCommunityData(prefetchedData.community);

      } catch (error: any) {
        console.error('Error fetching artist data:', error);
        setError(error.message || 'Failed to load artist details');
        setArtistData(null);
        setCommunityData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton
          show={true}
          width="100%"
          height={SCREEN_HEIGHT * 0.4}
          colorMode="dark"
        >
          <View style={styles.header} />
        </Skeleton>
        <View style={styles.contentContainer}>
          <Skeleton
            show={true}
            width={200}
            height={20}
            radius={4}
            colorMode="dark"
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const handleJoinPress = () => {
    // setShowPaymentSheet(true);
    router.push({
      pathname: "/payment",
      params: {
        name: communityData?.tribePass?.collectibleName,
        image: communityData?.tribePass?.collectibleImage,
        communityAddress: communityData?.tribePass?.contractAddress,
        communityId: communityData?._id,
        communityDescription: communityData?.description
      },
    });
  };


  const handleClosePaymentSheet = () => {
    setShowPaymentSheet(false);
  };

  const handleJoinCommunity = async () => {
    if (communityData) {
      try {
        if (userdata?._id) {
          handleClosePaymentSheet();
        }
      } catch (error) {
        console.error("Error joining community:", error);
      }
    }
  };

  // Animated header calculations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT * 0.08],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 300],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Animated header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
              height: SCREEN_HEIGHT * 0.08,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft02Icon size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Parallax Image Background */}
        <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
          <ImageBackground
            source={{ uri: artistData?.profileImage as string }}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft02Icon size={24} color="#fff" />
            </TouchableOpacity>
          </ImageBackground>
        </Animated.View>

        {/* Scrollable content */}
        <Animated.ScrollView
          contentContainerStyle={styles.scrollViewContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.contentContainer}>
            <ArtistInfo
              image={artistData?.profileImage as string}
              name={artistData?.name as string}
              follow={artistData?.followers.length as string}
              desc={artistData?.biography as string}
              follower={artistData?.monthlyListeners as string}
              isVerfied={artistData?.verified as string}
              index={artistData?._id as string}
              isFollowing={artistData?.followers.includes(userdata?._id) as boolean}
            />

         {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.aboutText}>About {artistData?.name}</Text>
            <Text
              numberOfLines={isExpanded ? undefined : 1}
              style={styles.descriptionText}
            >
              {artistData?.biography}
            </Text>
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={styles.toggleDescriptionText}>
                {isExpanded ? "See less" : "See more"}
              </Text>
            </TouchableOpacity>
          </View>

            <JoinCommunity
              isLoading={isLoading}
              communityData={communityData}
              onJoinPress={handleJoinPress}
              isMember={artistData?.communityMembers.includes(userdata?._id)}
              isOwner={communityData?.createdBy === userdata?._id} 
              artistID={artistData?._id as string}
            />

            <ArtistReleases artistId={artistData?._id as string} />
          </View>
        </Animated.ScrollView>

        <PaymentBottomSheet
          isVisible={showPaymentSheet}
          closeSheet={handleClosePaymentSheet}
          communityData={communityData}
          onPaymentComplete={handleJoinCommunity}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    flexDirection: "row",
    zIndex: 10,
  },
  backButton: {
    marginTop: Platform.OS === "ios" ? "15%" : "10%",
    marginLeft: "5%",
  },
  imageBackground: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: "14%",
  },
  contentContainer: {
    paddingTop: 16,
  },
  // Payment Bottom Sheet Styles
  paymentContainer: {
    padding: 16,
    alignItems: "center",
  },
  paymentCurrency: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 16,
    fontFamily: "PlusJakartaSansRegular",
  },
  usdText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontFamily: "PlusJakartaSansBold",
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
    fontFamily: "PlusJakartaSansBold",
  },
  minimumText: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 24,
    fontFamily: "PlusJakartaSansRegular",
  },
  recipientContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  toText: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "PlusJakartaSansRegular",
  },
  recipientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recipientImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  recipientName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSansBold",
  },
  forText: {
    color: "#8E8E93",
    fontSize: 14,
    fontFamily: "PlusJakartaSansRegular",
  },
  applePayButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 56,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  applePayImage: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  creditCardButton: {
    backgroundColor: "transparent",
    borderRadius: 56,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  creditCardText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "PlusJakartaSansSemiBold",
  },
  // Skeleton styles
  skeletonContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 24,
    padding: "4%",
    justifyContent: "center",
  },
  skeletonTitle: {
    height: 12,
    backgroundColor: "#3a3a3a",
    marginBottom: "2%",
    borderRadius: 6,
  },
  skeletonDescription: {
    height: 10,
    backgroundColor: "#3a3a3a",
    marginBottom: "4%",
    borderRadius: 5,
  },
  skeletonButton: {
    height: 30,
    backgroundColor: "#3a3a3a",
    borderRadius: 15,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: "#12141B",
    borderRadius: 15,
    width: wp("90%"),
    marginHorizontal: "auto",
    marginVertical: 16
  },
  aboutText: {
    color: "#b0b0b0",
    marginBottom: 8,
  },
  descriptionText: {
    color: "#787A80",
  },
  toggleDescriptionText: {
    color: "#fff",
    marginTop: 8,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSansMedium',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    fontFamily: 'PlusJakartaSansMedium',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default React.memo(ArtistDetails);
