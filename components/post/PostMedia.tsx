import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    GestureResponderEvent,
    Animated,
} from "react-native";
import { PlayIcon, PauseIcon } from "@hugeicons/react-native";
import { Audio } from "expo-av";
import Svg, { Rect } from "react-native-svg";
import ImageGrid from "../ImageGrid";
import Ellipse from "../Ellipse";
import VideoScreen from "../VideoScreen";
import AudioWaveform from "../animated/AudioWaveForm";

interface Media {
    type: "image" | "audio" | "video";
    thumbnail?: string[];
    audioPath?: string;
}

interface Engagement {
    plays: number;
    shares: number;
}

interface PostMediaProps {
    media: Media | null;
    engagement: Engagement;
}

const PostMedia: React.FC<PostMediaProps> = ({ media, engagement }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const progressAnimation = React.useRef(new Animated.Value(0)).current;
    const [waveformBars, setWaveformBars] = useState<number[]>([]);

    // Generate waveform bars with varying heights
    useEffect(() => {
        const generateBars = () => {
            const totalBars = 100;
            const bars: number[] = [];
            let prevHeight = Math.random() * 15 + 10; // Start with a random height

            for (let i = 0; i < totalBars; i++) {
                // Generate a new height that's not too different from the previous one
                let newHeight = prevHeight + (Math.random() * 6 - 3); // Add/subtract up to 3px
                // Keep height within bounds
                newHeight = Math.max(8, Math.min(25, newHeight));
                bars.push(newHeight);
                prevHeight = newHeight;
            }
            return bars;
        };

        setWaveformBars(generateBars());
    }, []);

    const handleAudioToggle = async () => {
        if (!isLoaded) {
            try {
                console.log("Loading Sound");
                const { sound, status } = await Audio.Sound.createAsync(
                    require("/Users/macbook/Desktop/LOOOP_OFFICIAL/assets/audio/Zinoleesky-Ft.-Naira-Marley---Abanikanda.mp3"),
                    { shouldPlay: true, isLooping: true },
                    onPlaybackStatusUpdate
                );
                setSound(sound);
                if (status.isLoaded) {
                    setIsLoaded(true);
                    setDuration(status.durationMillis || 0);
                }
            } catch (error) {
                console.error("Error loading audio:", error);
            }
        } else {
            if (isPlaying) {
                await sound?.pauseAsync();
            } else {
                await sound?.playAsync();
            }
        }
    };

    const onPlaybackStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            const newProgress = status.positionMillis / (status.durationMillis || 1);
            setProgress(newProgress);
            setIsPlaying(status.isPlaying);

            // Smooth animation for progress updates
            Animated.timing(progressAnimation, {
                toValue: newProgress,
                duration: 100,
                useNativeDriver: false,
            }).start();
        }
    };

    const handleSeek = async (event: GestureResponderEvent) => {
        if (!sound || !duration) return;
        const { locationX } = event.nativeEvent;
        const containerWidth = 300; // Adjust based on your layout
        const seekPosition = (locationX / containerWidth) * duration;
        await sound.setPositionAsync(seekPosition);
        setProgress(seekPosition / duration);
    };

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: false,
        });

        return () => {
            sound?.unloadAsync();
        };
    }, []);

    // Render waveform bars with gradient progress
    const renderWaveformBars = () => {
        const barWidth = 3;
        const spacing = 0.2;
        const containerHeight = 35;

        return waveformBars.map((height, index) => {
            // Calculate a gradual color transition around the progress point
            const progressPoint = progress * waveformBars.length;
            const distanceFromProgress = Math.abs(index - progressPoint);
            const transitionWidth = 8;

            let opacity = 1;
            if (index < progressPoint) {
                opacity = 1;
            } else if (index - progressPoint <= transitionWidth) {
                opacity = 1 - ((index - progressPoint) / transitionWidth);
            } else {
                opacity = 0;
            }

            return (
                <Rect
                    key={index}
                    x={index * (barWidth + spacing)}
                    y={(containerHeight - height) / 2}
                    width={barWidth}
                    height={height}
                    fill={`rgba(255, 255, 255, ${index <= progressPoint ? 1 : 0.24})`}
                    rx="1"
                />
            );
        });
    };

    if (!media) return null;

    if (media.type === "image" && media.thumbnail) {
        return <ImageGrid thumbnails={media.thumbnail} />;
    }

    if (media.type === "audio") {
        return (
            <View style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#0A0B0F",
            }}>
                <View style={{ height: 50, marginBottom: 10 }}>
                <AudioWaveform
            isPlaying={isPlaying}
           progress={progress}
         onPlayPause={handleAudioToggle}
  onSeek={(position) => {
    if (sound && duration) {
      const seekPosition = position * duration;
      sound.setPositionAsync(seekPosition);
      setProgress(position);
    }
  }}
/>

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}>
                        <Text style={{
                            color: "#D2D3D5",
                            fontSize: 10,
                            fontWeight: "bold",
                        }}>
                            Audio
                        </Text>
                        <Ellipse />
                        <Text style={{
                            color: "#D2D3D5",
                            fontSize: 10,
                            fontWeight: "bold",
                        }}>
                            {new Date(progress * duration).toISOString().slice(14, 19)}
                        </Text>
                    </View>
                </View>

                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                }}>
                    <Text style={{
                        color: "#D2D3D5",
                        fontSize: 10,
                        fontWeight: "bold",
                    }}>
                        {engagement?.plays} plays
                    </Text>
                    <Ellipse />
                    <Text style={{
                        color: "#D2D3D5",
                        fontSize: 10,
                        fontWeight: "bold",
                    }}>
                        {engagement?.shares} shares
                    </Text>
                </View>
            </View>
        );
    }

    if (media.type === "video") {
        return <VideoScreen />;
    }

    return null;
};

export default PostMedia;
