import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Backward01Icon, Forward01Icon, More01Icon, PlayCircleIcon, PlayIcon} from '@hugeicons/react-native'
import { Skeleton } from 'moti/skeleton';

interface TrackData {
  title: string;
  artist: string[];
  image: any;
  // Add other properties as needed
}

const RecentlyPlayed = () => {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        const value = await AsyncStorage.getItem('selectedTrack');
        if (value !== null) {
          const trackData = JSON.parse(value) as TrackData;
          setCurrentTrack(trackData);
        }
      } catch (error) {
        console.error('Error fetching track data', error);
      }
    };
    fetchTrackData();
  }, [currentTrack]); // Empty dependency array means this effect runs once on mount

  if(!currentTrack)return null
  return (
    <View className="h-[169px] rounded-[10px] gap-y-[16px]">
        {/* <Skeleton >
        <Text className="text-[16px] font-PlusJakartaSansBold text-[#ffff]">Continue Listening</Text>
        </Skeleton>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-x-[24px]">
            <Skeleton  width={100} height={100}>
            {!currentTrack?.image ? (
            <Image
              source={require('../../assets/images/rema.png')}
              className="h-[100px] w-[100px] rounded-[10px]"
            />
          ) : (
            <Image
              source={currentTrack?.image}
              className="h-[100px] w-[100px] rounded-[10px]"
            />
          )}
         </Skeleton>
          <View className='items-start gap-y-[4px]'>
            <Skeleton >
            <Text className='text-[16px] font-PlusJakartaSansBold text-[#fff] font-normal'>{currentTrack?.title ? currentTrack?.title : "Not Playing"}</Text>
            </Skeleton>
            <Skeleton >
            <View className='flex-row items-center gap-x-[8px]'>
           <Text className='text-[12px] font-normal text-[#787A80] font-PlusJakartaSansBold'>{currentTrack?.artist[0]}</Text>
           <Pressable className='bg-Grey/06 h-[4px] w-[4px] font-normal text-[#787A80] font-PlusJakartaSansBold'/>
           <Text className='text-[14px] font-normal text-[#787A80] font-PlusJakartaSansBold'>Single</Text>
           </View>
         </Skeleton>
          </View>
        </View>
    <Skeleton  radius="round" width={62} height={62}>
    <TouchableOpacity className='bg-Orange/08 h-[62px] w-[62px] items-center justify-center rounded-full'>
        <PlayIcon size={32} color="#fff" variant='solid' />
        </TouchableOpacity>
    </Skeleton>
      </View> */}
    </View>
  );
};

export default RecentlyPlayed;
