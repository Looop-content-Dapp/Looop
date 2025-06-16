import AddToPlaylistBottomSheet from "@/components/bottomSheet/AddToPlaylistBottomSheet";
import Share from "@/components/bottomSheet/Share";
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import { useTracksByMusic } from "@/hooks/music/useTracksByMusic";
import type { AlbumInfo, Artist, ExtendedTrack } from "@/types/player";
import { Track } from "@/utils/types";
import { Portal } from "@gorhom/portal";
import {
  ArrowLeft02Icon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  Playlist01Icon,
  ShuffleIcon,
  VideoReplayIcon,
} from "@hugeicons/react-native";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";

// ### Component Definition
const MusicDetails = () => {
  const [selectedTrack, setSelectedTrack] = useState<ExtendedTrack | null>(
    null
  );
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);

  // Add ref for the playlist bottom sheet
  const playlistBottomSheetRef = useRef(null);

  const handleClosePlaylistSheet = useCallback(() => {
    setIsPlaylistModalVisible(false);
  }, []);

  // Get releaseId from params
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const shareBottomSheetRef = useRef(null);

  // Use the hook to fetch release data
  const { data: releaseData, isLoading: releaseLoading } = useTracksByMusic(
    id as string
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
    buffering,
  } = useMusicPlayerContext();

  // Add a ref to track the last loaded album
  const lastLoadedAlbum = useRef<{ id: string; type: string } | null>(null);

  // ### Memoized Values
  const isLoading = useMemo(
    () => releaseLoading || playerLoading,
    [releaseLoading, playerLoading]
  );

  // Helper to map API track to ExtendedTrack if needed
  const toExtendedTrack = (track: any): ExtendedTrack => ({
    _id: track._id,
    title: track.title,
    artist: track.artist as Artist,
    songData: track.songData,
    release: track.release,
    releaseImage: track.releaseImage,
    genre: track.genre,
    bpm: track.bpm,
    key: track.key,
    isExplicit: track.isExplicit,
    lyrics: track.lyrics,
  });

  const releaseInfo = useMemo(() => {
    if (!releaseData) return null;
    if ("tracks" in releaseData) {
      return {
        _id: releaseData._id,
        title: releaseData.title,
        type: releaseData.type,
        coverImage: releaseData.artwork.high,
        artist: releaseData.artist as Artist,
        totalTracks: releaseData.metadata?.totalTracks,
        tracks: (releaseData.tracks as any[]).map(toExtendedTrack),
        genre: releaseData.metadata?.genre,
        label: releaseData.metadata?.label,
        duration: releaseData.metadata?.duration,
      } as AlbumInfo & {
        tracks: ExtendedTrack[];
        genre?: string[];
        label?: string;
        duration?: number;
      };
    } else {
      return {
        _id: releaseData._id,
        title: releaseData.title,
        type: "single",
        coverImage: releaseData.release.artwork.high,
        artist: releaseData.artist as Artist,
        totalTracks: 1,
        tracks: [toExtendedTrack(releaseData)],
        genre: [],
        label: "",
        duration: releaseData.duration,
      } as AlbumInfo & {
        tracks: ExtendedTrack[];
        genre?: string[];
        label?: string;
        duration?: number;
      };
    }
  }, [releaseData]);

  const isCurrentAlbumPlaying =
    isPlaying &&
    currentTrack &&
    releaseInfo?.tracks.some((t) => t._id === currentTrack._id);

  // ### Effects
  useEffect(() => {
    if (
      releaseInfo &&
      (!lastLoadedAlbum.current ||
        lastLoadedAlbum.current.id !== releaseInfo._id ||
        lastLoadedAlbum.current.type !== releaseInfo.type)
    ) {
      loadAlbumData(releaseInfo._id, releaseInfo.type);
      lastLoadedAlbum.current = { id: releaseInfo._id, type: releaseInfo.type };
    }
  }, [releaseInfo, loadAlbumData]);

  const handleTrackPress = async (track: ExtendedTrack) => {
    try {
      if (!releaseInfo?.tracks) return;
      if (currentTrack?._id === track._id) {
        if (isPlaying) {
          await pause();
        } else {
          await play(track, releaseInfo, releaseInfo.tracks);
        }
        return;
      }
      await play(track, releaseInfo, releaseInfo.tracks);
    } catch (error) {
      console.error("Error handling track press:", error);
    }
  };

  const handlePlayPause = async () => {
    try {
      if (!releaseInfo?.tracks?.length) return;
      if (isCurrentAlbumPlaying) {
        await pause();
      } else {
        await play(releaseInfo.tracks[0], releaseInfo, releaseInfo.tracks);
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return "";

    const minutes = Math.floor(duration / 60000);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0
        ? `${hours}hr ${remainingMinutes}min`
        : `${hours}hr`;
    }
    return `${minutes}min`;
  };

  const handleTrackMenuPress = useCallback((track: ExtendedTrack) => {
    setSelectedTrack(track);
    setIsShareModalVisible(true);
  }, []);

  // Add new handler for release share
  const handleReleaseShare = useCallback(() => {
    setSelectedTrack(null); // Reset selected track to ensure we're sharing release details
    setIsShareModalVisible(true);
  }, []);

  const Spacer = useCallback(
    ({ size = 16 }) => <View style={{ height: size }} />,
    []
  );

  //    Add loading states
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft02Icon size={32} color="#D2D3D5" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6D1B" />
          <Text style={styles.loadingText}>Loading music...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!releaseInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft02Icon size={32} color="#D2D3D5" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load music details</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Update render section
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft02Icon size={32} color="#D2D3D5" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6D1B" />
        </View>
      ) : (
        releaseInfo && (
          <ScrollView
            contentContainerStyle={[
              styles.scrollViewContent,
              { paddingBottom: currentTrack ? 110 : 20 },
            ]}
          >
            {/* Album Image */}
            <View style={styles.contentWrapper}>
              <FastImage
                source={{
                  uri: releaseInfo.coverImage,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={[
                  styles.albumImage,
                  { width: width * 0.5, height: width * 0.5 },
                ]}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>

            <Spacer />

            {/* Title and Artist */}
            <View style={styles.contentWrapper}>
              <Text
                style={[
                  styles.title,
                  { fontSize: width * 0.06, maxWidth: width * 0.8 },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {releaseInfo.title}
              </Text>
              <Text
                className="text-[12px] font-PlusJakartaSansBold text-Grey/06"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ maxWidth: width * 0.8 }}
              >
                {releaseInfo.artist.name}
              </Text>
            </View>

            {/* Playback and Action Controls */}
            <View style={styles.controlsContainer}>
              {[
                {
                  Icon: Playlist01Icon,
                  variant: "solid",
                  size: 48,
                  onPress: () => setIsPlaylistModalVisible(true),
                },
                {
                  Icon: VideoReplayIcon,
                  size: 48,
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
                  onPress: handleReleaseShare,
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
                      variant={"solid"}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Songs Count, Duration, and Description */}
            <View style={styles.contentWrapper}>
              <View className="items-center justify-center gap-y-[16px]">
                <View className="flex-row items-center">
                  <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                    {releaseInfo.totalTracks} Songs
                  </Text>
                  <Pressable className="bg-Grey/06 h-[4px] w-[4px] m-[4px] font-normal" />
                  <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                    {formatDuration(releaseInfo?.duration)}
                  </Text>
                </View>
                {["album", "ep", "playlist"].includes(releaseInfo.type) && (
                  <View className="flex-row items-center">
                    <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                      {releaseInfo.genre?.join(", ")} • {releaseInfo.label}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Track List */}
            <View style={styles.trackListContainer}>
              {releaseInfo.tracks.map((track: ExtendedTrack) => (
                <View key={track._id}>
                  <TouchableOpacity
                    onPress={() => handleTrackPress(track)}
                    className="flex-row items-center justify-between py-3"
                  >
                    <View className="flex-row items-center flex-1 mr-4">
                      <View style={{ flex: 1 }}>
                        <Text
                          className={`text-[16px] font-PlusJakartaSansBold ${
                            currentTrackId === track._id
                              ? "text-Orange/08"
                              : "text-[#fff]"
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
                          {/* Optionally handle featuredArtists if present */}
                        </Text>
                      </View>
                      {currentTrackId === track._id && buffering && (
                        <ActivityIndicator
                          size="small"
                          color="#FF6D1B"
                          style={{ marginLeft: 10 }}
                        />
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleTrackMenuPress(track)}
                    >
                      <MoreHorizontalIcon size={24} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        )
      )}

      {/* Share Modal */}
      {releaseInfo && (
        <Share
          isVisible={isShareModalVisible}
          onClose={() => setIsShareModalVisible(false)}
          album={{
            title: selectedTrack ? selectedTrack.title : releaseInfo.title,
            artist: selectedTrack
              ? selectedTrack.artist.name
              : releaseInfo.artist.name,
            image: selectedTrack
              ? selectedTrack.release.artwork.high
              : releaseInfo.coverImage,
            type: releaseInfo.type,
            duration: selectedTrack
              ? selectedTrack.songData.duration
              : releaseInfo.duration,
            id: selectedTrack ? selectedTrack._id : releaseInfo._id,
            tracks: selectedTrack
              ? [selectedTrack]
              : (releaseInfo.tracks as ExtendedTrack[] | Track[]),
          }}
        />
      )}

      {releaseInfo && (
        <Portal>
          <AddToPlaylistBottomSheet
            isVisible={isPlaylistModalVisible}
            closeSheet={handleClosePlaylistSheet}
            album={{
              id: id,
              title: releaseInfo.title,
              artist: releaseInfo.artist.name,
              image: releaseInfo.coverImage,
              type: releaseInfo.type,
              tracks: releaseInfo.tracks as any[],
            }}
          />
        </Portal>
      )}
    </SafeAreaView>
  );
};

// Add new styles
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
  scrollViewContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 26,
  },
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
  playButton: {
    backgroundColor: "#FF6D1B",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  activeButton: { backgroundColor: "#FF6D1B" },
  trackListContainer: { width: "100%", marginTop: 24 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
    fontFamily: "PlusJakartaSansBold",
  },
  errorText: {
    color: "#FF6D1B",
    fontSize: 16,
    fontFamily: "PlusJakartaSansBold",
    textAlign: "center",
  },
});

export default MusicDetails;
