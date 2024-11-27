import { View, Text, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { formatNumber } from '../utils/ArstsisArr';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useQuery } from '../hooks/useQuery';
import axios from 'axios';

type Props = {
  image: any;
  name: string;
  follow: number;
  desc: string;
  follower: number;
  isVerfied: string;
  index: string; // Assuming index is a string representing artist ID
};

const ArtistInfo = ({ follow, name, desc, follower, isVerfied, index }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [followed, setFollowed] = useState(false);
   console.log("verfied", isVerfied)
  const {
    followArtist,
    retrieveUserId,
    isFollowingArtist, // Make sure this is part of your useQuery hook
  } = useQuery();

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const userId = await retrieveUserId();
        console.log('Retrieved userID at profile:', userId);

        if (userId) {
          const isFollowing = await isFollowingArtist(userId, index);
          console.log(`isFollowingArtist returned: ${isFollowing}`);

          setFollowed(isFollowing);
          console.log(`User is ${isFollowing ? '' : 'not '}following artist with ID: ${index}`);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error while checking follow status:', error.response?.data);
        } else {
          console.error('Unexpected error while checking follow status:', error);
        }
      }
    };

    checkFollowStatus();
  }, [index]);

  // Function to handle following an artist
  const handleFollowArtist = async () => {
    try {
      const userId = await retrieveUserId();
      if (!userId) {
        console.error('User ID is not available.');
        return;
      }

      await followArtist(userId, index);
      console.log(`Successfully followed artist with ID: ${index}`);
      setFollowed(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Axios error while following artist with ID ${index}:`, error.response?.data);
      } else {
        console.error(`Unexpected error following artist with ID ${index}:`, error);
      }
    }
  };

  const toggleDescription = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.artistInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.artistName}>{name}</Text>
            {isVerfied && (
              <Pressable style={styles.verifiedIcon}>
                <CheckmarkBadge01Icon size={20} variant="solid" color="#2DD881" />
              </Pressable>
            )}
            <Text style={styles.rankText}>#4 in Nigeria</Text>
          </View>
          <View style={styles.followersContainer}>
            <Text style={styles.followersText}>{formatNumber(follow)} Followers</Text>
            <Text style={styles.followersText}>{formatNumber(follower)} Followers</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={handleFollowArtist}
          style={[
            styles.followButton,
            followed ? styles.following : styles.notFollowing,
          ]}
        >
          <Text style={styles.followButtonText}>{followed ? 'Following' : 'Follow'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArtistInfo;

const styles = StyleSheet.create({
  container: {
    maxHeight: 256,
    margin: 16,
    gap: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  artistInfo: {
    gap: 4,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  artistName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  verifiedIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    color: '#787A80',
    fontSize: 14,
  },
  followersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  followersText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#787A80',
  },
  followButton: {
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 48,
    alignItems: 'center',
  },
  following: {
    borderColor: '#12141B',
    backgroundColor: '#12141B',
  },
  notFollowing: {
    borderColor: '#787A80',
    backgroundColor: 'transparent',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'normal',
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
