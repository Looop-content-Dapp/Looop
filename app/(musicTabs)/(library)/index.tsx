import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import ToggleFlatListView from "../../../components/view/ToggleFlatlistView";
import GridComponent from "../../../components/cards/GridComponents";
import ListComponent from "../../../components/cards/ListComponents";
import { useQuery } from "../../../hooks/useQuery";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const index = () => {
  const [isGridView, setIsGridView] = useState(false);
  const [lastPlayed, setLastPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getLastPlayedSongs, retrieveUserId } = useQuery();

  const frames = [
    {
      image: require("../../../assets/images/favourite.png"),
      title: "Favorite Songs",
      route: "/favouriteSongs",
    },
    {
      image: require("../../../assets/images/savedAlbums.png"),
      title: "Saved Albums",
      route: "/savedAlbums",
    },
    {
      image: require("../../../assets/images/myPlaylist.png"),
      title: "My Playlists",
      route: "/myPlaylist",
    },
  ];

  const fetchLastPlayed = useCallback(async () => {
    setLoading(true);
    try {
      const userId = await retrieveUserId();
      if (userId) {
        const data = await getLastPlayedSongs(userId);
        setLastPlayed(data.data);
      }
    } catch (error) {
      console.error("Error fetching last played:", error);
    } finally {
      setLoading(false);
    }
  }, [getLastPlayedSongs]);

  useFocusEffect(
    useCallback(() => {
      fetchLastPlayed();

      const intervalId = setInterval(fetchLastPlayed, 30000);

      return () => clearInterval(intervalId);
    }, [fetchLastPlayed])
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 190 }}
      className="flex-1 min-h-screen"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={fetchLastPlayed}
          tintColor="#000"
        />
      }
    >
      <ScrollView
        contentContainerStyle={{
          marginTop: 24,
          gap: 12,
          paddingLeft: 8,
          height: 140,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {frames.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => router.push(item.route)}>
            <ImageBackground
              source={item.image}
              className="w-[160px] h-[140px]"
            >
              <Text className="absolute bottom-4 left-3 text-[20px] font-PlusJakartaSansBold w-[83px]">
                {item.title}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ToggleFlatListView
        data={lastPlayed}
        GridComponent={GridComponent}
        ListComponent={ListComponent}
        title="Recently Played"
        loading={loading}
      />
    </ScrollView>
  );
};

export default index;
