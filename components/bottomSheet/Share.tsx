import React, { useState, useEffect, forwardRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Feather';
import * as Contacts from 'expo-contacts';
import { Avatar } from 'react-native-elements';
import { AlertDiamondIcon, CdIcon, FavouriteIcon, Playlist01Icon, Queue01Icon } from '@hugeicons/react-native';
import { Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface ShareProps {
  title?: string;
  artist?: string;
  image?: string;
  duration?: string;
}

// Update the component definition to properly handle props
const Share = forwardRef<BottomSheet, { album: ShareProps }>((props, ref) => {
  const { album } = props;  // Properly destructure the album prop
  const [hasPermission, setHasPermission] = useState(false);
  const [contacts, setContacts] = useState([]);


  // Request contact permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Image, Contacts.Fields.Name],
        });
        setContacts(data.slice(0, 5)); // Limit to 5 contacts
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  // Handle permission request when button is pressed
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

  // Extract initials from contact name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  // Render contact item
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
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={['50%']}
      backgroundStyle={styles.bottomSheet}
    >
      <BottomSheetView style={styles.container}>
        {/* Header with Close Button */}
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

        <TouchableOpacity className='bg-[#202227] p-[4px] rounded-[36px]' onPress={() => ref.current?.close()}>
            <Icon name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Song Details */}


        {/* Share to Friends Section */}
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


        {/* Send to Section */}
        <View className='border-b-2 border-[#202227] pb-[16px] pt-[16px]'>
        <Text style={styles.sectionLabel}>Send to</Text>
        <View style={styles.sharingButtons}>
          <TouchableOpacity style={styles.shareButton}>
            <View style={[styles.iconContainer, { backgroundColor: '#800080' }]}>
              <Feather name="link" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.shareLabel}>Copylink</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
              <FontAwesome5 name="whatsapp" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.shareLabel}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFFC00' }]}>
              <FontAwesome5 name="snapchat-ghost" size={32} color="#000000" />
            </View>
            <Text style={styles.shareLabel}>Snapchat story</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
              <FontAwesome5 name="instagram" size={32} color="#FF005F" />
            </View>
            <Text style={styles.shareLabel}>Instagram chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <View style={[styles.iconContainer, { backgroundColor: '#FFFFFF' }]}>
              <FontAwesome5 name="x-twitter" size={32} color="#000000" />
            </View>
            <Text style={styles.shareLabel}>Share to X</Text>
          </TouchableOpacity>
        </View>
        </View>


        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
           <View className='bg-[#202227] p-[20px] rounded-[56px]'>
             <FavouriteIcon size={32} color='#9A9B9F' variant='stroke' />
           </View>
            <Text style={styles.actionLabel}>Add to favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
           <View className='bg-[#202227] p-[20px] rounded-[56px]'>
             <Playlist01Icon size={32} color='#9A9B9F' variant='stroke' />
           </View>
            <Text style={styles.actionLabel}>Add to Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
           <View className='bg-[#202227] p-[20px] rounded-[56px]'>
             <Queue01Icon size={32} color='#9A9B9F' variant='stroke' />
           </View>
            <Text style={styles.actionLabel}>Add to Queue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
           <View className='bg-[#202227] p-[20px] rounded-[56px]'>
             <CdIcon size={32} color='#9A9B9F' variant='stroke' />
           </View>
            <Text style={styles.actionLabel}>See credit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
           <View className='bg-[#202227] p-[20px] rounded-[56px]'>
             <AlertDiamondIcon size={32} color='#9A9B9F' variant='stroke' />
           </View>
            <Text style={styles.actionLabel}>Report Album</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: '#111318',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20
  },
  container: {
    backgroundColor: '#111318',
    padding: 16,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  songDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Reduced from 24
  },
  songImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  songTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  songInfo: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  sectionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  contactsList: {
    paddingHorizontal: 8,
    marginBottom: 16, // Added marginBottom
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
    marginVertical: 8, // Reduced from 16
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  sharingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8, // Reduced from 1
    rowGap: 20
  },
  shareButton: {
    alignItems: 'center',
    width: '20%',
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
    marginTop: 8,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  actionButton: {
    alignItems: 'center',
    width: '20%',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Share;
