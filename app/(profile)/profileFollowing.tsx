import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  FlatList,
  Image,
  ListRenderItemInfo,
  ActivityIndicator,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { Search01Icon } from "@hugeicons/react-native";
import { router, useNavigation } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { AppBackButton } from "@/components/app-components/back-btn";
import { useAppSelector } from "@/redux/hooks";
import { useFollowingArtists, Artist } from "@/hooks/useFollowingArtists";
import { formatNumber } from "@/utils/ArstsisArr";

// Define the interface for the artist data
interface IFollowing extends Artist {}

const ProfileFollowing = () => {
  const [page, setPage] = useState<number>(1);
  const navigation = useNavigation();
  const { userdata } = useAppSelector((state) => state.auth);

  // Use the new hook to fetch following artists
  const { data, isLoading, error } = useFollowingArtists(userdata?._id || '', page);
  const artistFollowing = data?.data?.artists || [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Following" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  // Function to handle loading more artists when reaching the end of the list
  const handleLoadMore = () => {
    if (data?.data?.pagination?.hasMore) {
      setPage(prev => prev + 1);
    }
  };

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

      {/* Loading indicator */}
      {isLoading && artistFollowing.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f4f4f4" />
        </View>
      )}

      {/* Error message */}
      {error && (
        <View className="flex-1 justify-center items-center">
          <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium">
            Failed to load following artists
          </Text>
        </View>
      )}

      {/* List of Artists */}
      <FlatList
        data={artistFollowing}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }: ListRenderItemInfo<IFollowing>) => (
          <FollowingCard item={item} />
        )}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          data?.data?.pagination?.hasMore && isLoading ? (
            <ActivityIndicator size="small" color="#f4f4f4" style={{ marginVertical: 20 }} />
          ) : null
        }
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
          source={{ uri: item.profileImage }}
          style={{ width: 48, height: 48, borderRadius: 24 }}
        />
        <View>
          <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[16px]">
            {item.name}
          </Text>
          <Text className="text-[#787A80] font-PlusJakartaSansRegular text-[14px]">
            {formatNumber(item.followers.toLocaleString())} followers
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
