import { AppBackButton } from "@/components/app-components/back-btn";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useFriendWebSocket } from "@/hooks/useFriendWebSocket";
import { useAppSelector } from "@/redux/hooks";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface FriendRequest {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profileImage: string | null;
  };
  receiverId: {
    _id: string;
    username: string;
    profileImage: string | null;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

const FriendRequests = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { userdata } = useAppSelector((state) => state.auth);

  // Initialize WebSocket connection
  useFriendWebSocket(userdata?._id || "");

  // Get friend requests
  const {
    friendRequests,
    isLoading,
    acceptRequest,
    rejectRequest,
    isAccepting,
    isRejecting,
  } = useFriendRequests(userdata?._id || "");

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton
          name="Friend Requests"
          onBackPress={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  const renderRequestItem = ({ item }: { item: FriendRequest }) => {
    const isReceived = item.receiverId._id === userdata?._id;
    const user = isReceived ? item.senderId : item.receiverId;

    return (
      <View className="flex-row items-center justify-between p-4 border-b border-[#2A2B32]">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(profile)/userProfileView",
              params: { userId: user._id },
            })
          }
          className="flex-row items-center gap-x-3"
        >
          <Image
            source={{
              uri:
                user.profileImage ||
                "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
            }}
            className="w-12 h-12 rounded-full"
          />
          <View>
            <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">
              {user.username}
            </Text>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              {isReceived
                ? "Sent you a friend request"
                : "You sent a friend request"}
            </Text>
          </View>
        </TouchableOpacity>

        {isReceived && item.status === "pending" && (
          <View className="flex-row gap-x-2">
            <TouchableOpacity
              onPress={() => acceptRequest(item._id)}
              disabled={isAccepting}
              className={`px-4 py-2 rounded-[8px] ${
                isAccepting ? "bg-[#2A2B32]" : "bg-[#FF6D1B]"
              }`}
            >
              <Text
                className={`text-[14px] font-PlusJakartaSansMedium ${
                  isAccepting ? "text-[#787A80]" : "text-[#f4f4f4]"
                }`}
              >
                {isAccepting ? "Accepting..." : "Accept"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => rejectRequest(item._id)}
              disabled={isRejecting}
              className="bg-[#2A2B32] px-4 py-2 rounded-[8px]"
            >
              <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
                {isRejecting ? "Rejecting..." : "Reject"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isReceived && (
          <View className="bg-[#2A2B32] px-4 py-2 rounded-[8px]">
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              {item.status === "pending"
                ? "Pending"
                : item.status === "accepted"
                ? "Accepted"
                : "Rejected"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#0A0B0F]">
      <FlatList
        data={friendRequests?.received || []}
        renderItem={renderRequestItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-[16px] text-[#787A80] font-PlusJakartaSansMedium text-center">
              {isLoading ? "Loading..." : "No friend requests yet"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default FriendRequests;
