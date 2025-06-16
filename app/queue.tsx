import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft02Icon, Menu09Icon } from '@hugeicons/react-native';
import { useNavigation } from 'expo-router';
import { useMusicPlayerContext } from '@/context/MusicPlayerContext';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import TrackPlayer, { usePlaybackState, Track } from 'react-native-track-player';
import MusicPlayer from '@/components/MusicPlayer';
import FastImage from 'react-native-fast-image';

const Queue = () => {
  const navigation = useNavigation();
  const { currentTrack } = useMusicPlayerContext();
  const [queueTracks, setQueueTracks] = useState([]);
  const playbackState = usePlaybackState();

  useEffect(() => {
    const getQueue = async () => {
      try {
        const queue = await TrackPlayer.getQueue();
        const currentIndex = await TrackPlayer.getCurrentTrack();
        if (currentIndex !== null && currentIndex !== undefined) {
          // Get only the tracks after the current track
          const upcomingTracks = queue.slice(currentIndex + 1);
          setQueueTracks(upcomingTracks);
        }
      } catch (error) {
        console.error("Error getting queue:", error);
      }
    };

    getQueue();
  }, [playbackState]);

  const handleUpdateQueue = async (newQueue) => {
    try {
      const currentIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentIndex !== null) {
        // Get the current track and its position
        const currentTrack = await TrackPlayer.getTrack(currentIndex as number);
        const currentPosition = await TrackPlayer.getProgress().then((progress) => progress.position);
        const isPlaying = await TrackPlayer.getState() === TrackPlayer.STATE_PLAYING;

        // Create new queue with current track and reordered upcoming tracks
        const fullQueue = [currentTrack, ...newQueue];

        // Update the queue without resetting
        await TrackPlayer.removeUpcomingTracks();
        await TrackPlayer.add(newQueue);

        // Update state immediately for better UX
        setQueueTracks(newQueue);

        // Trigger haptic feedback for better UX
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error("Error updating queue:", error);
    }
  };

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          className="flex-row items-center px-4 py-3"
        >
          <Image
            source={{
              uri: currentTrack?.artwork || currentTrack?.release?.artwork?.high,
            }}
            className="w-12 h-12 rounded"
            defaultSource={require('@/assets/images/default-artwork.png')}
          />
          <View className="flex-1 ml-3">
            <Text className="text-white text-[16px] font-PlusJakartaSansBold" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-[#63656B] text-[14px]" numberOfLines={1}>
              {item.artist}
            </Text>
          </View>
          <TouchableOpacity>
            <Menu09Icon size={24} color="#63656B" />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A0B0F]">
        <View className='flex-1'>
        <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <ArrowLeft02Icon size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View className='pt-[24px] pb-[20px] pl-[23px] pr-[24px] gap-y-[16px] bg-[#1A1B1F]'>
        <Text className="text-[16px] text-white font-PlusJakartaSansBold">
          Now playing
        </Text>
        <View className="flex-row items-center">
          <Image
            source={{
              uri: currentTrack?.artwork || currentTrack?.release?.artwork?.high,
            }}
            className="w-12 h-12 rounded"
            defaultSource={require('../assets/images/default-artwork.png')}
          />
          <View className="flex-1 ml-3">
            <Text className="text-white text-[16px] font-PlusJakartaSansBold" numberOfLines={1}>
              {currentTrack?.title}
            </Text>
            <Text className="text-[#63656B] text-[14px]" numberOfLines={1}>
              {currentTrack?.artist?.name}
            </Text>
          </View>
        </View>
      </View>

      <Text className="px-4 py-3 text-[16px] text-[#63656B] font-PlusJakartaSansBold">
        Up next
      </Text>

      <DraggableFlatList
        data={queueTracks}
        onDragEnd={({ data }) => handleUpdateQueue(data)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
         contentContainerStyle={{

        paddingBottom: currentTrack  ? 190 : 120
         }}
      />

        </View>

    </SafeAreaView>
  );
};

export default Queue;
