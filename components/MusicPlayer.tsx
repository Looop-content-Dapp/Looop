import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { NextIcon, PauseIcon, PlayIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { getColors } from 'react-native-image-colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useMusicPlayerContext } from '@/context/MusicPlayerContext';
import TrackPlayer from 'react-native-track-player';

const getContrastColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const MusicPlayer = () => {
  const [backgroundColor, setBackgroundColor] = useState('#0a0b0f');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [subtextColor, setSubtextColor] = useState('#A5A6AA');

  const {
    currentTrack,
    albumInfo,
    isPlaying,
    pause,
    play,
    next,
    buffering,
  } = useMusicPlayerContext();
  const { navigate } = useRouter();

  useEffect(() => {
    const fetchColors = async () => {
      if (currentTrack?.release?.artwork?.high || currentTrack?.releaseImage) {
        try {
          const result = await getColors(currentTrack?.release?.artwork?.high || currentTrack?.releaseImage , {
            fallback: '#0a0b0f',
            cache: true,
          });

          let bgColor = '#0a0b0f';
          if (result.platform === 'android') {
            bgColor = result.dominant;
          } else if (result.platform === 'ios') {
            bgColor = result.background;
          }

          setBackgroundColor(bgColor);
          const mainColor = getContrastColor(bgColor);
          setTextColor(mainColor);
          setSubtextColor(mainColor === '#FFFFFF' ? '#A5A6AA' : '#666666');
        } catch (error) {
          setBackgroundColor('#0a0b0f');
          setTextColor('#FFFFFF');
          setSubtextColor('#A5A6AA');
        }
      }
    };

    fetchColors();
  }, [albumInfo?.coverImage]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        await pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  const handleNext = async () => {
    try {
      await next();
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  };

  if (!currentTrack) return null;

  return (
    <View
      className="h-[80px] flex-row items-center justify-between absolute bottom-[85px]"
      style={{
        backgroundColor,
        width: wp("95%"),
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
        // Center horizontally
        left: '49%',
        transform: [
          { translateX: -wp("46%") }, // Half of the width to center
        ],
      }}
    >
      <Pressable
        onPress={() =>
          navigate({
            pathname: "/nowPlaying",
            params: {
              cover: currentTrack?.release?.artwork?.high ? currentTrack?.release?.artwork?.high : currentTrack?.releaseImage,
              albumTitle: albumInfo?.title,
              title: currentTrack?.title,
            },
          })
        }
        className="flex-1 flex-row items-center gap-x-[12px]"
      >
        <Image
          source={{ uri: currentTrack?.release?.artwork?.high ? currentTrack?.release?.artwork?.high : currentTrack?.releaseImage  }}
          className="w-[60px] h-[60px] rounded-md"
        />
        <View className="flex-1 mr-4">
          <Text
            className="text-[14px] font-PlusJakartaSansMedium"
            numberOfLines={1}
            style={{ color: textColor }}
          >
            {currentTrack?.title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <Text
              className="text-[12px] font-PlusJakartaSansBold"
              numberOfLines={1}
              style={{ color: subtextColor }}
            >
              {currentTrack?.artist?.name}
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="flex-row items-center gap-x-[20px]">
        {buffering ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <TouchableOpacity onPress={handlePlayPause}>
            {isPlaying ? (
              <PauseIcon size={28} color={textColor} variant="solid" />
            ) : (
              <PlayIcon size={28} color={textColor} variant="solid" />
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleNext}>
          <NextIcon size={28} color={textColor} variant="solid" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicPlayer;
