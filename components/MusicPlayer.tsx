// MusicPlayer.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import useMusicPlayer from '../hooks/useMusicPlayer';
import { NextIcon, PauseIcon, PlayIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';

const MusicPlayer = () => {
  const {
    currentTrack,
    albumInfo,
    isPlaying,
    pause,
    play,
    nextTrack,
  } = useMusicPlayer();
  const {navigate} = useRouter()
  console.log("album", albumInfo)

  if (!currentTrack || !albumInfo) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      // Resume playing the current track with current album info
      play(currentTrack, albumInfo);
    }
  };

  const handleNext = () => {
    nextTrack();
  };

  return (
    <View className='h-[88px] flex-row items-center justify-around bg-[#0a0b0f] absolute bottom-[74px] left-0 right-0 gap-y-[5px]'>
      <Pressable onPress={()=> navigate({
        pathname:"/nowPlaying",
        params:{
            cover: albumInfo?.coverImage,
            albumTitle: albumInfo?.title,
            title: currentTrack?.title
        }
        })}
        className='flex-1 px-4 flex-row items-center gap-x-[20px]'>
        <Image
          source={{ uri: albumInfo?.coverImage }}
          className='w-[78px] h-[78px]'
        />
        <View>
          <Text  className='text-white text-[16px] font-PlusJakartaSansMedium' numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text className='text-[12px] font-PlusJakartaSansBold text-[#A5A6AA]'>
            ¥$, Ye & Ty Dolla Sign
          </Text>
        </View>
      </Pressable>

      <View className='flex-row items-center gap-x-[24px] pr-4'>
        <TouchableOpacity onPress={handlePlayPause}>
          {isPlaying ? (
            <PauseIcon size={32} color='#FFFFFF' variant='solid'/>
          ) : (
            <PlayIcon size={32} color='#FFFFFF' variant='solid'/>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <NextIcon size={32} color='#FFFFFF' variant='solid'/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicPlayer;
