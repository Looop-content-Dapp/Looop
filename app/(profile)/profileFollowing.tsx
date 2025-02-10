import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
  ListRenderItemInfo,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { Search01Icon } from "@hugeicons/react-native";
import { router, useNavigation } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useQuery } from "../../hooks/useQuery";
import { AppBackButton } from "@/components/app-components/back-btn";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const ProfileFollowing = () => {
  const [artistFollowing, setArtistFollowing] = useState<IFollowing[]>([]);
  const { fetchFollowingArtists } = useQuery();
  const navigation = useNavigation();

  const { userdata } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Following" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      if (userdata) {
        const res = await fetchFollowingArtists(userdata._id);
        console.log("artist i follow", res.data)
        setArtistFollowing(res.data);
      }
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      {/* Search Bar */}
      <Pressable
        style={{
          width: wp("90%"),
        }}
        className="mx-auto py-[15px] pl-[16px] pr-[63px] bg-[#0A0B0F] h-[48px] flex-row items-center gap-x-[12px] my-[15px]"
      >
        <Search01Icon size={16} color="#787A80" />
        <Text className="text-[12px] font-PlusJakartaSansRegular text-Grey/06">
          Search artistes
        </Text>
      </Pressable>

      {/* List of Artists */}
      <FlatList
        data={artistFollowing}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }: ListRenderItemInfo<IFollowing>) => (
          <FollowingCard item={item} />
        )}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      />
    </SafeAreaView>
  );
};

export default ProfileFollowing;

// Following Card Component
const FollowingCard = ({ item }: { item: IFollowing }) => {
  return (
    <View className="flex-row items-center justify-between py-[12px]">
      <View className="flex-row items-center gap-x-[12px]">
        <Image
          source={{ uri: item.artist.images[0].url }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[16px]">
            {item.artist.name}
          </Text>
          <Text className="text-[#787A80] font-PlusJakartaSansRegular text-[14px]">
            Tribestars
          </Text>
        </View>
      </View>
      <Pressable className="px-[24px] py-[8px] bg-[#1C1C1E] rounded-[24px]">
        <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium">
          Following
        </Text>
      </Pressable>
    </View>
  );
};
