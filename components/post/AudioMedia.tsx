import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import TrackPlayer, { useProgress, State, usePlaybackState } from 'react-native-track-player';
import AudioWaveform from "../animated/AudioWaveForm";

interface AudioMediaProps {
  uri: string;
}

const AudioMedia: React.FC<AudioMediaProps> = ({ uri }) => {
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    setupAudio();
    return () => {
      // Cleanup
      TrackPlayer.reset();
    };
  }, [uri]);

  const setupAudio = async () => {
    try {
      await TrackPlayer.add({
        url: uri,
        title: 'Audio Post',
        artist: 'User',
      });
    } catch (error) {
      console.error("Error setting up audio:", error);
    }
  };

  // Toggle play/pause
  const handleAudioToggle = React.useCallback(async () => {
    try {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
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
    setIsPlaying(playbackState === State.Playing);
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
