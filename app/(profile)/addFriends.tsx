import { AppBackButton } from "@/components/app-components/back-btn";
import api from "@/config/apiConfig";
import { useNotification } from "@/context/NotificationContext";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useFriendWebSocket } from "@/hooks/useFriendWebSocket";
import { useAppSelector } from "@/redux/hooks";
import { Link05Icon, Search01Icon } from "@hugeicons/react-native";
import { useQuery } from "@tanstack/react-query";
import * as Contacts from "expo-contacts";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface User {
  _id: string;
  username: string;
  fullname: string;
  profileImage: string | null;
  bio: string | null;
  email: string;
  role: string;
  referralCode: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

const AddFriends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [tab, setTab] = useState<"all" | "contacts">("all");
  const navigation = useNavigation();
  const router = useRouter();
  const { userdata } = useAppSelector((state) => state.auth);
  const { showNotification } = useNotification();

  // Initialize WebSocket connection
  useFriendWebSocket(userdata?._id || "");

  // Initialize friend requests hook
  const {
    sendRequest,
    isSending,
    getRequestStatus,
    isFriend,
    acceptRequest,
    rejectRequest,
    isAccepting,
    isRejecting,
  } = useFriendRequests(userdata?._id || "");

  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/api/user");
      return response.data.data.filter(
        (user: User) => user._id !== userdata?._id
      );
    },
  });

  // Load contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.Name],
        });
        setContacts(data);
      }
    })();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.emails?.[0]?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Send friend request
  const handleAddFriend = async (friendId: string) => {
    try {
      await sendRequest(friendId);
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Add Friends" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  const renderFriendButton = (user: User) => {
    const requestStatus = getRequestStatus(user._id);
    const isUserFriend = isFriend(user._id);

    if (isUserFriend) {
      return (
        <TouchableOpacity
          className="px-4 py-2 rounded-[56px] bg-[#2A2B32]"
          disabled={true}
        >
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
            Friends
          </Text>
        </TouchableOpacity>
      );
    }

    if (requestStatus) {
      if (requestStatus.type === "sent") {
        if (requestStatus.status === "pending") {
          return (
            <TouchableOpacity
              className="px-4 py-2 rounded-[56px] bg-[#2A2B32]"
              disabled={true}
            >
              <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
                {isSending(user._id) ? "Sending..." : "Request Sent"}
              </Text>
            </TouchableOpacity>
          );
        }
        if (requestStatus.status === "rejected") {
          return (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleAddFriend(user._id);
              }}
              disabled={isSending(user._id)}
              className={`px-4 py-2 rounded-[56px] ${
                isSending(user._id) ? "bg-[#2A2B32]" : "bg-[#FF6D1B]"
              }`}
            >
              <Text
                className={`text-[14px] font-PlusJakartaSansMedium ${
                  isSending(user._id) ? "text-[#787A80]" : "text-[#f4f4f4]"
                }`}
              >
                {isSending(user._id) ? "Sending..." : "Add Friend"}
              </Text>
            </TouchableOpacity>
          );
        }
      } else if (requestStatus.type === "received") {
        if (requestStatus.status === "pending") {
          return (
            <View className="flex-row gap-x-2">
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  acceptRequest(requestStatus.requestId);
                }}
                disabled={isAccepting(requestStatus.requestId)}
                className={`px-4 py-2 rounded-[56px] ${
                  isAccepting(requestStatus.requestId)
                    ? "bg-[#2A2B32]"
                    : "bg-[#FF6D1B]"
                }`}
              >
                <Text
                  className={`text-[14px] font-PlusJakartaSansMedium ${
                    isAccepting(requestStatus.requestId)
                      ? "text-[#787A80]"
                      : "text-[#f4f4f4]"
                  }`}
                >
                  {isAccepting(requestStatus.requestId)
                    ? "Accepting..."
                    : "Accept"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  rejectRequest(requestStatus.requestId);
                }}
                disabled={isRejecting(requestStatus.requestId)}
                className={`px-4 py-2 rounded-[56px] ${
                  isRejecting(requestStatus.requestId)
                    ? "bg-[#2A2B32]"
                    : "bg-[#2A2B32]"
                }`}
              >
                <Text
                  className={`text-[14px] font-PlusJakartaSansMedium ${
                    isRejecting(requestStatus.requestId)
                      ? "text-[#787A80]"
                      : "text-[#787A80]"
                  }`}
                >
                  {isRejecting(requestStatus.requestId)
                    ? "Rejecting..."
                    : "Reject"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }
      }
    }

    return (
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          handleAddFriend(user._id);
        }}
        disabled={isSending(user._id)}
        className={`px-4 py-2 rounded-[56px] ${
          isSending(user._id) ? "bg-[#2A2B32]" : "bg-[#FF6D1B]"
        }`}
      >
        <Text
          className={`text-[14px] font-PlusJakartaSansMedium ${
            isSending(user._id) ? "text-[#787A80]" : "text-[#f4f4f4]"
          }`}
        >
          {isSending(user._id) ? "Sending..." : "Add Friend"}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/(profile)/userProfileView",
          params: { userId: item._id },
        })
      }
      className="flex-row items-center justify-between p-4 border-b border-[#2A2B32]"
    >
      <View className="flex-row items-center gap-x-3">
        <Image
          source={{
            uri:
              item.profileImage ||
              "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
          }}
          className="w-12 h-12 rounded-full"
        />
        <View>
          <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">
            {item.username || ""}
          </Text>
          <View className="flex-row items-center gap-x-2 mt-1">
            <Text className="text-[12px] text-[#787A80] font-PlusJakartaSansMedium">
              {item.role}
            </Text>
          </View>
        </View>
      </View>
      {renderFriendButton(item)}
    </TouchableOpacity>
  );

  const renderContactItem = ({ item }: { item: Contacts.Contact }) => (
    <View className="flex-row items-center justify-between p-4 border-b border-[#2A2B32]">
      <View className="flex-row items-center gap-x-3">
        <View className="w-12 h-12 rounded-full bg-[#2A2B32] items-center justify-center">
          <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
            {item.name?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">
            {item.name}
          </Text>
          <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
            {item.emails?.[0]?.email || "No email"}
          </Text>
        </View>
      </View>
      <TouchableOpacity className="bg-[#2A2B32] px-4 py-2 rounded-[8px]">
        <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
          Invite
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Separate FlatLists for users and contacts
  const renderUserList = () => (
    <FlatList
      data={filteredUsers}
      renderItem={renderUserItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );

  const renderContactList = () => (
    <FlatList
      data={filteredContacts}
      renderItem={renderContactItem}
      keyExtractor={(item) => item.id || item.name || Math.random().toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );

  return (
    <View className="flex-1">
      <View className="p-4">
        <View className="flex-row items-center bg-[#202227] rounded-[12px] px-4 py-3 mb-4">
          <Search01Icon size={24} color="#63656B" variant="solid" />
          <TextInput
            placeholder="Search users or contacts"
            placeholderTextColor="#63656B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium"
          />
        </View>

        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setTab("all")}
            className={`flex-1 py-2 ${
              tab === "all" ? "border-b-2 border-[#FF6D1B]" : ""
            }`}
          >
            <Text
              className={`text-center text-[16px] font-PlusJakartaSansMedium ${
                tab === "all" ? "text-[#f4f4f4]" : "text-[#787A80]"
              }`}
            >
              All Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab("contacts")}
            className={`flex-1 py-2 ${
              tab === "contacts" ? "border-b-2 border-[#FF6D1B]" : ""
            }`}
          >
            <Text
              className={`text-center text-[16px] font-PlusJakartaSansMedium ${
                tab === "contacts" ? "text-[#f4f4f4]" : "text-[#787A80]"
              }`}
            >
              Contacts
            </Text>
          </TouchableOpacity>
        </View>

        {tab === "contacts" && (
          <ImageBackground
            source={require("@/assets/images/friends.png")}
            style={{ width: wp("90%") }}
            className="h-[160px] rounded-[24px] pt-[40px] pl-[20px] overflow-hidden mb-[32px] mt-[16px] mx-auto"
          >
            <View className="">
              <Text className="text-[20px] font-PlusJakartaSansBold text-Grey/07 leading-[30px]">
                Looop is fun-er with friends
              </Text>
              <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07 leading-[30px]">
                Invite friends and unlock future rewards!
              </Text>
            </View>
            <View className="absolute right-6 bottom-4">
              <TouchableOpacity className="item bg-[#fff] px-[16px] py-[12px] flex-row items-center rounded-[24px] gap-x-[8px]">
                <Link05Icon size={16} color="#0A0B0F" variant="stroke" />
                <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07">
                  Invite friends
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}

        {tab === "all" ? renderUserList() : renderContactList()}
      </View>
    </View>
  );
};

export default AddFriends;
