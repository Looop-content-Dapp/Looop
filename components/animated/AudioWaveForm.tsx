import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, GestureResponderEvent } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { PlayIcon, PauseIcon } from "@hugeicons/react-native";

interface WaveformProps {
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onSeek: (position: number) => void;
  barCount?: number;
  height?: number;
  barWidth?: number;
  barSpacing?: number;
  playedColor?: string;
  unplayedColor?: string;
  showPlayButton?: boolean;
  playButtonSize?: number;
  playButtonColor?: string;
}

const AudioWaveform: React.FC<WaveformProps> = ({
  isPlaying,
  progress,
  onPlayPause,
  onSeek,
  barCount = 100,
  height = 35,
  barWidth = 2,
  barSpacing = 0.9,
  playedColor = '#FFFFFF',
  unplayedColor = 'rgba(255, 255, 255, 0.24)',
  showPlayButton = true,
  playButtonSize = 40,
  playButtonColor = '#8D4FB4'
}) => {
  const [waveformBars, setWaveformBars] = useState<number[]>([]);

  useEffect(() => {
    const generateBars = () => {
      const bars: number[] = [];
      let prevHeight = Math.random() * 15 + 10;

      for (let i = 0; i < barCount; i++) {
        let newHeight = prevHeight + (Math.random() * 6 - 3);
        newHeight = Math.max(8, Math.min(25, newHeight));
        bars.push(newHeight);
        prevHeight = newHeight;
      }
      return bars;
    };

    setWaveformBars(generateBars());
  }, [barCount]);

  const handleSeek = (event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const containerWidth = barCount * (barWidth + barSpacing);
    const seekPosition = locationX / containerWidth;
    onSeek(Math.max(0, Math.min(1, seekPosition)));
  };

  const renderWaveformBars = () => {
    return waveformBars.map((barHeight, index) => {
      const progressPoint = progress * waveformBars.length;
      const isPlayed = index <= progressPoint;

      return (
        <Rect
          key={index}
          x={index * (barWidth + barSpacing)}
          y={(height - barHeight) / 2}
          width={barWidth}
          height={barHeight}
          fill={isPlayed ? playedColor : unplayedColor}
          rx="1"
        />
      );
    });
  };

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    }}>
      {showPlayButton && (
        <TouchableOpacity
          onPress={onPlayPause}
          style={{
            backgroundColor: playButtonColor,
            width: playButtonSize,
            height: playButtonSize,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: playButtonSize / 2,
          }}
        >
          {isPlaying ? (
            <PauseIcon size={Math.floor(playButtonSize * 0.6)} color="#fff" variant="solid" />
          ) : (
            <PlayIcon size={Math.floor(playButtonSize * 0.6)} color="#fff" variant="solid" />
          )}
        </TouchableOpacity>
      )}

      <View style={{ flex: 1, marginLeft: showPlayButton ? 10 : 0 }}>
        <Svg
          height={height}
          width="100%"
          onStartShouldSetResponder={() => true}
          onResponderGrant={handleSeek}
        >
          {renderWaveformBars()}
        </Svg>
      </View>
    </View>
  );
};

export default AudioWaveform;
