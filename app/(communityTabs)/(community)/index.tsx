import PostCard from "@/components/cards/PostCard";
import {
  SubscriptionCardSkeleton,
  TribeCardSkeleton,
} from "@/components/skeletons/TribeSkeletons";
import { useTribes, useUserSubscriptions } from "@/hooks/community/useTribes";
import { useAppSelector } from "@/redux/hooks";
import { SubscriptionItem, TribeItem } from "@/types/tribe";
import { ArrowRight01Icon } from "@hugeicons/react-native";
import { router, useNavigation } from "expo-router";
import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";

interface Artist {
  _id: string;
  name: string;
  profileImage?: string;
  avatar?: string;
  verified?: boolean;
}

interface Member {
  _id: string;
  profileImage?: string;
}

const ArtistBadge: React.FC<{ artist: Artist }> = React.memo(({ artist }) => (
  <View className="flex-row bg-[#202227] py-[8px] px-[12px] my-[16px] ml-[16px] max-w-[70%] items-center mb-2 rounded-[24px]">
    <Avatar
      source={{ uri: artist.profileImage || artist.avatar }}
      size={20}
      rounded
    />
    <View className="flex-1 flex-row items-center ml-2">
      <Text
        numberOfLines={1}
        className="flex-1 text-white text-xs font-PlusJakartaSansMedium"
      >
        {artist.name}
      </Text>
      {artist.verified && (
        <View className="ml-1 bg-[#2DD881] rounded-full p-[2px]">
          <Text className="text-[10px]">✓</Text>
        </View>
      )}
    </View>
  </View>
));

interface MembersListProps {
  members: Member[];
  memberCount: number;
}

const MembersList: React.FC<MembersListProps> = React.memo(({ members, memberCount }) => (
  <View className="flex-row items-center bg-[#111318] flex-1 rounded-[16px] p-[10px]">
    <View className="flex-row -space-x-2">
      {members.slice(0, 3).map((member) => (
        <Avatar
          key={member._id}
          source={{
            uri:
              member.profileImage ||
              "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
          }}
          size={24}
          rounded
          containerStyle={{ borderWidth: 1, borderColor: "white" }}
        />
      ))}
    </View>
    <Text className="text-white/80 ml-2 text-xs">+{memberCount} others</Text>
  </View>
));

interface TribeCardProps {
  item: TribeItem;
  loading: boolean;
}

const TribeCard: React.FC<TribeCardProps> = React.memo(
  ({ item, loading }) => {
    if (loading) {
      return <TribeCardSkeleton />;
    }

    const handlePress = useCallback(() => {
      router.push({
        pathname: "/communityDetails",
        params: {
          id: item?.id,
          name: item?.name,
          description: item?.description,
          image: item?.coverImage,
          noOfMembers: item?.memberCount,
        },
      });
    }, [item]);

    return (
      <TouchableOpacity
        className="w-[283px] h-[320px] mr-3 rounded-[20px] overflow-hidden"
        onPress={handlePress}
      >
        <Image
          source={{ uri: item.coverImage }}
          className="w-full h-[60%] absolute"
          resizeMode="cover"
        />
        <ArtistBadge artist={item.artist} />
        <View className="absolute bottom-0 bg-[#202227] p-[16px] justify-end">
          <Text
            className="text-white text-[16px] font-PlusJakartaSansBold mb-1"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            className="text-[#D2D3D5] text-[14px] font-PlusJakartaSansRegular mb-3"
            numberOfLines={1}
          >
            {item.description}
          </Text>
          <View className="flex-row items-center justify-between">
            <MembersList
              members={item.members}
              memberCount={item.memberCount}
            />
            <ArrowRight01Icon size={32} color="#f4f4f4" variant="stroke" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

interface SubscriptionCardProps {
  item: SubscriptionItem;
  loading: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = React.memo(({ item, loading }) => {
  if (loading) {
    return <SubscriptionCardSkeleton />;
  }

  const isExpired = new Date(item.expiry) <= new Date();
  const status = isExpired ? "Inactive" : "Active member";
  const statusColor = status === "Active member" ? "#2DD881" : "#FF4444";
  const dueText = isExpired ? "Due for renewal" : item.expiry;

  return (
    <TouchableOpacity className="w-full h-[100px] my-[20px] rounded-[16px] overflow-hidden flex-row items-center">
      <Image
        source={{ uri: item.image }}
        className="w-[100px] h-full rounded-l-[16px]"
        resizeMode="cover"
      />
      <View className="flex-1 px-4 py-3 justify-between">
        <View>
          <Text
            className="text-white text-[16px] font-PlusJakartaSansBold"
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <View className="flex-row -space-x-2">
              {item.members.slice(0, 3).map((member) => (
                <Avatar
                  key={member._id}
                  source={{
                    uri:
                      member.profileImage ||
                      "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
                  }}
                  size={24}
                  rounded
                  containerStyle={{ borderWidth: 1, borderColor: "white" }}
                />
              ))}
            </View>
            <Text className="text-[#f4f4f4] text-[14px] ml-2 font-PlusJakartaSansMedium">
              and {item.memberCount} others
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2 mt-2">
          <View
            className={`px-[8px] py-1 rounded-full ${
              status === "Active member" ? "bg-[#2DD881]/10" : "bg-[#FF4444]/10"
            }`}
          >
            <Text
              className={`text-[12px] font-PlusJakartaSansMedium ${
                status === "Active member" ? "text-[#2DD881]" : "text-[#FF4444]"
              }`}
            >
              {status}
            </Text>
          </View>
          <View
            className={`px-3 py-1 rounded-full ${
              isExpired ? "bg-[#FF4444]/10" : "bg-[#202227]"
            }`}
          >
            <Text
              className={`text-[12px] font-PlusJakartaSansMedium ${
                isExpired ? "text-[#FF4444]" : "text-white/60"
              }`}
            >
              {dueText}
            </Text>
          </View>
        </View>
      </View>
      <View className="pr-4">
        <ArrowRight01Icon size={24} color="#f4f4f4" variant="stroke" />
      </View>
    </TouchableOpacity>
  );
});

interface TabButtonProps {
  tab: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = React.memo(({ tab, isActive, onPress }) => (
  <TouchableOpacity
    className={`flex-1 py-4 ${isActive ? "border-b-2 border-[#FF7A1B]" : ""}`}
    onPress={onPress}
  >
    <Text className="text-center text-[#FFFFFF] text-[16px] font-PlusJakartaSansMedium">
      {tab}
    </Text>
  </TouchableOpacity>
));

const Index = () => {
  const navigation = useNavigation();
  const { userdata } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("My Tribes");
  const {
    data: tribesData,
    isLoading: isTribesLoading,
    refetch: refetchTribes,
  } = useTribes();
  const {
    data: subscriptionsData,
    isLoading: isSubscriptionsLoading,
    refetch: refetchSubscriptions,
  } = useUserSubscriptions();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await (activeTab === "My Tribes"
      ? refetchTribes()
      : refetchSubscriptions());
    setRefreshing(false);
  }, [activeTab, refetchTribes, refetchSubscriptions]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Text className="text-[#f4f4f4] text-[24px] font-PlusJakartaSansMedium">
          Tribes
        </Text>
      ),
      headerRight: () => (
        <Avatar
          source={{
            uri:
              userdata?.profileImage ||
              "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
          }}
          size={40}
          rounded
          onPress={() => router.push("/(profile)")}
          avatarStyle={{
            borderWidth: 2,
            borderColor: "#f4f4f4",
          }}
        />
      ),
      title: "",
    });
  }, [navigation, userdata]);

  const isSubscriptionsTab = activeTab === "Subscriptions";
  const currentData = isSubscriptionsTab
    ? subscriptionsData?.data
    : tribesData?.data;
  const isLoading = isSubscriptionsTab
    ? isSubscriptionsLoading
    : isTribesLoading;

  const renderItem = useCallback(
    ({ item }: { item: any }) =>
      isSubscriptionsTab ? (
        <SubscriptionCard item={item} loading={isLoading} />
      ) : (
        <PostCard item={item} />
      ),
    [isSubscriptionsTab, isLoading]
  );

  const renderHeader = useCallback(() => {
    if (isSubscriptionsTab) return null;

    return (
      <View className="py-4">
        <FlatList
          data={currentData?.communities || []}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TribeCard item={item} loading={isLoading} />
          )}
          ListEmptyComponent={() =>
            isLoading ? (
              <View className="flex-row">
                {[1, 2].map((i) => (
                  <TribeCardSkeleton key={i} />
                ))}
              </View>
            ) : null
          }
        />
      </View>
    );
  }, [currentData?.communities, isLoading, isSubscriptionsTab]);

  return (
    <View style={{ flex: 1, minHeight: "100%" }}>
      <View className="flex-row border-b border-Grey/10">
        {["My Tribes", "Subscriptions"].map((tab) => (
          <TabButton
            key={tab}
            tab={tab}
            isActive={activeTab === tab}
            onPress={() => setActiveTab(tab)}
          />
        ))}
      </View>

      <FlatList
        data={isSubscriptionsTab ? currentData : currentData?.posts || []}
        keyExtractor={(item) => item.id || item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#FF7A1B"]}
          />
        }
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Index;
