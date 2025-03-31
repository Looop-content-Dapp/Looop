import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Pressable, Platform } from 'react-native';
import { NextIcon, PauseIcon, PlayIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { getColors } from 'react-native-image-colors';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useMusicPlayerContext } from '@/context/MusicPlayerContext';

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
  } = useMusicPlayerContext();
  const { navigate } = useRouter();

  useEffect(() => {
    const fetchColors = async () => {
      if (albumInfo?.coverImage) {
        try {
          const result = await getColors(albumInfo.coverImage, {
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

  if (!currentTrack || !albumInfo) return null;

  const handlePlayPause = async () => {
    if (!currentTrack || !albumInfo) return;

    try {
      if (isPlaying) {
        await pause();
      } else {
        await play(currentTrack, albumInfo);
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  const handleNext = () => {
    if (!currentTrack || !albumInfo) return;
    next();
  };

  return (
    <View
      className="h-[80px] flex-row items-center justify-between absolute bottom-[74px] left-0 right-0"
      style={{
        backgroundColor,
        width: wp("100%"),
        paddingHorizontal: 16,
      }}
    >
      <Pressable
        onPress={() =>
          navigate({
            pathname: "/nowPlaying",
            params: {
              cover: albumInfo?.coverImage,
              albumTitle: albumInfo?.title,
              title: currentTrack?.title,
            },
          })
        }
        className="flex-1 flex-row items-center gap-x-[12px]"
      >
        <Image
          source={{ uri: albumInfo?.coverImage }}
          className="w-[60px] h-[60px] rounded-md"
        />
        <View className="flex-1 mr-4">
          <Text
            className="text-[16px] font-PlusJakartaSansMedium"
            numberOfLines={1}
            style={{ color: textColor }}
          >
            {currentTrack.title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            <Text
              className="text-[12px] font-PlusJakartaSansBold"
              numberOfLines={1}
              style={{ color: subtextColor }}
            >
              {currentTrack?.artist?.name}
            </Text>
            {currentTrack?.featuredArtists && currentTrack?.featuredArtists.length > 0 && (
              <>
                <Text style={{ color: subtextColor }}> • </Text>
                {currentTrack?.featuredArtists?.map((artist, index) => (
                  <Text
                    key={artist._id}
                    className="text-[12px] font-PlusJakartaSansBold"
                    numberOfLines={1}
                    style={{ color: subtextColor }}
                  >
                    {index > 0 ? `, ${artist.name}` : artist.name}
                  </Text>
                ))}
              </>
            )}
          </View>
        </View>
      </Pressable>

      <View className="flex-row items-center gap-x-[20px]">
        <TouchableOpacity onPress={handlePlayPause}>
          {isPlaying ? (
            <PauseIcon size={28} color={textColor} variant="solid" />
          ) : (
            <PlayIcon size={28} color={textColor} variant="solid" />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <NextIcon size={28} color={textColor} variant="solid" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MusicPlayer;
