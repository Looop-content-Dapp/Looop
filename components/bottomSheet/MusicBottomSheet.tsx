import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Share, Alert } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { FavouriteIcon, Playlist01Icon, Queue02Icon, AlertDiamondIcon, CdIcon, Share05Icon } from '@hugeicons/react-native';

const MusicBottomSheet = ({ album, isVisible, closeSheet, openAddToPlaylistSheet }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      closeSheet(); // Close the bottom sheet when fully closed
    }
  }, [closeSheet]);

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  // Function to generate a shareable link for the album
  const getAlbumShareLink = (albumId) => {
    return `https://yourapp.com/album/${albumId}`; // Replace with your actual URL scheme
  };

   // a function that converts total seconds to minutes and round it up so there is no decimal point
   const convertSecondsToMinutes = (seconds: number) => {
    return Math.ceil(seconds / 60);
};

  // Share function
  const onShare = async () => {
    try {
      const albumUrl = getAlbumShareLink(album.id);
      const albumTitle = album.title;
      const albumArtist = album.artist || 'Unknown Artist'; // Adjust based on your album data structure

      const message = `🎵 Check out this album: "${albumTitle}" by ${albumArtist}!\nListen here: ${albumUrl}`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Album shared successfully!');
          Alert.alert('Success', 'Album shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dialog dismissed');
      }
    } catch (error) {
      console.error('Error sharing album:', error);
      Alert.alert('Error', 'Failed to share the album. Please try again.');
    }
  };


  return (
    <BottomSheet
      index={isVisible ? 0 : -1}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={[350]}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#12141B' }}
      handleIndicatorStyle={{
        backgroundColor: '#787A80',
        width: 80,
        height: 4,
        borderRadius: 10,
      }}
    >
      <BottomSheetView style={{ backgroundColor: '#12141B', padding: 16 }}>
        <View className="flex-row items-center mb-4">
          <Image
            source={{ uri: album.image }}
            style={{ width: 50, height: 50, borderRadius: 8 }}
          />
          <View className="ml-3">
            <Text className="text-lg text-white font-bold">{album.title}</Text>
            <Text className="text-gray-400"> {album.tracks.length} Songs • 50 minutes • 2024</Text>
          </View>
        </View>
        <View className="flex-row flex-wrap justify-around items-center ">
        <TouchableOpacity className="w-[116px] mb-4 border-2 border-[#1D2029] rounded-[10px] items-center justify-center px-[13px] py-[20px]">
        <FavouriteIcon size={24} color="#fff" variant="stroke" />
        <Text className="text-[#F4F4F4] font-PlusJakartaSansRegular text-[11px] text-center leading-tight mt-2">
         Add to favorites
        </Text>
    </TouchableOpacity>


          <TouchableOpacity onPress={openAddToPlaylistSheet} className="w-[116px] mb-4 border-2 rounded-[10px] border-[#1D2029] items-center justify-center px-[13px] py-[20px]">
            <Playlist01Icon size={24} color="#fff" variant="stroke" />
            <Text className="text-[#F4F4F4] font-PlusJakartaSansRegular text-[11px] text-center leading-tight mt-2">Add to Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} className="w-[116px] mb-4 border-2 border-[#1D2029] rounded-[10px] items-center justify-center px-[13px] py-[20px]">
            <Share05Icon size={24} color="#fff" variant="stroke" />
            <Text className="text-[#F4F4F4] font-PlusJakartaSansRegular text-[11px] text-center leading-tight mt-2">Share Album</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-[116px] mb-4 border-2 border-[#1D2029] rounded-[10px] items-center justify-center px-[13px] py-[20px]">
            <Queue02Icon size={24} color="#fff" variant="stroke" />
            <Text className="text-[#F4F4F4] font-PlusJakartaSansRegular text-[11px] text-center leading-tight mt-2">Add to queue</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-[116px] mb-4 border-2 border-[#1D2029] rounded-[10px] items-center justify-center px-[13px] py-[20px]">
            <CdIcon size={24} color="#fff" variant="stroke" />
            <Text className="text-[#F4F4F4] font-PlusJakartaSansRegular text-[11px] text-center leading-tight mt-2">See Credits</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-[116px] mb-4 border-2 border-[#1D2029] rounded-[10px] items-center justify-center px-[13px] py-[20px]">
            <AlertDiamondIcon size={24} color="#fff" variant="stroke" />
            <Text className="text-[#F4F4F4] font-PlusJakartaSansRegular text-[11px] text-center leading-tight mt-2">Report Album</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default MusicBottomSheet;
