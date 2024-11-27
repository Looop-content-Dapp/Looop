import {
    View,
    Text,
    Pressable,
    Image,
    TouchableOpacity,
    ScrollView,
  } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import React, { useEffect } from 'react';
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
  import useMusicPlayer from '../hooks/useMusicPlayer';
import { useQuery } from '../hooks/useQuery';

  const NowPlaying = () => {
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
    } = useMusicPlayer();
    const { retrieveUserId, saveAlbum,likeSong}= useQuery()

    const [progress, setProgress] = React.useState(0);
    const [trackDuration] = React.useState(180); // 3 minutes in seconds
    const progressRef = React.useRef(progress);
    progressRef.current = progress;
    console.log("currentTrack", currentTrack)

    // const handleLikePress = async () => {
    //     try {
    //         const userId = await retrieveUserId();
    //         if (!userId) return;

    //         if (type === 'album') {
    //             await saveAlbum(userId, id as string);
    //             await likeSong(userId, id as string);
    //             setIsSaved(true);
    //             setIsLiked(true);
    //         } else {
    //             await likeSong(userId, id as string);
    //             setIsLiked(true);
    //         }
    //     } catch (error) {
    //         console.error("Error liking/saving:", error);
    //     }
    // };

    useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isPlaying) {
        interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 1) {
              clearInterval(interval);
              next(); // Automatically play next track
              return 0;
            }
            return prev + 0.01;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isPlaying, next]);

    // Reset progress when track changes
    useEffect(() => {
      setProgress(0);
    }, [currentTrack?._id]);

    const handlePrevious = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // If track has played for more than 3 seconds, restart it
      if (progressRef.current * trackDuration > 3) {
        setProgress(0);
      } else {
        previous();
      }
    };

    const togglePlayPause = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isPlaying) {
          pause();
        } else if (currentTrack) {
          play(currentTrack, albumInfo!);
        }
      };

    const handleNext = async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      next();
      setProgress(0); // Reset progress for new track
    };

    const formatTime = (progress: number) => {
      const totalSeconds = Math.floor(progress * trackDuration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <SafeAreaView style={{ flex: 1, minHeight: '100%' }} className="bg-black">
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View className='flex-row items-center justify-between px-[24px]'>
            <View className="flex-row items-center gap-x-[8px]">
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.goBack();
                }}
              >
                <ArrowLeft02Icon size={32} color='#fff' />
              </Pressable>
              <View>
                <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">Playing from</Text>
                <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansMedium overflow-x-hidden">"{albumTitle || albumInfo?.title}"</Text>
              </View>
            </View>
            <MoreHorizontalIcon color="#fff" />
          </View>

          <View className="relative">
            <Image
              source={{ uri: cover || albumInfo?.coverImage }}
              className='w-full h-[400px] mt-[19px]'
              resizeMode='cover'
            />
            <LinearGradient
              colors={['transparent', '#000000']}
              locations={[0.5, 1]}
              className="absolute bottom-0 z-40 w-full h-[400px]"
            />
          </View>

          <View className='px-[24px] my-[24px]'>
            <View className='flex-row items-center justify-between'>
              <View>
                <Text className='text-[24px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                  {currentTrack?.title}
                </Text>
                <Text className='text-[14px] font-PlusJakartaSansRegular text-[#D2D3D5]'>
                  {/* {currentTrack?.artist?.join(', ')} */}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <FavouriteIcon size={32} color='#787A80' />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View className="mt-">
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={1}
                value={progress}
                minimumTrackTintColor="#FF6D1B"
                maximumTrackTintColor="#4D4D4D"
                thumbTintColor="#FF6D1B"
                onValueChange={setProgress}
              />
              <View className="flex-row justify-between">
                <Text className="text-[#D2D3D5]">{formatTime(progress)}</Text>
                <Text className="text-[#D2D3D5]">3:00</Text>
              </View>
            </View>

            {/* Player Controls */}
            <View className="flex-row items-center justify-between mt-">
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleShuffleMode();
        }}
        className="w-[48px] h-[48px] items-center justify-center"
      >
        <ShuffleIcon size={24} color={shuffle ? "#FF6D1B" : "#D2D3D5"} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePrevious}
        className="w-[48px] h-[48px] items-center justify-center"
      >
        <Backward01Icon size={40} color="#fff" variant='solid' />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={togglePlayPause}
        className="bg-[#FAFBFB] w-[88px] h-[88px] rounded-full items-center justify-center"
      >
        {isPlaying ? (
          <PauseIcon size={40} color="#0A0B0F" variant='solid' />
        ) : (
          <PlayIcon size={40} color="#0A0B0F" fill="#fff" variant='solid' />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNext}
        className="w-[48px] h-[48px] items-center justify-center"
      >
        <NextIcon size={40} color="#fff" variant='solid' />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleRepeatMode();
        }}
        className="w-[48px] h-[48px] items-center justify-center"
      >
        <RepeatIcon size={24} color={repeat ? "#FF6D1B" : "#D2D3D5"} />
      </TouchableOpacity>
    </View>

            <View className='flex-row items-center justify-between px-[24px] border border-[#12141B] rounded-[24px] p-[12px] mt-[24px]'>
              <TouchableOpacity>
                <Queue02Icon size={32} color='#787A80'/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Playlist01Icon size={32} color='#787A80' />
              </TouchableOpacity>
              <TouchableOpacity>
                <Share05Icon size={32} color='#787A80' />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  export default NowPlaying;
