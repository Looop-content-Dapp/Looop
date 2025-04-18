import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft02Icon } from '@hugeicons/react-native';
import ArtistInfo from '@/components/ArtistInfo';
import JoinCommunity from '@/components/cards/JoinCommunity';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ArtistReleases from '@/components/ArtistProfile/ArtistReleases';
import { useAppSelector } from '@/redux/hooks';
import { useArtistCommunity } from '@/hooks/useArtistCommunity';
import FastImage from 'react-native-fast-image';
import { useFetchArtist } from '@/hooks/useFetchArtist'; // Import the hook

// Add this component for animated FastImage background
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const ArtistDetails = () => {
  const { id } = useLocalSearchParams(); // Use only id
  const { data: artistData, isLoading: isArtistLoading } = useFetchArtist(id as string); // Fetch artist data
  const { userdata } = useAppSelector((state) => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isMember, setIsMember] = useState(false);
  const { data: communityData, isLoading: isCommunityLoading } = useArtistCommunity(id as string);
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
    if (artistData?.joinSuccess === 'true') {
      setIsMember(true);
    }
  }, [artistData]);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, SCREEN_HEIGHT * 0.3],
    outputRange: [0, -SCREEN_HEIGHT * 0.4],
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
            }
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
          </View>
        </Animated.ScrollView>
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
    height: '50%',
  },
  contentContainer: {
    paddingTop: '38%',
    marginTop: '50%',
    zIndex: 2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  scrollViewContent: {
    paddingBottom: '14%',
  },
});

export default React.memo(ArtistDetails);
