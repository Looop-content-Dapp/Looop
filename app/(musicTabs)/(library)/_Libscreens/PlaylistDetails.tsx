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
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft02Icon,
  PinIcon,
  UserAdd02Icon,
  ShuffleIcon,
  MoreHorizontalIcon,
  PauseIcon,
  PlayIcon,
  VideoReplayIcon,
} from "@hugeicons/react-native";
import FastImage from "react-native-fast-image";
import Share from "@/components/bottomSheet/Share";
import { useRef } from "react";
import { usePlaylistDetails } from "@/hooks/usePlaylist";
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";
import AddToPlaylistBottomSheet from "@/components/bottomSheet/AddToPlaylistBottomSheet";
import { Portal } from "@gorhom/portal";
import { useNotification } from "@/context/NotificationContext";

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
  const { showNotification } = useNotification();

  const handlePinPlaylistClick = () => {
    showNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Pinning playlists is a work in progress.',
      position: 'top'
    });
  };

  const handleInviteFriendClick = () => {
    showNotification({
      type: 'info',
      title: 'Feature Coming Soon',
      message: 'Inviting friends for collaboration is a work in progress.',
      position: 'top'
    });
  };

  // Add ref for the playlist bottom sheet
  const playlistBottomSheetRef = useRef(null);
  const [description, setDescription] = useState<Description>({
    text: "More Love, Less Ego is the fifth studio album by Nigerian singer Wizkid...",
    isTruncated: true,
  });

  const handleClosePlaylistSheet = useCallback(() => {
    setIsPlaylistModalVisible(false);
  }, []);


  // Get playlistId from params
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const shareBottomSheetRef = useRef(null);

  // Use the hook to fetch playlist data
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

  // ### Memoized Values
  const isLoading = useMemo(() => playlistLoading, [playlistLoading]);

  const playlistInfo = useMemo(() => {
    if (!playlistData) return null;
    return {
      id: playlistData._id,
      title: playlistData.title,
      coverImage: playlistData.coverImage,
      numberOfSaves: playlistData.numberOfSaves,
      numberOfSongs: playlistData.numberOfSongs,
      tracks: playlistData.songs,
      type: "playlist" // Add a default type for playlists
    };
  }, [playlistData]);

  const isCurrentAlbumPlaying = isPlaying && currentTrack && playlistInfo?.tracks.some(
    (t) => t._id === currentTrack._id
  );

  // ### Effects
  useEffect(() => {
    if (playlistInfo) {
      loadAlbumData(playlistInfo.id, playlistInfo.type); // Ensure type is included
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
          <Text style={styles.loadingText}>Loading music...</Text>
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


  // Update render section
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.dismissTo({
            pathname: `/(musicTabs)/(library)/myPlaylist`
        })}>
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
          {/* Album Image */}
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

          {/* Title and Artist */}
          <View style={styles.contentWrapper}>
            <Text
              style={[styles.title, { fontSize: width * 0.06, maxWidth: width * 0.8 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {playlistInfo.title}
            </Text>
            <Text
              className="text-[12px] font-PlusJakartaSansBold text-Grey/06"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ maxWidth: width * 0.8 }}
            >
              {playlistInfo.numberOfSaves} Saves
            </Text>
          </View>

          {/* Playback and Action Controls */}
          <View style={styles.controlsContainer}>
            {[
              {
                Icon: UserAdd02Icon,
                size: 48,
                onPress: handleInviteFriendClick
              },
              {
                Icon: PinIcon,
                size: 48,
                onPress: handlePinPlaylistClick
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
                onPress: handleReleaseShare, // Changed from shareBottomSheetRef.current?.expand()
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

          {/* Songs Count, Duration, and Description */}
          <View style={styles.contentWrapper}>
            <View className="items-center justify-center gap-y-[16px]">
              <View className="flex-row items-center">
                <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                  {playlistInfo.numberOfSongs} Songs
                </Text>
                <Pressable className="bg-Grey/06 h-[4px] w-[4px] m-[4px] font-normal" />
                <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                  {formatDuration(playlistData?.totalDuration)}
                </Text>
              </View>
            </View>
          </View>

          {/* Track List */}
          <View style={styles.trackListContainer}>
            {playlistInfo.tracks.map((track) => (
              <View key={track._id}>
                <TouchableOpacity
                  onPress={() => handleTrackPress(track)}
                  className="flex-row items-center justify-between py-3"
                >
                  <View className="flex-row items-center gap-x-3 flex-1 mr-4">
                    <Image source={{
                        uri: track.releaseImage
                    }}
                    defaultSource={require('@/assets/images/default-artwork.png')}
                    className="w-[40px] h-[40px] rounded-lg"
                     />
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
                        {track?.featuredArtists?.length > 0 &&
                          ` ft. ${track?.featuredArtists.map(artist => artist.name).join(', ')}`}
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
                  <TouchableOpacity onPress={() => handleTrackMenuPress(track)}>
                    <MoreHorizontalIcon size={24} color="#fff" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Share Modal */}
      {playlistData && (
        <Share
          isVisible={isShareModalVisible}
          onClose={() => setIsShareModalVisible(false)}
          album={{
            title: selectedTrack ? selectedTrack.title : playlistData.title,
            artist: selectedTrack?.artist.name ,
            image: selectedTrack ? selectedTrack.release.artwork.high : playlistData.coverImage,
            duration: selectedTrack ? selectedTrack.duration : playlistData.totalDuration, // Pass the raw duration number
            id: selectedTrack ? selectedTrack._id : playlistData._id,
            tracks: selectedTrack ? selectedTrack : playlistInfo.tracks,
          }}
        />
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
});

export default PlaylistDetails;
