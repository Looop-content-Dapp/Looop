import React, { useEffect, useState, useRef, useCallback } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft02Icon } from '@hugeicons/react-native';
import ArtistInfo from '../../components/ArtistInfo';
import JoinCommunity from '../../components/cards/JoinCommunity';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PaymentBottomSheet from '../../components/Subscribe/PaymentBottomsheet';
import ArtistReleases from '../../components/ArtistProfile/ArtistReleases';
import api from '@/config/apiConfig';
import { useAppSelector } from '@/redux/hooks';

interface CommunityData {
  _id: string;
  communityName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  price?: number;
  image?: string;
}

const ArtistDetails = () => {
  const {
    index,
    image,
    name,
    bio,
    isVerified,
    id,
    isFollowing,
    noOfFollowers,
    followers,
    joinSuccess
  } = useLocalSearchParams();
  console.log("index", followers)
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [communityData, setCommunityData] = useState<any | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth)
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  console.log("id", isFollowing)


  const toggleDescription = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchArtistCommunity = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/api/community/${id as string}`)
        setCommunityData(response?.data?.data);
      } catch (error) {
        console.error('Error fetching artist community:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistCommunity();
  }, []);

  const handleJoinPress = () => {
    router.push({
      pathname: "/payment",
      params: {
        name: communityData.tribePass.collectibleName,
        image: communityData.tribePass.collectibleImage,
        communityId: communityData._id,
        collectionAddress: communityData.tribePass.contractAddress,
        type: "xion",
        userAddress: userdata?.wallets?.xion?.address,
        currentRoute: `/artist/${id}`,
      },
    });
  };

  // Add this effect to handle the return navigation
  useEffect(() => {
    if (joinSuccess === 'true') {
      setIsMember(true);
    }
  }, [useLocalSearchParams()]);

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
        console.error('Error joining community:', error);
      }
    }
  };

  // Updated animation calculations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.3],
    outputRange: [SCREEN_HEIGHT * 0.4, 0],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT * 0.3],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.3],
    outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'],
    extrapolate: 'clamp',
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Updated Animated header */}
        <Animated.View
          style={[
            styles.header,
            {
              backgroundColor: headerBackgroundOpacity,
              height: SCREEN_HEIGHT * 0.1,
            },
          ]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButtonContainer}
            >
              <ArrowLeft02Icon size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Updated Parallax Image Background */}
        <Animated.View
          style={[
            styles.imageContainer,
            {
              height: headerHeight,
              opacity: imageOpacity,
            }
          ]}
        >
          <ImageBackground
            source={{ uri: image as string }}
            style={styles.imageBackground}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Scrollable content */}
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
              image={image as string}
              name={name as string}
              follow={noOfFollowers as string}
              desc={bio as string}
              follower={"12459"}
              isVerfied={isVerified as string}
              index={id as string}
              isFollow={followers?.includes(userdata?._id)} // Direct boolean check
            />

            <JoinCommunity
              isLoading={isLoading}
              communityData={communityData}
              onJoinPress={handleJoinPress}
              isMember={isMember}
            />

            <ArtistReleases artistId={id as string} />
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
    backgroundColor: "black"
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '5%',
    marginTop: Platform.OS === 'ios' ? '15%' : '10%',
  },
  backButtonContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  imageBackground: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: '14%',
  },
  contentContainer: {
    paddingTop: '38%',
    marginTop: '50%',
  },
  paymentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  skeletonContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    padding: '4%',
    justifyContent: 'center',
  },
  skeletonTitle: {
    height: 12,
    backgroundColor: '#3a3a3a',
    marginBottom: '2%',
    borderRadius: 6,
  },
  skeletonDescription: {
    height: 10,
    backgroundColor: '#3a3a3a',
    marginBottom: '4%',
    borderRadius: 5,
  },
  skeletonButton: {
    height: 30,
    backgroundColor: '#3a3a3a',
    borderRadius: 15,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#12141B',
    borderRadius: 15,
    width: wp('90%'),
    marginHorizontal: "auto"
  },
  aboutText: {
    color: '#b0b0b0',
    marginBottom: 8,
  },
  descriptionText: {
    color: '#787A80',
  },
  toggleDescriptionText: {
    color: '#fff',
    marginTop: 8,
  },
});

export default React.memo(ArtistDetails);
