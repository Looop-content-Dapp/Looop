import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useAudioPlayer } from "expo-audio";
import AudioWaveform from "../animated/AudioWaveForm";

interface AudioMediaProps {
  uri: string;
}

const AudioMedia: React.FC<AudioMediaProps> = ({ uri }) => {
  const player = useAudioPlayer({ uri });
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [localIsPlaying, setLocalIsPlaying] = useState(false);

  const handleAudioToggle = React.useCallback(() => {
    try {
      if (player.playing) {
        player.pause();
        setLocalIsPlaying(false);
      } else {
        player.play();
        setLocalIsPlaying(true);
      }
    } catch (err) {
    //   setError('Failed to control audio playback');
      console.error(err);
    }
  }, [player]);

  useEffect(() => {
    setLocalIsPlaying(player.playing);
  }, [player.playing]);

  const formatTime = React.useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (player.duration > 0 && player.currentTime >= player.duration && !isAudioFinished) {
      setIsAudioFinished(true);
      player.pause();
      player.seekTo(0);
      console.log("Audio playback completed");
    }
    if (player.playing && isAudioFinished) {
      setIsAudioFinished(false);
    }
  }, [player.currentTime, player.duration, player.playing, isAudioFinished]);

  return (
    <View style={{ padding: 10, borderRadius: 10, backgroundColor: "#0A0B0F" }}>
      <View style={{ flex: 1 }}>
        <AudioWaveform
          isPlaying={localIsPlaying}
          progress={player.duration > 0 ? player.currentTime / player.duration : 0}
          onPlayPause={handleAudioToggle}
          onSeek={(position) => {
            if (player.duration > 0) {
              player.seekTo(position * player.duration);
            }
          }}
          height={40}
          playButtonSize={35}
        />
      </View>
    </View>
  );
};

export default AudioMedia;
