import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useAudioPlayer } from "expo-audio";
import AudioWaveform from "../animated/AudioWaveForm";

interface AudioMediaProps {
  uri: string;
}

const AudioMedia: React.FC<AudioMediaProps> = ({ uri }) => {
  const player = useAudioPlayer({ uri });
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Add progress tracking effect
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isPlaying) {
      progressInterval = setInterval(() => {
        if (player.duration > 0) {
          setProgress(player.currentTime / player.duration);
        }
      }, 100); // Update every 100ms
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, player.currentTime, player.duration]);

  // Toggle play/pause
  const handleAudioToggle = React.useCallback(() => {
    try {
      if (player.playing) {
        player.pause();
        setIsPlaying(false);
      } else {
        player.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio toggle error:", error);
      // Optionally, set an error state to display to the user
    }
  }, [player]);

  // Sync local playing state with player state
  useEffect(() => {
    setIsPlaying(player.playing);
  }, [player.playing]);

  // Format time for display (e.g., "01:23")
  const formatTime = React.useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle audio completion
  useEffect(() => {
    if (
      player.duration > 0 &&
      player.currentTime >= player.duration &&
      !isAudioFinished
    ) {
      setIsAudioFinished(true);
      setIsPlaying(false);
      player.pause();
      player.seekTo(0);
      console.log("Audio playback completed");
    }
    if (player.playing && isAudioFinished) {
      setIsAudioFinished(false);
    }
  }, [player.currentTime, player.duration, player.playing, isAudioFinished]);

  // Cleanup audio player on unmount
//   useEffect(() => {
//     return () => {
//       player.remove();
//     };
//   }, [player]);

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
        progress={progress}
        onPlayPause={handleAudioToggle}
        onSeek={(position) => {
          if (player.duration > 0) {
            player.seekTo(position * player.duration);
            setProgress(position);
          }
        }}
        height={40}
        playButtonSize={35}
      />
      {/* Optional: Display current time and duration */}
      <Text style={{ color: "#fff", textAlign: "right", marginTop: 5 }}>
        {formatTime(player.currentTime)} / {formatTime(player.duration)}
      </Text>
    </View>
  );
};

export default AudioMedia;
