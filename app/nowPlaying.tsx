import {
    View,
    Text,
    Pressable,
    Image,
    TouchableOpacity,
    ScrollView,
  } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import React, { useEffect, useState } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import {
    ArrowLeft02Icon,
    Backward01Icon,
    FavouriteIcon,
    MoreHorizontalIcon,
    NextIcon,
    PauseIcon,
    PlayIcon,
    Playlist01Icon,
    Queue02Icon,
    RepeatIcon,
    Share05Icon,
    ShuffleIcon,
  } from '@hugeicons/react-native';
  import { useLocalSearchParams } from 'expo-router';
  import { LinearGradient } from 'expo-linear-gradient';
  import Slider from '@react-native-community/slider';
  import * as Haptics from 'expo-haptics';
  import { useQuery } from '../hooks/useQuery';
  import { getColors } from 'react-native-image-colors';
  import { BlurView } from 'expo-blur';
import { useMusicPlayerContext } from '@/context/MusicPlayerContext';

  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const NowPlaying = () => {
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [textColor, setTextColor] = useState('#FFFFFF');
    const [subTextColor, setSubTextColor] = useState('#D2D3D5');
    const { cover, albumTitle } = useLocalSearchParams();
    const navigation = useNavigation();
    const {
      isPlaying,
      currentTrack,
      albumInfo,
      shuffle,
      repeat,
      play,
      pause,
      toggleShuffleMode,
      toggleRepeatMode,
      next,
      previous,
      currentTime,
      duration,
      buffering,
      seekTo,
    } = useMusicPlayerContext();
    const { retrieveUserId, saveAlbum, likeSong } = useQuery();

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handlePrevious = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (currentTime > 3) {
        seekTo(0);
      } else {
        previous();
      }
    };

    const togglePlayPause = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (isPlaying) {
        pause(); // Changed from stop() to pause()
      } else if (currentTrack) {
        play(currentTrack, albumInfo!);
      }
    };

    const handleNext = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      next();
    };

    useEffect(() => {
      const fetchColors = async () => {
        const imageUrl = cover || albumInfo?.coverImage;
        if (imageUrl) {
          try {
            const result = await getColors(imageUrl, {
              fallback: '#000000',
              cache: true,
            });
            let bgColor = '#000000';
            if (result.platform === 'android') {
              bgColor = result.dominant;
            } else if (result.platform === 'ios') {
              bgColor = result.background;
            }
            setBackgroundColor(bgColor);
            const mainColor = getContrastColor(bgColor);
            setTextColor(mainColor);
            setSubTextColor(mainColor === '#FFFFFF' ? '#D2D3D5' : '#666666');
          } catch (error) {
            setBackgroundColor('#000000');
            setTextColor('#FFFFFF');
            setSubTextColor('#D2D3D5');
          }
        }
      };
      fetchColors();
    }, [cover, albumInfo?.coverImage]);

    return (
      <SafeAreaView style={{ flex: 1, minHeight: '100%', backgroundColor }}>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View className="flex-row items-center justify-between px-[24px]">
            <View className="flex-row items-center gap-x-[8px]">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.goBack();
                }}
              >
                <ArrowLeft02Icon size={32} color={textColor} />
              </Pressable>
              <View className="flex-1">
                <Text style={{ color: subTextColor }} className="text-[14px] font-PlusJakartaSansMedium">
                  Playing from
                </Text>
                <Text
                  style={{ color: textColor }}
                  className="text-[16px] font-PlusJakartaSansMedium"
                  numberOfLines={1}
                >
                  "{albumTitle || albumInfo?.title}"
                </Text>
              </View>
            </View>
            <MoreHorizontalIcon color={textColor} />
          </View>

          <View className="relative">
            <Image
              source={{ uri: cover || albumInfo?.coverImage }}
              className="w-full h-[400px] mt-[19px]"
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', backgroundColor, backgroundColor]}
              locations={[0.2, 0.8, 1]}
              className="absolute bottom-0 z-40 w-full h-[400px]"
              style={{ opacity: 0.95 }}
            />
          </View>

          <View className="px-[24px] my-[24px]">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text
                  style={{ color: textColor }}
                  className="text-[24px] font-PlusJakartaSansMedium"
                  numberOfLines={2}
                >
                  {currentTrack?.title}
                </Text>
                <Text
                  style={{ color: subTextColor }}
                  className="text-[14px] font-PlusJakartaSansRegular"
                  numberOfLines={1}
                >
                  {/* {currentTrack?.artist?.join(', ')} */}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <FavouriteIcon size={32} color={subTextColor} />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View className="mt-4">
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={duration > 0 ? currentTime / duration : 0}
                minimumTrackTintColor="#FF6D1B"
                maximumTrackTintColor="#4D4D4D"
                thumbTintColor="#FF6D1B"
                onValueChange={(value) => seekTo(value * duration)}
                disabled={buffering}
              />
              <View className="flex-row justify-between">
                <Text style={{ color: subTextColor }}>{formatTime(currentTime)}</Text>
                <Text style={{ color: subTextColor }}>{formatTime(duration)}</Text>
              </View>
            </View>

            {/* Player Controls */}
            <View className="flex-row items-center justify-between mt-8">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleShuffleMode();
                }}
                className="w-[48px] h-[48px] items-center justify-center"
              >
                <ShuffleIcon size={24} color={shuffle ? "#FF6D1B" : subTextColor} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePrevious}
                className="w-[48px] h-[48px] items-center justify-center"
              >
                <Backward01Icon size={32} color={textColor} variant="solid" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={togglePlayPause}
                className="items-center justify-center"
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 44,
                  backgroundColor: textColor,
                  shadowColor: backgroundColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {isPlaying ? (
                  <PauseIcon size={40} color={backgroundColor} variant="solid" style={{ opacity: 0.9 }} />
                ) : (
                  <PlayIcon size={40} color={backgroundColor} variant="solid" style={{ opacity: 0.9 }} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                className="w-[48px] h-[48px] items-center justify-center"
              >
                <NextIcon size={32} color={textColor} variant="solid" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleRepeatMode();
                }}
                className="w-[48px] h-[48px] items-center justify-center"
              >
                <RepeatIcon size={24} color={repeat ? "#FF6D1B" : subTextColor} />
              </TouchableOpacity>
            </View>

            {/* Bottom controls with blur effect */}
            <BlurView intensity={20} className="mt-8 rounded-[24px] overflow-hidden">
              <View
                className="flex-row items-center justify-between px-[24px] p-[12px]"
                style={{ borderColor: `${subTextColor}40` }}
              >
                <TouchableOpacity>
                  <Queue02Icon size={32} color={subTextColor} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Playlist01Icon size={32} color={subTextColor} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Share05Icon size={32} color={subTextColor} />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default NowPlaying;
