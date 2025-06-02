import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import TrackPlayer, {
  useProgress,
  State,
  usePlaybackState,
  Event,
  Track
} from 'react-native-track-player';
import AudioWaveform from "../animated/AudioWaveForm";

interface AudioMediaProps {
  uri: string;
}

const AudioMedia: React.FC<AudioMediaProps> = ({ uri }) => {
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState<number | null>(null);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    const setup = async () => {
      try {
        // Check if the current track is already playing this URI
        const queue = await TrackPlayer.getQueue();
        const currentTrack = queue.find(track => track.url === uri);

        if (!currentTrack) {
          const index = await TrackPlayer.add({
            url: uri,
            title: 'Audio Post',
            artist: 'User',
          });
          setTrackIndex(index);
        }
      } catch (error) {
        console.error("Error setting up audio:", error);
      }
    };

    setup();

    // Only cleanup when component is unmounted completely, not on tab changes
    return () => {
      // Do nothing on cleanup to maintain playback between tab navigation
    };
  }, [uri]);

  const handleAudioToggle = React.useCallback(async () => {
    try {
      const playerState = await TrackPlayer.getState();
      if (playerState === State.Playing) {
        await TrackPlayer.pause();
        setIsPlaying(false);
      } else {
        await TrackPlayer.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio toggle error:", error);
    }
  }, []);

  // Sync playing state with TrackPlayer state
  useEffect(() => {
    const state = playbackState.state;
    setIsPlaying(state === State.Playing);
  }, [playbackState]);

  // Format time for display (e.g., "01:23")
  const formatTime = React.useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle audio completion
  useEffect(() => {
    if (progress.position >= progress.duration && progress.duration > 0 && !isAudioFinished) {
      setIsAudioFinished(true);
      setIsPlaying(false);
      TrackPlayer.seekTo(0);
    }
    if (playbackState === State.Playing && isAudioFinished) {
      setIsAudioFinished(false);
    }
  }, [progress.position, progress.duration, playbackState, isAudioFinished]);

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#0A0B0F",
      }}
    >
      <AudioWaveform
        isPlaying={isPlaying}
        progress={progress.duration > 0 ? progress.position / progress.duration : 0}
        onPlayPause={handleAudioToggle}
        onSeek={async (position) => {
          if (progress.duration > 0) {
            await TrackPlayer.seekTo(position * progress.duration);
          }
        }}
        height={40}
        playButtonSize={35}
      />
      <Text style={{ color: "#fff", textAlign: "right", marginTop: 5 }}>
        {formatTime(progress.position)} / {formatTime(progress.duration)}
      </Text>
    </View>
  );
};

export default AudioMedia;
