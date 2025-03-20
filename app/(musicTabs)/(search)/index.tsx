import { View, Text, ImageBackground, Pressable } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import TopSection from "../../../components/Discover/TopSection";
import TopSongsSection from "../../../components/Discover/TopSongsSection";
import useMusicPlayer from "../../../hooks/useMusicPlayer";
import useUserInfo from "../../../hooks/useUserInfo";
import { Search01Icon } from "@hugeicons/react-native";
import { FlatList } from "react-native";
import { useRouter } from "expo-router";
import ChartListSection from "../../../components/Discover/ChartListSection";
import TopAlbumsSection from "../../../components/Discover/TopAlbumsSection";

const index = () => {
  const { currentTrack } = useMusicPlayer();
  const { location } = useUserInfo();
  const route = useRouter();

  const chartingData = [
    {
      position: 1,
      title: "MMS",
      artist: "Asake, Wizkid",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2737c45c1c29c18a5e0b46fc117",
      duration: "2:46"
    },
    {
      position: 2,
      title: "Awolowo",
      artist: "Fido",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273a5d282e7e725c238a1fb9f2f",
      duration: "2:46"
    },
    {
      position: 3,
      title: "JUJU",
      artist: "Smur Lee, Odumodubvick, Shallipopi",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273b54e16ded272e0223b1427e0",
      duration: "2:46"
    },
    {
      position: 4,
      title: "Active",
      artist: "Asake, Travis Scott",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2735d79925b587cb91853e46377",
      duration: "2:46"
    }
  ];

  const topAlbumsData = [
    {
      position: 1,
      title: "Morayo",
      artist: "Wizkid",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2735e9b08109120e18c41a7b3e2",
      explicit: true
    },
    {
      position: 2,
      title: "GNX",
      artist: "Kendrick Lamar",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b27309d6ed214f03fbb663e46531",
      explicit: true
    },
    {
      position: 3,
      title: "Children of Africa",
      artist: "Seyi Vibez",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b27397ce44b0f04256f8206eab4d",
      explicit: false
    },
    {
      position: 4,
      title: "Work of Art",
      artist: "Asake",
      imageUrl: "data:image/jpeg;base64,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",
      explicit: true
    },
    {
      position: 5,
      title: "I Told Them",
      artist: "Burna Boy",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRikp65LZvapaD7iqA1hw8wP6M8PgPMuCuYvQ&s",
      explicit: true
    },
    {
      position: 6,
      title: "Timeless",
      artist: "Davido",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273adfc1ac5836f96adac580271",
      explicit: false
    },
    {
      position: 7,
      title: "Rave & Roses Ultra",
      artist: "Rema",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273ffa52727feedfd1935d160c4",
      explicit: true
    },
    {
      position: 8,
      title: "Boy Alone",
      artist: "Omah Lay",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b27354b6c54e83c4154c974c1059",
      explicit: true
    },
    {
      position: 9,
      title: "Love, Damini",
      artist: "Burna Boy",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b2731298bf27f92f0db9a2baaca3",
      explicit: true
    },
    {
      position: 10,
      title: "More Love, Less Ego",
      artist: "Wizkid",
      imageUrl: "https://i.scdn.co/image/ab67616d0000b273e944c571fca9ea470ebb5821",
      explicit: false
    }
  ];

  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: currentTrack ? 124 : 20,  }}
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

<ChartListSection
  title={`Charting in ${location?.country || 'Nigeria'}`}
  data={chartingData}
/>

<ChartListSection
  title={`Top songs Worldwide`}
  data={chartingData}
/>

<TopAlbumsSection
  title="Top albums"
  data={topAlbumsData}
/>
       </View>

      </ScrollView>
    </View>
  );
};

export default index;
