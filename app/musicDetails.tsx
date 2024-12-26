import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
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
import MusicCategory from "../components/home/newlyRelease";
import MusicBottomSheet from "../components/bottomSheet/MusicBottomSheet";
import AddToPlaylistBottomSheet from "../components/bottomSheet/AddToPlaylistBottomSheet";
import useMusicPlayer from "../hooks/useMusicPlayer";
import { fetchAllAlbumsAndEPs, artistsArr } from "../utils/ArstsisArr";

const MusicDetails = () => {
  const { width } = useWindowDimensions();
  const { id, title, artist, image, type, duration, totalTracks } =
    useLocalSearchParams();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);

  const {
    tracks,
    isAlbumPlaying,
    currentPlayingIndex,
    isLiked,
    isSaved,
    loading,
    currentTrackId,
    shuffle,
    handlePlayPause,
    handleTrackPress,
    loadAlbumData,
    handleLike,
    toggleShuffle,
  } = useMusicPlayer();

  const allSongs = useMemo(
    () => fetchAllAlbumsAndEPs(artistsArr),
    [artistsArr]
  );

  useEffect(() => {
    loadAlbumData(id as string, type as string);
  }, [id, type]);

  const albumInfo = {
    title: title as string,
    type: type as "album" | "single" | "ep",
    coverImage: image as string,
  };

  const Spacer = ({ size = 16 }) => <View style={{ height: size }} />;

  const toggleTruncate = () => setIsTruncated(!isTruncated);

  const text =
    "Vultures 2 is the second studio album by the sensational hiphop duo ¥$...";
  const truncatedText =
    text.length > 100 ? `${text.substring(0, 130)}...` : text;

  const convertSecondsToMinutes = (seconds: number) => {
    return Math.ceil(seconds / 60);
  };

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
          <Image
            source={{ uri: image }}
            style={[
              styles.albumImage,
              { width: width * 0.4, height: width * 0.4 },
            ]}
          />
          {loading && (
            <View style={styles.skeletonWrapper}>
              <Skeleton
                colorMode="dark"
                width={width * 0.4}
                height={width * 0.4}
                radius={15}
              />
            </View>
          )}
        </View>

        <Spacer />

        {/* Title */}
        <View style={styles.contentWrapper}>
          <Text
            style={[styles.title, { fontSize: width * 0.06 }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text className="text-[12px] font-PlusJakartaSansBold text-Grey/06">
            ¥$, Ye & Ty Dolla Sign
          </Text>
          {/* {loading && (
                        <View style={styles.skeletonWrapper}>
                            <Skeleton
                                colorMode="dark"
                                width={width * 0.6}
                                height={44}
                                radius={4}
                            />
                        </View>
                    )} */}
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
              Icon: isAlbumPlaying ? PauseIcon : PlayIcon,
              size: 64,
              isPlay: true,
              onPress: () => handlePlayPause(tracks, albumInfo),
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
              onPress: () => setIsBottomSheetVisible(true),
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
              {/* {loading && (
                                <View style={styles.skeletonWrapper}>
                                    <Skeleton
                                        colorMode="dark"
                                        width={control.size}
                                        height={control.size}
                                        radius={control.size / 2}
                                    />
                                </View>
                            )} */}
            </View>
          ))}
        </View>

        <View style={styles.contentWrapper}>
          <View className="items-center justify-center gap-y-[16px]">
            <View className="flex-row items-center">
              <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                {totalTracks} Songs
              </Text>
              <Pressable className="bg-Grey/06 h-[4px] w-[4px] m-[4px] font-normal" />
              <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansBold font-normal">
                {convertSecondsToMinutes(Number(duration))} mins
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-[#fff] text-[14px] font-PlusJakartaSansRegular font-normal">
                {isTruncated ? truncatedText : text}
              </Text>
              <Pressable onPress={toggleTruncate}>
                <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansRegular font-normal">
                  {isTruncated ? "See More" : "See Less"}
                </Text>
              </Pressable>
            </View>
          </View>
          {loading && (
            <View style={styles.skeletonWrapper}>
              <Skeleton
                colorMode="dark"
                width={width * 0.9}
                height={54}
                radius={4}
              />
              <Skeleton
                colorMode="dark"
                width={width * 0.9}
                height={54}
                radius={4}
              />
            </View>
          )}
        </View>

        <Spacer />

        {/* Track List */}
        <View style={styles.trackListContainer}>
          {tracks.map((track: any, index: number) => (
            <View key={track._id}>
              <TouchableOpacity
                onPress={() =>
                  handleTrackPress(track, index, albumInfo, tracks)
                }
                className="flex-row items-center justify-between py-3"
              >
                <View className="flex-row items-center">
                  <View>
                    <Text
                      className={`text-[16px] font-PlusJakartaSansBold ${
                        currentTrackId === track._id
                          ? "text-Orange/08"
                          : "text-[#fff]"
                      }`}
                    >
                      {track.title}
                    </Text>
                    <Text className="text-[12px] font-PlusJakartaSansBold text-Grey/06">
                      {track.artist.name}
                    </Text>
                  </View>
                </View>
                <View>
                  <MoreHorizontalIcon size={24} color="#fff" />
                  <Text className="text-Grey/06 text-[12px] font-PlusJakartaSansRegular">
                    {convertSecondsToMinutes(track.duration)} mins
                  </Text>
                </View>
              </TouchableOpacity>
              {loading && (
                <View style={styles.skeletonWrapper}>
                  <Skeleton
                    colorMode="dark"
                    width="100%"
                    height={60}
                    radius={4}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        <Spacer size={30} />

        {/* Similar Music */}
        <View style={styles.similarMusicContainer}>
          <MusicCategory
            musicData={allSongs}
            title={`Similar to ${title}`}
            isLoading={loading}
          />
        </View>
      </ScrollView>

      <MusicBottomSheet
        album={{ title, image, tracks }}
        isVisible={isBottomSheetVisible}
        closeSheet={() => setIsBottomSheetVisible(false)}
        openAddToPlaylistSheet={() => {
          setIsBottomSheetVisible(false);
          setIsAddToPlaylistVisible(true);
        }}
      />

      <AddToPlaylistBottomSheet
        album={{ title, image, tracks }}
        isVisible={isAddToPlaylistVisible}
        closeSheet={() => setIsAddToPlaylistVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    position: "relative",
    alignItems: "center",
  },
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 26,
  },
  albumImage: {
    borderRadius: 15,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
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
  activeButton: {
    backgroundColor: "#FF6D1B",
  },
  trackListContainer: {
    width: "100%",
    marginTop: 24,
  },
  similarMusicContainer: {
    width: "100%",
  },
});

export default MusicDetails;
