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

const index = () => {
  const { currentTrack } = useMusicPlayer();
  const { location } = useUserInfo();
  const route = useRouter();

  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: currentTrack ? 124 : 20 }}
      >
        <Pressable
          onPress={() => route.navigate("/(search)/musicSearch")}
          style={{ width: wp("95%") }}
          className="flex-row items-center bg-transparent gap-x-[24px] py-[12px] mt-[24px] mx-[24px] pl-[12px] pr-[46px] border border-[#12141B] h-[48px]"
        >
          <Search01Icon size={24} color="#787A80" />
          <Text className="text-[#787A80]">
            Search artistes, songs, albums and playlists
          </Text>
        </Pressable>

        <TopSection />

        <View>
          <FlatList
            data={[
              {
                id: "1",
                backgroundImage: require("../../../assets/images/top30Background.png"),
                title: `Charting in ${location?.country}`,
                type: "location",
              },
              {
                id: "2",
                backgroundImage: require("../../../assets/images/world30.png"),
                title: "Top 30 worldwide",
                type: "worldwide",
              },
            ]}
            renderItem={({ item }) => (
              <View style={{ height: 653, marginRight: 16 }}>
                <TopSongsSection
                  backgroundImage={item.backgroundImage}
                  title={item.title}
                  type={item.type}
                />
              </View>
            )}
            contentContainerStyle={{ paddingLeft: 24 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default index;
