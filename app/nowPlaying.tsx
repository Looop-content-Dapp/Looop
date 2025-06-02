import {
    View,
    Text,
    Pressable,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Dimensions
  } from 'react-native';
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
  import { router, useLocalSearchParams, useNavigation } from 'expo-router';
  import { LinearGradient } from 'expo-linear-gradient';
  import Slider from '@react-native-community/slider';
  import * as Haptics from 'expo-haptics';
  import { getColors } from 'react-native-image-colors';
  import { BlurView } from 'expo-blur';
  import { useMusicPlayerContext } from '@/context/MusicPlayerContext';
  import TrackPlayer, { useProgress } from 'react-native-track-player';
  import AddToPlaylistBottomSheet from '@/components/bottomSheet/AddToPlaylistBottomSheet';
  import Share from '@/components/bottomSheet/Share';
  import FastImage from 'react-native-fast-image';
  import { widthPercentageToDP as wp} from 'react-native-responsive-screen'

  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Add this import at the top with other imports


  const NowPlaying = () => {
    // Add this state near other state declarations
    const [isPlaylistSheetVisible, setIsPlaylistSheetVisible] = useState(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
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
      toggleShuffle,
      toggleRepeat,
      next,
      previous,
      currentTime,
      duration,
      buffering,
      seekTo,
    } = useMusicPlayerContext();
    const progress = useProgress();

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
      const fetchColors = async () => {
        const imageUrl = cover || albumInfo?.coverImage;
        if (cover) {
          try {
            const result = await getColors(cover as string, {
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
    }, [cover, albumInfo?.coverImage, currentTrack]);

    const togglePlayPause = async () => {
      try {
        if (isPlaying) {
          await pause();
        } else {
          await TrackPlayer.play();
        }
      } catch (error) {
        console.error("Error toggling play/pause:", error);
      }
    };

    const handlePlaylistPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsPlaylistSheetVisible(true);
      };

      const handleSharePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsShareModalVisible(true);
      };

      const handleQueuePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
         router.push("/queue");
      };

    const handleNext = async () => {
      try {
        await next();
      } catch (error) {
        console.error("Error skipping to next:", error);
      }
    };

    const handlePrevious = async () => {
      try {
        const position = progress.position;
        if (position > 3) {
          await TrackPlayer.seekTo(0);
        } else {
          await previous();
        }
      } catch (error) {
        console.error("Error skipping to previous:", error);
      }
    };

    if (!currentTrack) return null;

    return (
      <SafeAreaView style={{ flex: 1, minHeight: '100%', backgroundColor }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 6
          }}
        >
          <View className="flex-row items-center justify-between w-full py-4">
            <View className="flex-row items-center flex-1 gap-x-3">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.goBack();
                }}
                className="p-2"
              >
                <ArrowLeft02Icon size={28} color={textColor} />
              </Pressable>
              <View className="flex-1 mr-4">
                <Text
                  style={{ color: subTextColor }}
                  className="text-[12px] font-PlusJakartaSansMedium mb-0.5"
                >
                  Playing from
                </Text>
                <Text
                  style={{ color: textColor }}
                  className="text-[15px] font-PlusJakartaSansMedium"
                  numberOfLines={1}
                >
                  {albumTitle || albumInfo?.title}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className="p-2"
              onPress={handleSharePress}
            >
              <MoreHorizontalIcon size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={{
    width: '95%',
    height: 400,
    marginTop: 0,
    marginHorizontal: 'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
}}>
    <FastImage
        source={{
            uri: cover,
            priority: FastImage.priority.high,
        }}
        style={{
            width: '100%',
            height: '100%',
        }}
        resizeMode={FastImage.resizeMode.cover}
    />
</View>

          <View className="px-[24px] my-[24px]">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <Text
                  style={{ color: textColor }}
                  className="text-[20px] font-PlusJakartaSansMedium"
                  numberOfLines={1}
                >
                  {currentTrack?.title}
                </Text>
                <Text
                  style={{ color: subTextColor }}
                  className="text-[14px] font-PlusJakartaSansRegular"
                  numberOfLines={1}
                >
                  {currentTrack?.artist?.name}
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <FavouriteIcon size={32} color={subTextColor} />
              </TouchableOpacity> */}
            </View>

            <View className="mt-4">
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={progress.duration || 1}
                value={progress.position}
                minimumTrackTintColor="#FF6D1B"
                maximumTrackTintColor="#4D4D4D"
                thumbTintColor="#FF6D1B"
                onSlidingComplete={(value) => seekTo(value)}
                disabled={buffering}
              />
              <View className="flex-row justify-between">
                <Text style={{ color: subTextColor }}>
                  {formatTime(progress.position)}
                </Text>
                <Text style={{ color: subTextColor }}>
                  {formatTime(progress.duration)}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between mt-8">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleShuffle();
                }}
                className="w-[48px] h-[48px] items-center justify-center"
              >
                <ShuffleIcon
                  size={24}
                  color={shuffle ? '#FF6D1B' : subTextColor}
                />
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
                disabled={buffering}
              >
                {buffering ? (
                  <ActivityIndicator size="large" color={backgroundColor} />
                ) : isPlaying ? (
                  <PauseIcon
                    size={40}
                    color={backgroundColor}
                    variant="solid"
                    style={{ opacity: 0.9 }}
                  />
                ) : (
                  <PlayIcon
                    size={40}
                    color={backgroundColor}
                    variant="solid"
                    style={{ opacity: 0.9 }}
                  />
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
                  toggleRepeat();
                }}
                className="w-[48px] h-[48px] items-center justify-center"
              >
                <RepeatIcon
                  size={24}
                  color={repeat ? '#FF6D1B' : subTextColor}
                />
              </TouchableOpacity>
            </View>

            <BlurView intensity={20} className="mt-8 rounded-[24px] overflow-hidden">
              <View
                className="flex-row items-center justify-between px-[24px] p-[12px]"
                style={{ borderColor: `${subTextColor}40` }}
              >
              <TouchableOpacity onPress={handleQueuePress}>
                <Queue02Icon size={32} color={subTextColor} />
              </TouchableOpacity>
                <TouchableOpacity onPress={handlePlaylistPress}>
                  <Playlist01Icon size={32} color={subTextColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSharePress}>
                  <Share05Icon size={32} color={subTextColor} />
                </TouchableOpacity>
              </View>
            </BlurView>



          </View>
        </ScrollView>
        <AddToPlaylistBottomSheet
      isVisible={isPlaylistSheetVisible}
      closeSheet={() => setIsPlaylistSheetVisible(false)}
      album={{
        _id: currentTrack?._id,
        tracks: [currentTrack],
      }}
    />
<Share
    isVisible={isShareModalVisible}
    onClose={() => setIsShareModalVisible(false)}
    album={{
      title: currentTrack?.title,
      artist: currentTrack?.artist?.name,
      image: currentTrack?.release?.artwork?.high,
      duration: progress.duration,
      type: 'track',
      id: currentTrack?._id,
      tracks: [currentTrack]
    }}
  />
      </SafeAreaView>
    );
  };

  export default NowPlaying;
