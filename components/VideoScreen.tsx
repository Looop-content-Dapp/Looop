import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { PlayIcon, VolumeOffIcon, VolumeUpIcon } from '@hugeicons/react-native';
import Video, {
  VideoRef,
  OnLoadData,
  OnProgressData,
  OnSeekData,
  OnBufferData,
  OnAudioFocusChangedData,
  OnVideoErrorData,
  OnVideoAspectRatioData,
  OnPlaybackRateChangeData,
  OnPlaybackStateChangedData,
  ResizeMode,
} from 'react-native-video';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function VideoScreen({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<VideoRef>(null);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // Video state
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  const formatTime = (timeInSeconds: number): string => {
    const totalSeconds = Math.floor(timeInSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    setPaused(!paused);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullScreen = async () => {
    if (!videoRef.current) return;
    if (isFullScreen) {
       videoRef.current.dismissFullscreenPlayer();
    } else {
      videoRef.current.presentFullscreenPlayer();
    }
  };

  const handleVideoPress = () => {
    toggleFullScreen();
    togglePlay();
    if (!isFullScreen) {

      showControls();
    }
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

  // Event handlers
  const onLoad = (data: OnLoadData) => {
    console.log('Video loaded:', data);
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onProgress = (data: OnProgressData) => {
    setPosition(data.currentTime);
  };

  const onSeek = (data: OnSeekData) => {
    setPosition(data.currentTime);
  };

  const onVideoBuffer = (param: OnBufferData) => {
    setIsLoading(param.isBuffering);
  };

  const onAspectRatio = (data: OnVideoAspectRatioData) => {
    setVideoSize({ width: data.width, height: data.height });
  };

  const onAudioBecomingNoisy = () => {
    setPaused(true);
  };

  const onAudioFocusChanged = (event: OnAudioFocusChangedData) => {
    setPaused(!event.hasAudioFocus);
  };

  const onError = (err: OnVideoErrorData) => {
    console.error('Video Error:', err);
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
    if (isUserInteracting || paused) return;
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsControlsVisible(false));
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (!paused && !isUserInteracting) {
      hideControlsTimer.current = setTimeout(hideControls, 3000);
    }
  };

  // Add pan responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsUserInteracting(true);
        showControls();
      },
      onPanResponderMove: (_, gestureState) => {
        const percent = Math.max(0, Math.min(1, gestureState.moveX / SCREEN_WIDTH));
        if (videoRef.current) {
          videoRef.current.seek(duration * percent);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsUserInteracting(false);
        if (isFullScreen && gestureState.dy > 100) {
          videoRef.current?.dismissFullscreenPlayer();
        }
        resetHideControlsTimer();
      },
    })
  ).current;

  // Update the JSX to use paused instead of isPlaying
  return (
    <View style={styles.container}>
      <View style={styles.videoContainer} {...panResponder.panHandlers}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          paused={paused}
          muted={muted}
          onLoad={onLoad}
          onProgress={onProgress}
          onSeek={onSeek}
          onBuffer={onVideoBuffer}
          onAspectRatio={onAspectRatio}
          onAudioBecomingNoisy={() => setPaused(true)}
          onAudioFocusChanged={(event) => setPaused(!event.hasAudioFocus)}
          onError={onError}
          onEnd={() => setPaused(true)}
          controls={false}
          repeat={true}
          playInBackground={false}
          playWhenInactive={false}
          ignoreSilentSwitch="ignore"
          preventsDisplaySleepDuringVideoPlayback={true}
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
              {paused && (
                <Pressable
                  style={styles.playButton}
                  onPress={togglePlay}
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
                  {muted ? (
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
    width: '100%',
    aspectRatio: 16 / 9,  // Match the video's aspect ratio (2560/1440 ≈ 16/9)
    backgroundColor: '#000',
    position: 'relative',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
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
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
