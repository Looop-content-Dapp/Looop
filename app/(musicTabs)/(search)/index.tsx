import { useExplore } from "@/hooks/core/useExplore";
import useMusicPlayer from "@/hooks/music/useMusicPlayer";
import useUserInfo from "@/hooks/user/useUserInfo";
import { Search01Icon } from "@hugeicons/react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ChartListSection from "@/components/Discover/ChartListSection";
import TopAlbumsSection from "@/components/Discover/TopAlbumsSection";
import TopSection from "@/components/Discover/TopSection";  

const index = () => {
  const { currentTrack } = useMusicPlayer();
  const { location } = useUserInfo();
  const route = useRouter();

  // Helper function to format duration from milliseconds to mm:ss
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  // Use the explore hook
  const { worldwideTracks, locationTracks, isLoading } = useExplore(
    location?.region || "NG"
  );

  const topAlbumsData = [
    {
      position: 1,
      title: "Morayo",
      artist: "Wizkid",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2735e9b08109120e18c41a7b3e2",
      explicit: true,
    },
    {
      position: 2,
      title: "GNX",
      artist: "Kendrick Lamar",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27309d6ed214f03fbb663e46531",
      explicit: true,
    },
    {
      position: 3,
      title: "Children of Africa",
      artist: "Seyi Vibez",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27397ce44b0f04256f8206eab4d",
      explicit: false,
    },
    {
      position: 4,
      title: "Work of Art",
      artist: "Asake",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273b56b946d1020c4c9cc2a3829",
      explicit: true,
    },
  ];

  const worldwideChartData =
    worldwideTracks.data?.map((track) => ({
      position: track.rank,
      title: track.title,
      artist: track.artist.name,
      imageUrl: track.release.artwork.high,
      duration: formatDuration(track?.duration),
      trackData: {
        _id: track._id,
        title: track.title,
        duration: track.duration,
        artist: track.artist,
        release: track.release,
        songData: {
          fileUrl: track?.songdata?.url || track?.songdata?.fileUrl || "", // Added fallback
          duration: track.duration,
        },
        url: track?.songdata?.url || track?.songdata?.fileUrl || "", // Added direct url access
      },
    })) || [];

  const locationChartData =
    locationTracks.data?.map((track, index) => ({
      position: index + 1,
      title: track.title,
      artist: track.artist.name,
      imageUrl: track?.release?.artwork.high,
      duration: formatDuration(track?.duration),
      trackData: {
        _id: track._id,
        title: track.title,
        duration: track.duration,
        artist: track.artist,
        release: track.release,
        songData: {
          fileUrl: track?.songdata?.url || track?.songdata?.fileUrl || "", // Added fallback
          duration: track.duration,
        },
        url: track?.songdata?.url || track?.songdata?.fileUrl || "", // Added direct url access
      },
    })) || [];

  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: currentTrack ? 124 : 20 }}
      >
        <Pressable
          onPress={() => route.navigate("/(search)/musicSearch")}
          style={{ width: wp("90%") }}
          className="flex-row items-center bg-transparent rounded-[10px] gap-x-[24px] py-[12px] mt-[24px] mx-[24px] pl-[12px] pr-[46px] border border-[#12141B] h-[48px]"
        >
          <Search01Icon size={24} color="#787A80" />
          <Text className="text-[#787A80]">
            Search artistes, songs, albums and playlists
          </Text>
        </Pressable>

        <View className="gap-y-[16px]">
          <TopSection />

          {/* Display location-based tracks */}
          <ChartListSection
            title={`Charting in ${location?.country || "Nigeria"}`}
            data={locationChartData.slice(0, 4)}
            isLoading={isLoading}
          />

          {/* Display worldwide tracks */}
          <ChartListSection
            title="Top songs Worldwide"
            data={worldwideChartData.slice(0, 4)}
            isLoading={isLoading}
          />

          <TopAlbumsSection title="Top albums" data={topAlbumsData} />
        </View>
      </ScrollView>
    </View>
  );
};

export default index;
