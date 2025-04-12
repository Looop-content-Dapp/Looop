import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as Contacts from 'expo-contacts';
import { Avatar } from 'react-native-elements';
import { AlertDiamondIcon, AllBookmarkIcon, CdIcon, FavouriteIcon, Playlist01Icon, Queue01Icon } from '@hugeicons/react-native';
import { Feather } from '@expo/vector-icons';
import AddToPlaylistBottomSheet from './AddToPlaylistBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';

interface ShareProps {
  isVisible: boolean;
  onClose: () => void;
  album: {
    title?: string;
    artist?: string;
    image?: string;
    duration?: string;
    type?: string;
    id?: string;
  };
}

const SharePost: React.FC<ShareProps> = ({ isVisible, onClose, album }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isPlaylistSheetVisible, setIsPlaylistSheetVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 15,
        mass: 0.8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

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

  const handleAddToQueue = () => {
    Alert.alert('Success', 'Added to queue');
    onClose();
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
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
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
              ],
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
                      {album?.artist} · {album?.duration}
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

              <View className='border-b-2 border-[#202227]  pb-[16px] pt-[16px]'>
                <Text style={styles.sectionLabel}>Send to</Text>

                <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.sharingButtons} className='gap-x-[10px]'>
                  <TouchableOpacity style={styles.shareButton}>
                    <View style={[styles.iconContainer, { backgroundColor: '#800080' }]}>
                      <Feather name="link" size={32} color="#FFFFFF" />
                    </View>
                    <Text className='font-PlusJakartaSansMedium' style={styles.shareLabel}>Copylink</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton}>
                    <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
                      <Image source={require("../../assets/images/whatsapp_3938041.png")} className='w-[64px] rounded-full h-[64px] ' />
                    </View>
                    <Text style={styles.shareLabel}>Share to Whatsapp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton}>
                    <View style={[styles.iconContainer, { backgroundColor: '#FFFC00' }]}>
                      <Image source={require("../../assets/images/social_13670393.png")} className='w-[40px] h-[40px]' />
                    </View>
                    <Text style={styles.shareLabel}>Snapchat story</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton}>
                    <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
                      <Image source={require("../../assets/images/instagram_2111463.png")} className='w-[32px] h-[32px]' />
                    </View>
                    <Text style={styles.shareLabel}>Instagram chat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.shareButton}>
                    <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
                      <Image source={require("../../assets/images/icons8-twitter-50.png")} className='w-[32px] h-[32px]' />
                    </View>
                    <Text style={styles.shareLabel}>Share to X</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>

              <View style={styles.actionButtons} className='gap-x-[20px]'>
                <TouchableOpacity style={styles.actionButton} onPress={handleAddToFavorites}>
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <AllBookmarkIcon
                      size={32}
                      color={isFavorite ? '#FF6D1B' : '#9A9B9F'}
                      variant={isFavorite ? 'solid' : 'stroke'}
                    />
                  </View>
                  <Text style={styles.actionLabel}>Save this Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                //   onPress={() => {
                //     onClose();
                //     setTimeout(() => setIsPlaylistSheetVisible(true), 300);
                //   }}
                >
                  <View className='bg-[#202227] p-[20px] rounded-[56px]'>
                    <AlertDiamondIcon size={32} color='#9A9B9F' variant='stroke' />
                  </View>
                  <Text style={styles.actionLabel}>Report Post</Text>
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
    overflow: "hidden"
  },
  container: {
    backgroundColor: '#111318',
    padding: 24,
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

export default SharePost;
