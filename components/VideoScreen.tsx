import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { PlayIcon, VolumeOffIcon, VolumeUpIcon } from '@hugeicons/react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function VideoScreen({ videoUrl }) {
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
  });

  const videoViewRef = useRef(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimer = useRef(null);

  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    player.muted = isMuted;
    const statusListener = player.addListener('statusChange', ({ status }) => {
      if (status === 'readyToPlay') setDuration(player.duration || 0);
    });
    const timeListener = player.addListener('timeUpdate', ({ currentTime }) => {
      setPosition(currentTime);
    });
    return () => {
      statusListener.remove();
      timeListener.remove();
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [player, isMuted]);

  const formatTime = (timeInSeconds) => {
    const totalSeconds = Math.floor(timeInSeconds);
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
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
  };

  const hideControls = () => {
    if (isUserInteracting || !player.playing) return;
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsControlsVisible(false));
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (player.playing && !isUserInteracting) {
      hideControlsTimer.current = setTimeout(hideControls, 3000);
    }
  };

  const enterFullScreen = async () => {
    if (videoViewRef.current) await videoViewRef.current.enterFullscreen();
  };

  const exitFullScreen = async () => {
    if (videoViewRef.current) await videoViewRef.current.exitFullscreen();
  };

  const toggleFullScreen = async () => {
    if (isFullScreen) await exitFullScreen();
    else await enterFullScreen();
  };

  const handleVideoPress = async () => {
    if (!isFullScreen) {
      await enterFullScreen();
      player.play();
      showControls();
    }
    resetHideControlsTimer();
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
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

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      setIsUserInteracting(true);
      showControls();
    },
    onPanResponderMove: (_, gestureState) => {
      const percent = Math.max(0, Math.min(1, gestureState.moveX / SCREEN_WIDTH));
      player.currentTime = duration * percent;
    },
    onPanResponderRelease: (_, gestureState) => {
      setIsUserInteracting(false);
      if (isFullScreen && gestureState.dy > 100) exitFullScreen();
      resetHideControlsTimer();
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer} {...panResponder.panHandlers}>
        <VideoView
          ref={videoViewRef}
          player={player}
          style={styles.video}
          nativeControls={isFullScreen}
          contentFit="cover"
          onFullscreenEnter={() => setIsFullScreen(true)}
          onFullscreenExit={() => setIsFullScreen(false)}
        />
        {!isFullScreen && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleVideoPress} />
        )}
        {isControlsVisible && !isFullScreen && (
          <Animated.View
            style={[styles.controls, { opacity: controlsOpacity }]}
            onTouchStart={handleControlPress}
            onTouchEnd={handleControlPressEnd}
          >
            <View style={styles.centerControlsContainer}>
              {!player.playing && (
                <Pressable
                  style={styles.playButton}
                  onPress={handleVideoPress}
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
                <Pressable style={styles.muteButton} onPress={toggleMute} hitSlop={20}>
                  {isMuted ? (
                    <VolumeOffIcon size={24} color="#fff" />
                  ) : (
                    <VolumeUpIcon size={24} color="#fff" />
                  )}
                </Pressable>
                <Pressable
                  style={styles.fullScreenButton}
                  onPress={toggleFullScreen}
                  hitSlop={20}
                >
                  <Text style={styles.fullScreenText}>
                    {isFullScreen ? 'Exit FS' : 'FS'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
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
  },
  bottomControls: {
    padding: 10,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  muteButton: {
    padding: 5,
  },
  fullScreenButton: {
    padding: 5,
  },
  fullScreenText: {
    color: '#fff',
    fontSize: 24,
  },
});
