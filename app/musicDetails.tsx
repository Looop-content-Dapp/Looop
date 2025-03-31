import React, { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft02Icon,
  FavouriteIcon,
  Playlist01Icon,
  ShuffleIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
} from "@hugeicons/react-native";
import { Skeleton } from "moti/skeleton";
import * as ImageCache from 'react-native-expo-image-cache';
import * as Haptics from 'expo-haptics';
import Share from '../components/bottomSheet/Share';
import { useRef } from 'react';
import { useTracksByMusic } from "@/hooks/useTracksByMusic";
import useMusicPlayer from "../hooks/useMusicPlayer";
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";

interface Track {
  _id: string;
  title: string;
  duration: number;
  songData: { _id: string; fileUrl: string; duration: number };
  artist: { name: string; image: string };
  release: { artwork: { high: string; medium: string; low: string; thumbnail: string } };
}

interface AlbumInfo {
  title: string;
  type: "album" | "single" | "ep" | "track";
  coverImage: string;
}

interface ExtendedTrack extends Track {
  streams: number;
  track_number: number;
}

const MusicDetails = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<ExtendedTrack[]>([]);
  const [description, setDescription] = useState({
    text: "Vultures 2 is the second studio album by the sensational hiphop duo ¥$...",
    isTruncated: true,
  });

  const { width } = useWindowDimensions();
  const shareBottomSheetRef = useRef(null);
  const { id, title, artist, image, type, duration } = useLocalSearchParams();

  const { data: tracksData, isLoading: tracksLoading } = useTracksByMusic(
    id as string,
    type === 'track' ? 'track' : 'release'
  );

  const {
    isPlaying,
    currentTrack,
    currentTrackId,
    isLiked,
    shuffle,
    loading: playerLoading,
    play,
    pause,
    handleLike,
    toggleShuffle,
    loadAlbumData,
    stop
  } = useMusicPlayerContext();

  const isLoading = useMemo(() => playerLoading || tracksLoading, [playerLoading, tracksLoading]);

  const albumInfo = useMemo<AlbumInfo>(() => ({
    title: title as string,
    type: type as "album" | "single" | "ep" | "track",
    coverImage: image as string,
  }), [title, type, image]);

  const isCurrentAlbumPlaying = isPlaying && currentTrack && tracks.some(t => t._id === currentTrack._id);

  useEffect(() => {
    if (tracksData?.data?.tracks) {
      const newTracks = tracksData.data.tracks as ExtendedTrack[];
      setTracks(newTracks);
      if (type === 'track' && newTracks.length === 1) {
        const track = newTracks[0];
        albumInfo.title = track.title;
        albumInfo.coverImage = track.release.artwork.high;
      }
    }
    loadAlbumData(id as string, type as string);
  }, [tracksData, id, type, loadAlbumData, albumInfo]);

  const toggleTruncate = useCallback(() => {
    setDescription(prev => ({ ...prev, isTruncated: !prev.isTruncated }));
  }, []);

  const truncatedText = useMemo(() => {
    return description.text.length > 100
      ? `${description.text.substring(0, 130)}...`
      : description.text;
  }, [description.text]);

 // Update handleTrackPress function
const handleTrackPress = useCallback(async (track: ExtendedTrack, index: number) => {
    try {
      if (!tracks) return;

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Handle same track toggle
      if (currentTrack?._id === track._id) {
        if (isPlaying) {
          await pause();
        } else {
          await play(track, albumInfo, tracks);
        }
        return;
      }

      // Play new track
      await play(track, albumInfo, tracks);
    } catch (error) {
      console.error("Error handling track press:", error);
    }
  }, [tracks, play, pause, currentTrack, albumInfo, isPlaying]);

  // Update handlePlayPause function
  const handlePlayPause = useCallback(async () => {
    try {
      if (!tracks?.length) return;

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isCurrentAlbumPlaying) {
        await pause();
      } else {
        await play(tracks[0], albumInfo, tracks);
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  }, [isCurrentAlbumPlaying, tracks, albumInfo, play, pause]);

  const handleTrackMenuPress = useCallback((track: Track) => {
    setSelectedTrack(track);
    shareBottomSheetRef.current?.expand();
  }, []);

  const convertSecondsToMinutes = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return remainingSeconds === 0
      ? `${minutes}min`
      : `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const Spacer = useCallback(({ size = 16 }) => <View style={{ height: size }} />, []);

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft02Icon size={32} color="#D2D3D5" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Album Image */}
          <View style={styles.contentWrapper}>
            <ImageCache.Image
              uri={type === 'track' && tracks[0] ? tracks[0].release.artwork.high : (image as string)}
              style={[styles.albumImage, { width: width * 0.4, height: width * 0.4 }]}
              tint="dark"
            />
            {isLoading && (
              <View style={styles.skeletonWrapper}>
                <Skeleton colorMode="dark" width={width * 0.4} height={width * 0.4} radius={15} />
              </View>
            )}
          </View>

          <Spacer />

          {/* Title */}
          <View style={styles.contentWrapper}>
            <Text
              style={[styles.title, { fontSize: width * 0.06, maxWidth: width * 0.8 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text
              className="text-[12px] font-PlusJakartaSansBold text-Grey/06"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ maxWidth: width * 0.8 }}
            >
              ¥$, Ye & Ty Dolla Sign
            </Text>
          </View>

          <Spacer />

          {/* Controls */}
          <View style={styles.controlsContainer}>
            {[
              { Icon: Playlist01Icon, size: 48 },
              {
                Icon: FavouriteIcon,
                size: 48,
                active: isLiked,
                onPress: () => handleLike(id as string, type as string),
              },
              {
                Icon: isCurrentAlbumPlaying ? PauseIcon : PlayIcon,
                size: 64,
                isPlay: true,
                onPress: handlePlayPause,
              },
              {
                Icon: ShuffleIcon,
                size: 48,
                active: shuffle,
                onPress: toggleShuffle,
              },
              {
                Icon: MoreHorizontalIcon,
                size: 48,
                onPress: () => shareBottomSheetRef.current?.expand(),
              },
            ].map((control, index) => (
              <View key={index} style={styles.contentWrapper}>
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    control.isPlay && styles.playButton,
                    control.active && styles.activeButton,
                  ]}
                  onPress={control.onPress}
                >
                  <control.Icon
                    size={control.isPlay ? 32 : 24}
                    color="#fff"
                    variant={control.active ? "solid" : "stroke"}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.contentWrapper}>
            <View className="items-center justify-center gap-y-[16px]">
              <View className="flex-row items-center">
                <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                  {tracks?.length} Songs
                </Text>
                <Pressable className="bg-Grey/06 h-[4px] w-[4px] m-[4px] font-normal" />
                <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                  {convertSecondsToMinutes(Number(duration))} mins
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-[#fff] text-[14px] font-PlusJakartaSansRegular font-normal">
                  {description.isTruncated ? truncatedText : description.text}
                </Text>
                <Pressable onPress={toggleTruncate}>
                  <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansRegular font-normal">
                    {description.isTruncated ? "See More" : "See Less"}
                  </Text>
                </Pressable>
              </View>
            </View>
            {isLoading && (
              <View style={styles.skeletonWrapper}>
                <Skeleton colorMode="dark" width={width * 0.9} height={54} radius={4} />
                <Skeleton colorMode="dark" width={width * 0.9} height={54} radius={4} />
              </View>
            )}
          </View>

          <Spacer />

          {/* Track List */}
          <View style={styles.trackListContainer}>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <View key={index} style={styles.skeletonWrapper}>
                  {/* <Skeleton colorMode="dark" width="100%" height={60} radius={4} /> */}
                </View>
              ))
            ) : (
              tracks?.map((track, index) => (
                <View key={track._id}>
                  <TouchableOpacity
                    onPress={() => handleTrackPress(track, index)}
                    className="flex-row items-center justify-between py-3"
                  >
                    <View className="flex-row items-center flex-1 mr-4">
                      <View style={{ flex: 1 }}>
                        <Text
                          className={`text-[16px] font-PlusJakartaSansBold ${
                            currentTrackId === track._id ? "text-Orange/08" : "text-[#fff]"
                          }`}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {track.title}
                        </Text>
                        <Text
                          className="text-[12px] font-PlusJakartaSansBold text-Grey/06"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {track.artist.name}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleTrackMenuPress(track)}>
                      <MoreHorizontalIcon size={24} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </ScrollView>


      <Share
        ref={shareBottomSheetRef}
        album={{
          title: selectedTrack ? selectedTrack.title : (title as string),
          artist: selectedTrack ? selectedTrack.artist.name : (artist as string),
          image: selectedTrack ? selectedTrack.release.artwork.high : (image as string),
          type: type as string,
          duration: convertSecondsToMinutes(selectedTrack ? selectedTrack.duration : Number(duration)),
          id: selectedTrack ? selectedTrack._id : (id as string),
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { position: "relative", alignItems: "center" },
  skeletonWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  scrollViewContent: { alignItems: "center", paddingHorizontal: 24, paddingBottom: 26 },
  albumImage: { borderRadius: 15 },
  title: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 12,
  },
  iconButton: {
    backgroundColor: "#12141B",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: { backgroundColor: "#FF6D1B", width: 64, height: 64, borderRadius: 32 },
  activeButton: { backgroundColor: "#FF6D1B" },
  trackListContainer: { width: "100%", marginTop: 24 },
});

export default MusicDetails;
