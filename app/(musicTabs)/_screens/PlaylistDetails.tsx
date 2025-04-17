import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  VideoReplayIcon,
} from "@hugeicons/react-native";
import FastImage from "react-native-fast-image";
import Share from "../../../components/bottomSheet/Share";
import { useRef } from "react";
import { usePlaylistDetails } from "@/hooks/usePlaylist";
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import AddToPlaylistBottomSheet from "../../../components/bottomSheet/AddToPlaylistBottomSheet";
import { Portal } from "@gorhom/portal";
import { Image } from "react-native";

// ### Interfaces
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
  type: "album" | "single" | "ep";
  coverImage: string;
}

interface ExtendedTrack extends Track {
  streams: number;
  track_number: number;
}

// ### Component Definition
// Add description state
interface Description {
  text: string;
  isTruncated: boolean;
}

const PlaylistDetails = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isPlaylistModalVisible, setIsPlaylistModalVisible] = useState(false);

  // Add ref for the playlist bottom sheet
  const playlistBottomSheetRef = useRef(null);
  const [description, setDescription] = useState<Description>({
    text: "More Love, Less Ego is the fifth studio album by Nigerian singer Wizkid...",
    isTruncated: true,
  });

  const handleClosePlaylistSheet = useCallback(() => {
    setIsPlaylistModalVisible(false);
  }, []);


  // Get releaseId from params
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const shareBottomSheetRef = useRef(null);

  // Use the hook to fetch release data
  const { data: playlistData, isLoading: playlistLoading } = usePlaylistDetails(id as string);

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

  const coverImage = playlistData?.songs[0]?.track?.release?.artwork?.high || playlistData.coverImage;

  // ### Memoized Values
  const isLoading = useMemo(() => playerLoading || playlistLoading, [playerLoading, playlistLoading]);

  // Update playlistInfo memo to handle playlist data
  const playlistInfo = useMemo(() => {
    if (!playlistData) return null;

    // Use current playing track's image if available, otherwise use playlist cover
    const displayImage = currentTrack?.release?.artwork?.high || playlistData.coverImage;

    return {
      id: playlistData._id,
      title: playlistData.title,
      type: 'playlist',
      coverImage: displayImage,
      description: playlistData.description,
      totalTracks: playlistData.totalTracks,
      duration: playlistData.totalDuration,
      tracks: playlistData.songs.map(song => ({
        ...song.track,
        addedAt: song.addedAt,
        addedBy: song.addedBy
      })),
      isPublic: playlistData.isPublic,
      isCollaborative: playlistData.isCollaborative,
      createdDate: playlistData.createdDate,
      lastModified: playlistData.lastModified
    };
  }, [playlistData]);

  const isCurrentAlbumPlaying = isPlaying && currentTrack && releaseInfo?.tracks.some(
    (t) => t._id === currentTrack._id
  );

  // ### Effects
  useEffect(() => {
    if (playlistInfo) {
      loadAlbumData(playlistInfo.id, playlistInfo.type);
    }
  }, [playlistInfo, loadAlbumData]);

  const toggleTruncate = useCallback(() => {
    setDescription((prev) => ({ ...prev, isTruncated: !prev.isTruncated }));
  }, []);

  const truncatedText = useMemo(() => {
    return description.text.length > 100
      ? `${description.text.substring(0, 130)}...`
      : description.text;
  }, [description.text]);

  const handleTrackPress = async (track: ExtendedTrack) => {
    try {
      if (!playlistInfo?.tracks) return;
      if (currentTrack?._id === track._id) {
        if (isPlaying) {
          await pause();
        } else {
          await play(track, playlistInfo, playlistInfo.tracks);
        }
        return;
      }
      await play(track, playlistInfo, playlistInfo.tracks);
    } catch (error) {
      console.error("Error handling track press:", error);
    }
  };

  // Fix handlePlayPause function
  const handlePlayPause = async () => {
    try {
      if (!playlistInfo?.tracks?.length) return;
      if (isCurrentAlbumPlaying) {
        await pause();
      } else {
        await play(playlistInfo.tracks[0], playlistInfo, playlistInfo.tracks);
      }
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return '';

    const minutes = Math.floor(duration / 60000);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}hr ${remainingMinutes}min` : `${hours}hr`;
    }
    return `${minutes}min`;
  };


  const handleTrackMenuPress = useCallback((track: Track) => {
    setSelectedTrack(track);
    setIsShareModalVisible(true);
  }, []);

        // Add new handler for release share
        const handleReleaseShare = useCallback(() => {
            setSelectedTrack(null); // Reset selected track to ensure we're sharing release details
            setIsShareModalVisible(true);
          }, []);

  const convertSecondsToMinutes = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return remainingSeconds === 0
      ? `${minutes}min`
      : `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const Spacer = useCallback(({ size = 16 }) => <View style={{ height: size }} />, []);

   // Add loading states
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
          <Text style={styles.loadingText}>Loading playlist...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!playlistInfo) {
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

console.log("playlistInfo:", playlistData)
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
      ) : playlistInfo && (
        <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: currentTrack ? 110 : 20 }
        ]}
      >
        {/* Playlist Cover */}
        <View style={styles.contentWrapper}>
          <FastImage
            source={{
              uri: playlistInfo.coverImage,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable,
            }}
            style={[styles.albumImage, { width: width * 0.5, height: width * 0.5 }]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        <Spacer />

        {/* Playlist Title and Description */}
        <View style={styles.contentWrapper}>
          <Text
            style={[styles.title, { fontSize: width * 0.06, maxWidth: width * 0.8 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {playlistInfo.title}
          </Text>
          {playlistInfo.description && (
            <Text
              className="text-[12px] font-PlusJakartaSansBold text-Grey/06 mt-2"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ maxWidth: width * 0.8 }}
            >
              {playlistInfo.description}
            </Text>
          )}
        </View>

        {/* Playback Controls */}
        <View style={styles.controlsContainer}>
          {[
            {
              Icon: ShuffleIcon,
              size: 48,
              active: shuffle,
              onPress: toggleShuffle,
            },
            {
              Icon: isCurrentAlbumPlaying ? PauseIcon : PlayIcon,
              size: 64,
              isPlay: true,
              onPress: handlePlayPause,
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
                  variant={control.active ? "solid" : "stroke"}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Track List */}
        <View style={styles.trackListContainer}>
          {playlistInfo.tracks.length > 0 ? (
            <View style={styles.trackListContainer}>
              {playlistInfo?.tracks.map((track, index) => (
                <View key={track._id}>
                  <TouchableOpacity
                    onPress={() => handleTrackPress(track)}
                    className="flex-row items-center justify-between py-3"
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="text-Grey/06 w-[24px] text-center mr-3">
                        {index + 1}
                      </Text>
                      <Image
                        source={{ uri: track?.release?.artwork.thumbnail  }}
                        style={{ width: 40, height: 40, borderRadius: 4, marginRight: 12 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className={`text-[16px] font-PlusJakartaSansBold ${
                            currentTrackId === track?._id ? "text-Orange/08" : "text-[#fff]"
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
                          {track?.artist?.name}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => handleTrackMenuPress(track)}>
                      <MoreHorizontalIcon size={24} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Image
                source={require("@/assets/images/ghost.png")}
                style={styles.ghostImage}
              />
              <Text style={styles.emptyStateText}>
                No tracks in this playlist yet
              </Text>
              <Text style={styles.emptyStateSubText}>
                Add some tracks to start listening
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      )}

      {/* Share Modal */}
      {playlistInfo && (
        <Share
          isVisible={isShareModalVisible}
          onClose={() => setIsShareModalVisible(false)}
          album={{
            title: selectedTrack ? selectedTrack.title : playlistInfo.title,
            artist: selectedTrack ? selectedTrack.artist.name : playlistInfo?.artist,
            image: selectedTrack ? selectedTrack.release.artwork.high : playlistInfo.coverImage,
            type: playlistInfo.type,
            duration: selectedTrack ? selectedTrack.duration : playlistInfo?.duration, // Pass the raw duration number
            id: selectedTrack ? selectedTrack._id : playlistInfo.id,
            tracks: selectedTrack ? undefined : playlistInfo.tracks,
          }}
        />
      )}

  {playlistInfo && (
  <Portal>
    <AddToPlaylistBottomSheet
      isVisible={isPlaylistModalVisible}
      closeSheet={handleClosePlaylistSheet}
     album={{
        id: id,
        title: playlistInfo.title,
        artist: playlistInfo?.artist,
        image: playlistInfo?.coverImage,
        type: playlistInfo?.type,
        tracks: playlistInfo?.tracks
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
  scrollViewContent: { alignItems: "center", paddingHorizontal: 14, paddingBottom: 26 },
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSansBold',
  },
  errorText: {
    color: '#FF6D1B',
    fontSize: 16,
    fontFamily: 'PlusJakartaSansBold',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  ghostImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    tintColor: '#D2D3D5',
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'PlusJakartaSansBold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubText: {
    color: '#D2D3D5',
    fontSize: 14,
    fontFamily: 'PlusJakartaSansBold',
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default PlaylistDetails;
