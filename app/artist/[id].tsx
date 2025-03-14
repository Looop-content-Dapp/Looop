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
    noOfFollowers
  } = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [communityData, setCommunityData] = useState<any | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth)
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

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
    // setShowPaymentSheet(true);
     router.push({
      pathname: "/payment",
      params: {
        name: communityData.tribePass.collectibleName,
        image: communityData.tribePass.collectibleImage
      }
     })
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
        console.error('Error joining community:', error);
      }
    }
  };

  // Animated header calculations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [SCREEN_HEIGHT * 0.35, SCREEN_HEIGHT * 0.16],
    extrapolate: 'extend',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [150, 300],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: 'clamp',
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft02Icon size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        {/* Parallax Image Background */}
        <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
          <ImageBackground
            source={{ uri: image as string }}
            style={styles.imageBackground}
            resizeMode="cover"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }
              ]}
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
              isFollowing={isFollowing as boolean}
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
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    flexDirection: 'row',
    zIndex: 10,
  },
  backButton: {
    marginTop: Platform.OS === 'ios' ? '15%' : '10%',
    marginLeft: '5%',
  },
  imageBackground: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: '14%',
  },
  contentContainer: {
    paddingTop: '8%',
    marginTop: '-10%',
  },
  // Payment Bottom Sheet Styles
  paymentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  // Skeleton styles
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
