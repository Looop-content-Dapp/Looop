import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useAudioPlayer } from "expo-audio";
import ImageGrid from "../ImageGrid";
import Ellipse from "../Ellipse";
import VideoScreen from "../VideoScreen";
import AudioWaveform from "../animated/AudioWaveForm";

interface Media {
  type: "image" | "audio" | "video";
  thumbnail?: string[];
  audioWaveform?: string;
}

interface Engagement {
  plays: number;
  shares: number;
}

interface PostMediaProps {
  media: Media | null;
  engagement: Engagement;
}

// Separate component for audio handling
const AudioMedia: React.FC<{ uri: string; engagement: Engagement }> = ({ uri, engagement }) => {
  const player = useAudioPlayer({ uri });
  const [isAudioFinished, setIsAudioFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localIsPlaying, setLocalIsPlaying] = useState(false); // Add this line

  const handleAudioToggle = React.useCallback(() => {
    try {
      if (player.playing) {
        player.pause();
        setLocalIsPlaying(false); // Add this line
      } else {
        player.play();
        setLocalIsPlaying(true); // Add this line
      }
    } catch (err) {
      setError('Failed to control audio playback');
      console.error(err);
    }
  }, [player]);

  // Update local playing state when player state changes
  useEffect(() => {
    setLocalIsPlaying(player.playing);
  }, [player.playing]);

  const formatTime = React.useCallback((seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle audio completion and reset
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
          isPlaying={localIsPlaying} // Change this line
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: "#D2D3D5", fontSize: 10, fontWeight: "bold" }}>
              {engagement.plays} plays
            </Text>
            <Ellipse />
            <Text style={{ color: "#D2D3D5", fontSize: 10, fontWeight: "bold" }}>
              {engagement.shares} shares
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: "#D2D3D5", fontSize: 10, fontWeight: "bold" }}>
              Audio
            </Text>
            <Ellipse />
            <Text style={{ color: "#D2D3D5", fontSize: 10, fontWeight: "bold" }}>
              {formatTime(player.currentTime)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const PostMedia: React.FC<PostMediaProps> = ({ media, engagement }) => {
  if (!media) return null;

  if (media.type === "image" && media.thumbnail) {
    return <ImageGrid thumbnails={media.thumbnail} />;
  }

  if (media.type === "audio" && media.audioWaveform) {
    return <AudioMedia uri={media.audioWaveform} engagement={engagement} />;
  }

  if (media.type === "video") {
    return <VideoScreen />;
  }

  return null;
};

export default React.memo(PostMedia);
