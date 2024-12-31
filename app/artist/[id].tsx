import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft02Icon } from '@hugeicons/react-native';
import { Artist } from '../../utils/types';
import ArtistInfo from '../../components/ArtistInfo';
import { useQuery } from '../../hooks/useQuery';
import JoinCommunity from '../../components/cards/JoinCommunity';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PaymentBottomSheet from '../../components/Subscribe/PaymentBottomsheet';
import ArtistReleases from '../../components/ArtistProfile/ArtistReleases';
import ParallaxScrollView from '../../components/app-components/ParallaxScrollView';

interface CommunityData {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  price?: number;
  image?: string;
}

const ArtistDetails = () => {
  const { index, image, name, bio, isVerified } = useLocalSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [communityData, setCommunityData] = useState<CommunityData | null>(null);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();
  const { getAllCommunities, retrieveUserId } = useQuery();

  const toggleDescription = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [communitiesResponse] = await Promise.all([getAllCommunities()]);

        if (communitiesResponse.data && communitiesResponse.data.length > 0) {
          const artistCommunity = communitiesResponse.data.find(
            (community: CommunityData) => community.createdBy === index
          );
          if (artistCommunity) {
            setCommunityData(artistCommunity);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [index]);

  const handleJoinPress = () => {
    setShowPaymentSheet(true);
  };

  const handleClosePaymentSheet = () => {
    setShowPaymentSheet(false);
  };

  const handleJoinCommunity = async () => {
    if (communityData) {
      try {
        const userId = await retrieveUserId();
        if (userId) {
          setIsMember(true);
          handleClosePaymentSheet();
        }
      } catch (error) {
        console.error('Error joining community:', error);
      }
    }
  };

  const HeaderImage = () => (
    <View style={styles.headerImageContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft02Icon size={24} color="#fff" />
      </TouchableOpacity>
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image as string }} style={styles.headerImage} />
        </View>
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ParallaxScrollView
        headerImage={<HeaderImage />}
        headerBackgroundColor={{ dark: '#000', light: '#fff' }}
      >
        <View style={styles.contentContainer}>
          <ArtistInfo
            image={image as string}
            name={name as string}
            follow={89000000}
            desc={bio as string}
            follower={124590662}
            isVerfied={isVerified as string}
            index={index as string}
          />

          <JoinCommunity
            isLoading={isLoading}
            communityData={communityData}
            onJoinPress={handleJoinPress}
            isMember={isMember}
          />

          <ArtistReleases artistId={index as string} />

          <View style={styles.descriptionContainer}>
            <Text style={styles.aboutText}>About {name}</Text>
            <Text numberOfLines={isExpanded ? undefined : 1} style={styles.descriptionText}>
              {bio}
            </Text>
            <TouchableOpacity onPress={toggleDescription}>
              <Text style={styles.toggleDescriptionText}>
                {isExpanded ? 'See less' : 'See more'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ParallaxScrollView>

      <PaymentBottomSheet
        isVisible={showPaymentSheet}
        closeSheet={handleClosePaymentSheet}
        communityData={communityData}
        onPaymentComplete={handleJoinCommunity}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerImageContainer: {
    width: '100%',
    height: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  backButton: {
    marginTop: Platform.OS === 'ios' ? '15%' : '10%',
    marginLeft: '5%',
    zIndex: 10,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#12141B',
    borderRadius: 15,
    width: wp('90%'),
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
