import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { ArrowRight01Icon } from '@hugeicons/react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

interface CommunityData {
  _id: string;
  communityName: string;
  description: string;
  createdBy: string;
  createdAt: string;
  price?: number;
  coverImage?: string;
}

interface JoinCommunityProps {
  isLoading: boolean;
  communityData: CommunityData | null;
  onJoinPress: () => void;
  isMember?: boolean;
}

const SkeletonLoader = () => {
  const { width, height } = useWindowDimensions();

  return (
    <MotiView
      from={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, duration: 1000 }}
      style={[styles.skeletonContainer, { height: height * 0.2 }]}
    >
      <View style={[styles.skeletonTitle, { width: width * 0.6 }]} />
      <View style={[styles.skeletonDescription, { width: width * 0.8 }]} />
      <View style={[styles.skeletonButton, { width: width * 0.4 }]} />
    </MotiView>
  );
};

const JoinCommunity = ({ isLoading, communityData, onJoinPress, isMember = false }: JoinCommunityProps) => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const router = useRouter();

  const handleCommunityPress = () => {
    if (isMember && communityData) {
      router.push({
        pathname: '/communityDetails',
        params: {
          id: communityData._id,
          name: communityData.communityName,
          description: communityData.description,
          image: communityData.coverImage
        }
      });
    } else {
      onJoinPress();
    }
  };

  return (
    <View style={[styles.communitySection, { height: SCREEN_HEIGHT * 0.25 }]}>
      <Text style={styles.communityTitle}>Community</Text>
      {isLoading ? (
        <SkeletonLoader />
      ) : communityData ? (
        <TouchableOpacity
          style={styles.communityContainer}
          onPress={handleCommunityPress}
          activeOpacity={0.7}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: communityData.coverImage || "https://i.pinimg.com/736x/08/36/11/083611341ce01bf33a233cfa6d04331c.jpg"
              }}
              style={styles.communityImage}
            />
            <View style={styles.gradientOverlay} />
          </View>
          <View style={styles.communityContent}>
            <View style={styles.textContainer}>
              <Text style={styles.communityName} numberOfLines={1} className='captilize'>
                {communityData.communityName}
              </Text>
              <Text style={styles.communityDescription} numberOfLines={2}>
                {communityData.description}
              </Text>
            </View>
            <View style={[
              styles.actionButton,
              isMember ? styles.memberButton : styles.joinButton
            ]}>
              <Text style={[
                styles.actionButtonText,
                isMember ? styles.memberButtonText : styles.joinButtonText
              ]}>
                {isMember ? 'View Community' : 'Join Community'}
              </Text>
              <ArrowRight01Icon
                size={16}
                color={isMember ? '#FFFFFF' : '#FF6D1B'}
                variant="solid"
              />
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.noCommunityContainer}>
          <Text style={styles.noCommunityText}>No Community Available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  communitySection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansBold',
    marginBottom: 8,
  },
  communityContainer: {
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  imageContainer: {
    width: '45%',
    height: '100%',
    position: 'relative',
  },
  communityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  communityContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansBold',
    marginBottom: 8,
  },
  communityDescription: {
    fontSize: 14,
    color: '#D2D3D5',
    fontFamily: 'PlusJakartaSansRegular',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
  },
  joinButton: {
    borderWidth: 1.5,
    borderColor: '#FF6D1B',
    backgroundColor: 'transparent',
  },
  memberButton: {
    backgroundColor: '#FF6D1B',
    borderWidth: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'PlusJakartaSansSemiBold',
  },
  joinButtonText: {
    color: '#FF6D1B',
  },
  memberButtonText: {
    color: '#FFFFFF',
  },
  noCommunityContainer: {
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCommunityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D2D3D5',
    fontFamily: 'PlusJakartaSansSemiBold',
  },
  // Skeleton styles
  skeletonContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
    padding: 16,
    justifyContent: 'center',
  },
  skeletonTitle: {
    height: 12,
    backgroundColor: '#3a3a3a',
    marginBottom: 8,
    borderRadius: 6,
  },
  skeletonDescription: {
    height: 10,
    backgroundColor: '#3a3a3a',
    marginBottom: 16,
    borderRadius: 5,
  },
  skeletonButton: {
    height: 30,
    backgroundColor: '#3a3a3a',
    borderRadius: 15,
  },
});

export default JoinCommunity;
