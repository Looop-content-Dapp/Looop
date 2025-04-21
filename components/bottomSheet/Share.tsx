import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Animated,
  Dimensions,
  Platform,
  Share as RNShare,
  Linking
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Contacts from 'expo-contacts';
import { Avatar } from 'react-native-elements';
import { AlertDiamondIcon, CdIcon, FavouriteIcon, Playlist01Icon, Queue01Icon } from '@hugeicons/react-native';
import { Feather } from '@expo/vector-icons';
import AddToPlaylistBottomSheet from './AddToPlaylistBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import { Track } from '@/utils/types';
import TrackPlayer from 'react-native-track-player';

interface ShareProps {
  isVisible: boolean;
  onClose: () => void;
  album: {
    title?: string;
    artist?: string;
    image?: string;
    duration?: number;
    type?: string;
    id?: string;
    tracks?: Track[];  // Update type to Track[]
  };
}

const Share: React.FC<ShareProps> = ({ isVisible, onClose, album }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isPlaylistSheetVisible, setIsPlaylistSheetVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const [animationReady, setAnimationReady] = useState(false);

  const shareContent = {
    title: album?.title || 'Check out this track',
    message: `Check out "${album?.title}" by ${album?.artist} on Looop Music!`,
    url: `https://looop.com/track/${album?.id}`, // Replace with your actual sharing URL
  };

  const handleCopyLink = () => {
    Clipboard.setString(shareContent.url);
    Alert.alert('Success', 'Link copied to clipboard');
  };

  const handleAddToPlaylist = () => {
    setIsPlaylistSheetVisible(true);
    onClose();
  };


  const handleShareToWhatsApp = async () => {
    try {
      const message = encodeURIComponent(`${shareContent.message}\n${shareContent.url}`);
      const whatsappUrl = `whatsapp://send?text=${message}`;
      const supported = await Linking.canOpenURL(whatsappUrl);

      if (supported) {
        await Linking.openURL(whatsappUrl);
      } else {
        await RNShare.share({
          message: `${shareContent.message}\n${shareContent.url}`,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open WhatsApp. Make sure it is installed.');
    }
  };

  const handleShareToSnapchat = async () => {
    try {
      await RNShare.share({
        message: `${shareContent.message}\n${shareContent.url}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share to Snapchat.');
    }
  };

  const handleShareToInstagram = async () => {
    try {
      await RNShare.share({
        message: `${shareContent.message}\n${shareContent.url}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share to Instagram.');
    }
  };

  const handleShareToTwitter = async () => {
    try {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.message)}&url=${encodeURIComponent(shareContent.url)}`;
      const supported = await Linking.canOpenURL(twitterUrl);

      if (supported) {
        await Linking.openURL(twitterUrl);
      } else {
        await RNShare.share({
          message: `${shareContent.message}\n${shareContent.url}`,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share to Twitter.');
    }
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationReady(false);
      onClose();
    });
  };

  useEffect(() => {
    if (isVisible) {
      setAnimationReady(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        mass: 0.8,
      }).start();
    }
  }, [isVisible]);

  // Add staggered animation for content
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (animationReady) {
      Animated.sequence([
        Animated.delay(150), // Wait for bottom sheet to slide up
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            damping: 15,
            mass: 0.8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [animationReady]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
      }
    };

    getUserId();
  }, []);

  const requestPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      setHasPermission(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Image, Contacts.Fields.Name],
      });
      setContacts(data.slice(0, 5));
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const [isInQueue, setIsInQueue] = useState(false);

  // Add this useEffect to check if track is in queue when component mounts
  useEffect(() => {
    checkIfInQueue();
  }, [album?.id]);

  const checkIfInQueue = async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const isAlreadyInQueue = queue.some(track => track.id === album?.id);
      setIsInQueue(isAlreadyInQueue);
    } catch (error) {
      console.error('Error checking queue:', error);
    }
  };

  const handleAddToQueue = async () => {
    if (!album) return;

    try {
      if (album.tracks && album.tracks.length > 0) {
        console.log('Album has tracks:', album.tracks);
        // If it's an album with multiple tracks
        const tracksToAdd = album.tracks.map(track => ({
          id: track._id,
          url: track.songData.fileUrl,
          title: track.title,
          artist: track.artist,
          artwork: track.release.artwork.high || album.image,
          duration: track.duration,
        }));
        await TrackPlayer.add(tracksToAdd);
      } else {
        // If it's a single track
        const trackToAdd = {
          id: album.id,
          url: album.url,
          title: album.title,
          artist: album.artist,
          artwork: album.image,
          duration: album.duration,
        };
        await TrackPlayer.add(trackToAdd);
      }

      setIsInQueue(true);
      Alert.alert('Success', 'Added to queue');
      onClose();
    } catch (error) {
      console.error('Error adding to queue:', error);
      Alert.alert('Error', 'Failed to add to queue. Please try again.');
    }
  };

  const handleAddToFavorites = async () => {
    if (!userId || !album?.id) {
      Alert.alert('Error', 'Unable to add to favorites. Please try again later.');
      return;
    }

    try {

    } catch (error) {
      console.error('Error adding to favorites:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const handleSeeCredits = () => {
    Alert.alert('Credits', `Song: ${album?.title}\nArtist: ${album?.artist}`);
    onClose();
  };

  const handleReportAlbum = () => {
    Alert.alert(
      'Report Album',
      'Why are you reporting this album?',
      [
        {
          text: 'Inappropriate Content',
          onPress: () => {
            Alert.alert('Report Submitted', 'Thank you for your feedback');
            onClose();
          },
        },
        {
          text: 'Copyright Violation',
          onPress: () => {
            Alert.alert('Report Submitted', 'Thank you for your feedback');
            onClose();
          },
        },
        {
          text: 'Other Issue',
          onPress: () => {
            Alert.alert('Report Submitted', 'Thank you for your feedback');
            onClose();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      {item.image && item.image.uri ? (
        <Avatar rounded source={{ uri: item.image.uri }} size="medium" />
      ) : (
        <Avatar
          rounded
          title={getInitials(item.name)}
          size="medium"
          containerStyle={{ backgroundColor: '#808080' }}
          titleStyle={{ color: '#FFFFFF' }}
        />
      )}
      <Text style={styles.contactName}>{item.name.split(' ')[0]}</Text>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}
        activeOpacity={1}
        onPress={handleClose}
      >
        {/* Replace onClose with handleClose in all TouchableOpacity components */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
                { scale: scaleAnim },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.container}>
              <View className='flex-row items-start justify-between w-full pr-5 mb-[16px]'>
                <View className='flex-row items-center gap-x-[16px]r'>
                  <Image
                    source={{ uri: album?.image }}
                    className='w-[64px] h-[64px]'
                  />
                  <View className='ml-3 max-w-[200px]'>
                    <Text numberOfLines={1} className='text-white text-[16px] font-PlusJakartaSansBold'>
                      {album?.title}
                    </Text>
                    <Text className='text-[#63656B] text-[12px] font-PlusJakartaSansBold' numberOfLines={1}>
                      {album?.artist} · {formatDuration(album?.duration)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity className='bg-[#202227] p-[4px] rounded-[36px]' onPress={onClose}>
                  <Icon name="x" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View className='border-b-2 border-[#202227] pb-[16px] pt-[16px]'>
                <Text style={styles.sectionLabel}>Share to friends:</Text>
                {hasPermission ? (
                  <FlatList
                    horizontal
                    data={contacts}
                    renderItem={renderContact}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contactsList}
                  />
                ) : (
                  <TouchableOpacity
                    style={styles.permissionButton}
                    onPress={requestPermission}
                  >
                    <Text style={styles.permissionText}>Grant Contact Permission</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View className='border-b-2 border-[#202227] pb-[16px] pt-[16px]'>
         <Text style={styles.sectionLabel}>Send to</Text>
       <View style={styles.sharingButtons}>
      <TouchableOpacity style={styles.shareButton} onPress={handleCopyLink}>
        <View style={[styles.iconContainer, { backgroundColor: '#800080' }]}>
          <Feather name="link" size={32} color="#FFFFFF" />
        </View>
        <Text className='font-PlusJakartaSansMedium' style={styles.shareLabel}>Copy link</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={handleShareToWhatsApp}>
        <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
          <Image source={require("../../assets/images/whatsapp_3938041.png")} className='w-[64px] rounded-full h-[64px] ' />
        </View>
        <Text style={styles.shareLabel}>Share to WhatsApp</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={handleShareToSnapchat}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFFC00' }]}>
          <Image source={require("../../assets/images/social_13670393.png")} className='w-[40px] h-[40px]' />
        </View>
        <Text style={styles.shareLabel}>Snapchat story</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={handleShareToInstagram}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
          <Image source={require("../../assets/images/instagram_2111463.png")} className='w-[32px] h-[32px]' />
        </View>
        <Text style={styles.shareLabel}>Instagram chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.shareButton} onPress={handleShareToTwitter}>
        <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
          <Image source={require("../../assets/images/icons8-twitter-50.png")} className='w-[32px] h-[32px]' />
        </View>
        <Text style={styles.shareLabel}>Share to X</Text>
      </TouchableOpacity>
    </View>
  </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={handleAddToFavorites}>
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <FavouriteIcon
                      size={32}
                      color={isFavorite ? '#FF6D1B' : '#9A9B9F'}
                      variant={isFavorite ? 'solid' : 'stroke'}
                    />
                  </View>
                  <Text style={styles.actionLabel}>Add to favorites</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleAddToPlaylist}
                >
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <Playlist01Icon size={32} color='#9A9B9F' variant='stroke' />
                  </View>
                  <Text style={styles.actionLabel}>Add to Playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleAddToQueue}>
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <Queue01Icon
                      size={32}
                      color={isInQueue ? '#FF6D1B' : '#9A9B9F'}
                      variant={isInQueue ? 'solid' : 'stroke'}
                    />
                  </View>
                  <Text style={styles.actionLabel}>Add to Queue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleSeeCredits}>
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <CdIcon size={32} color='#9A9B9F' variant='stroke' />
                  </View>
                  <Text style={styles.actionLabel}>See credit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleReportAlbum}>
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <AlertDiamondIcon size={32} color='#9A9B9F' variant='stroke' />
                  </View>
                  <Text style={styles.actionLabel}>Report Album</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>

      <AddToPlaylistBottomSheet
        isVisible={isPlaylistSheetVisible}
        closeSheet={() => setIsPlaylistSheetVisible(false)}
        album={album}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20, // Add bottom padding to create space
      },
      modalContent: {
        backgroundColor: '#111318',
        borderRadius: 20, // Add border radius to all corners
        paddingLeft: 8,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        maxHeight: Dimensions.get('window').height * 0.9,
        width: "100%",
        overflow: "hidden",
      },
  container: {
    backgroundColor: '#111318',
    padding: 24,
    borderRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.9,
    overflow: "hidden",
  },
  contactsList: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  contactItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  contactName: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 8,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  sharingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  shareButton: {
    alignItems: 'center',
    width: "20%",
    marginBottom: 16,
    borderRadius: 56
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 5,
  },
  actionButton: {
    alignItems: 'center',
    width: 56,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Share;


const formatDuration = (duration: number | undefined) => {
  if (!duration) return '';

  const minutes = Math.floor(duration / 60000);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}hr ${remainingMinutes}min` : `${hours}hr`;
  }
  return `${minutes}min`;
};
