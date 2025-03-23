import { PlayIcon, PauseIcon, VolumeOffIcon, VolumeUpIcon } from '@hugeicons/react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Animated,
  PanResponder,
} from 'react-native';

interface VideoScreenProps {
  videoUrl: string;
}

export default function VideoScreen({ videoUrl }: VideoScreenProps) {
  const videoRef = useRef<Video>(null);
  // Replace videoSource with:
  const videoSource = {
    uri: videoUrl 
  };
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [lastTap, setLastTap] = useState(0);
  const [seekingPosition, setSeekingPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const hideControlsTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, []);

  const formatTime = (timeInMillis: number) => {
    const totalSeconds = Math.floor(timeInMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const showControls = () => {
    setIsControlsVisible(true);
    Animated.timing(controlsOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
  };

  const hideControls = () => {
    // Don't hide controls if user is interacting or video is paused
    if (isUserInteracting || !isPlaying) return;

    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsControlsVisible(false));
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    if (isPlaying && !isUserInteracting) {
      hideControlsTimer.current = setTimeout(hideControls, 3000);
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis);
      setDuration(status.durationMillis ?? 0);

      if (status.isPlaying && !isUserInteracting) {
        resetHideControlsTimer();
      }
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsUserInteracting(true);
      setIsSeeking(true);
      showControls();
    },
    onPanResponderMove: (_, gestureState) => {
      const percent = Math.max(0, Math.min(1, gestureState.moveX / SCREEN_WIDTH));
      const newPosition = duration * percent;
      setSeekingPosition(newPosition);
    },
    onPanResponderRelease: async () => {
      setIsSeeking(false);
      setIsUserInteracting(false);
      if (videoRef.current) {
        await videoRef.current.setPositionAsync(seekingPosition);
      }
      resetHideControlsTimer();
    },
  });

  const handleVideoPress = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    showControls();
    resetHideControlsTimer();
  };

  const handleControlPress = () => {
    setIsUserInteracting(true);
    showControls();
  };

  const handleControlPressEnd = () => {
    setIsUserInteracting(false);
    resetHideControlsTimer();
  };

  const handleDoubleTap = (event: any) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const seekAmount = 10000; // 10 seconds

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      const tapX = event.nativeEvent.locationX;

      if (tapX < SCREEN_WIDTH / 2) {
        if (videoRef.current) {
          videoRef.current.setPositionAsync(Math.max(0, position - seekAmount));
        }
      } else {
        if (videoRef.current) {
          videoRef.current.setPositionAsync(Math.min(duration, position + seekAmount));
        }
      }
    }
    setLastTap(now);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Prevent hiding controls when toggling mute
    showControls();
    resetHideControlsTimer();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleVideoPress}
        style={styles.videoContainer}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={videoSource}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping
          isMuted={isMuted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        <Pressable
          style={styles.doubleTapArea}
          onPress={handleDoubleTap}
        />

        {isControlsVisible && (
          <Animated.View
            style={[styles.controls, { opacity: controlsOpacity }]}
            onTouchStart={handleControlPress}
            onTouchEnd={handleControlPressEnd}
          >
            <View style={styles.centerControlsContainer}>
              {!isPlaying && (
                <Pressable
                  style={styles.playButton}
                  onPress={handleVideoPress}
                  onPressIn={handleControlPress}
                  onPressOut={handleControlPressEnd}
                  hitSlop={20}
                >
                  <PlayIcon size={64} color="#fff" />
                </Pressable>
              )}
            </View>

            <View style={styles.bottomControls}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {formatTime(position)} / {formatTime(duration)}
                </Text>
                <Pressable
                  style={styles.muteButton}
                  onPress={toggleMute}
                  onPressIn={handleControlPress}
                  onPressOut={handleControlPressEnd}
                  hitSlop={20}
                >
                  {isMuted ? (
                    <VolumeOffIcon size={24} color="#fff" />
                  ) : (
                    <VolumeUpIcon size={24} color="#fff" />
                  )}
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300,
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  centerControlsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
  },
  bottomControls: {
    padding: 10,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  progressContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DA1F2',
    borderRadius: 1.5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  muteButton: {
    padding: 5,
  },
  doubleTapArea: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
});
