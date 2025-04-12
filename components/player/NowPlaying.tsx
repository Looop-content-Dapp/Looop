import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useMusicPlayer from '@/hooks/useMusicPlayer';
import Waves from '@/assets/svg/Waves';
import { NextIcon, PauseIcon, PlayIcon } from '@hugeicons/react-native';
import { getColors } from 'react-native-image-colors';
import { useMusicPlayerContext } from '@/context/MusicPlayerContext';

const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const NowPlaying = () => {
  const [backgroundColor, setBackgroundColor] = useState('#111318');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [subtextColor, setSubtextColor] = useState('#9A9B9F');

  const {
    currentTrack,
    albumInfo,
    isPlaying,
    play,
    pause,
    buffering,
  } = useMusicPlayerContext();

  useEffect(() => {
    const fetchColors = async () => {
      if (albumInfo?.coverImage) {
        try {
          const result = await getColors(albumInfo.coverImage, {
            fallback: '#111318',
            cache: true,
          });

          let bgColor = '#111318';
          if (result.platform === 'android') {
            bgColor = result.dominant;
          } else if (result.platform === 'ios') {
            bgColor = result.background;
          }

          setBackgroundColor(bgColor);
          const mainColor = getContrastColor(bgColor);
          // Increase contrast by using pure white/black for text
          setTextColor(mainColor === '#FFFFFF' ? '#FFFFFF' : '#000000');
          // More contrasting subtext colors
          setSubtextColor(mainColor === '#FFFFFF' ? '#D2D3D5' : '#444444');
        } catch (error) {
          setBackgroundColor('#111318');
          setTextColor('#FFFFFF');
          setSubtextColor('#D2D3D5');
        }
      }
    };

    fetchColors();
  }, [albumInfo?.coverImage]);

  if (!currentTrack || !albumInfo) return null;

  return (
    <View
      className="pt-[12px] px-[24px] pb-[15px] border-b-2 border-[#202227]"
      style={{ backgroundColor }}
    >
      <View className='flex-row items-center gap-x-[8px] mb-2'>
        <Waves />
        <Text
          className='text-[16px] font-PlusJakartaSansBold'
          style={{ color: textColor }}
        >
          Playing...
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-4">
          <Image
            source={{ uri: albumInfo.coverImage }}
            className="w-[48px] h-[48px] rounded-lg"
          />
          <View className="ml-3 flex-1 min-w-0">
            <Text
              className="font-PlusJakartaSansMedium text-[16px]"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: textColor }}
            >
              {currentTrack.title}
            </Text>
            <Text
              className="font-PlusJakartaSansMedium text-[12px]"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ color: subtextColor }}
            >
              {currentTrack.artist?.name}
            </Text>
          </View>
        </View>

        <View className='flex-row items-center gap-x-[8px]'>
          <TouchableOpacity
            onPress={isPlaying ? pause : () => play(currentTrack, albumInfo)}
            className="p-[12px] rounded-full"
            style={{
              backgroundColor: textColor,
              opacity: 0.9 // Slightly reduce opacity for better contrast
            }}
          >
            {buffering ? (
              <ActivityIndicator color={backgroundColor} size="small" />
            ) : isPlaying ? (
                <PauseIcon
                  size={24}
                  color={backgroundColor}
                  variant="solid"
                  style={{ opacity: 0.9 }}
                />
              ) : (
                <PlayIcon
                  size={24}
                  color={backgroundColor}
                  variant="solid"
                  style={{ opacity: 0.9 }}
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={isPlaying ? pause : () => play(currentTrack, albumInfo)}
            className="p-[12px] rounded-full"
            style={{
              backgroundColor: textColor,
              opacity: 0.7 // More transparency for secondary button
            }}
          >
            <NextIcon
              size={24}
              color={backgroundColor}
              variant='solid'
              style={{ opacity: 1 }} // Keep icon fully opaque
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NowPlaying;
