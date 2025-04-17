import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import ToggleFlatListView from "../../../components/view/ToggleFlatlistView";
import GridComponent from "../../../components/cards/GridComponents";
import ListComponent from "../../../components/cards/ListComponents";
import { useLibrary } from "../../../hooks/useLibrary";
import { useAppSelector } from "@/redux/hooks";
import { useMusicPlayerContext } from "../../../context/MusicPlayerContext";

const index = () => {
  const { userdata } = useAppSelector((auth) => auth.auth);
  const { lastPlayed } = useLibrary(userdata?._id);
  const musicPlayer = useMusicPlayerContext();

  // Extract the actual track data from the response
  const recentlyPlayedTracks = lastPlayed?.data?.data || [];

  const frames = [
    {
      image: require("../../../assets/images/favourite.png"),
      title: "Favorite Songs",
      route: "/favouriteSongs",
    },
    {
      image: require("../../../assets/images/savedAlbums.png"),
      title: "Offline Download",
      route: "/savedAlbums",
    },
    {
      image: require("../../../assets/images/myPlaylist.png"),
      title: "My Playlists",
      route: "/myPlaylist",
    },
  ];

  const handleItemPress = (item) => {
    if (item.track) {
      const albumInfo = {
        title: item.release.title,
        type: item.release.type || "album",
        coverImage: item.release.artwork.high,
      };
      console.log("Album Info:", item);

      musicPlayer.play(
        {
          _id: item._id,
          title: item.track.title,
          artist: item.artist,
          songData: {
            _id: item._id,
            fileUrl: item.track.fileUrl,
            duration: item.track.duration,
          },
          release: item.release,
        },
        albumInfo,
        recentlyPlayedTracks
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: musicPlayer?.currentTrack ? 260 : 190 }}
      showsVerticalScrollIndicator={false}
      className="flex-1 min-h-screen"
      refreshControl={
        <RefreshControl
          refreshing={lastPlayed.isLoading}
          onRefresh={() => lastPlayed.refetch?.()}
          tintColor="#000"
        />
      }
    >
      <ScrollView
        contentContainerStyle={{
          marginTop: 24,
          gap: 12,
          paddingLeft: 8,
          height: 160,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {frames.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => router.push(item.route)}>
            <ImageBackground
              source={item.image}
              className="w-[190px] h-[160px] rounded-[24px]"
            >
              <View className="absolute bottom-4 left-3">
                <Text className="text-[20px] font-PlusJakartaSansBold">
                  {item.title.split(' ')[0]}
                </Text>
                <Text className="text-[20px] font-PlusJakartaSansBold">
                  {item.title.split(' ').slice(1).join(' ')}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>


      <ToggleFlatListView
        data={recentlyPlayedTracks}
        GridComponent={GridComponent}
        ListComponent={ListComponent}
        title="Recently Played"
        loading={lastPlayed.isLoading}
        error={lastPlayed.error}
        renderItem={(item) => ({
          _id: item._id,
          track: item.track,
          artist: item.artist,
          release: item.release,
          featuredArtists: item.featuredArtists,
          onPress: () => handleItemPress(item)
        })}
      />
    </ScrollView>
  );
};

export default index;
