import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { Avatar } from "react-native-elements";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { formatNumber } from "../../utils/ArstsisArr";
import { useAppSelector } from "@/redux/hooks";
import { AppBackButton } from "@/components/app-components/back-btn";
import { FlatList } from 'react-native';
import { useQuery } from "@tanstack/react-query";
import api from "@/config/apiConfig";
import { ProfilePlaylist, ProfileTribes, StarSpotLight } from "../../components/profile";
import { useNotification } from "@/context/NotificationContext";

interface User {
  _id: string;
  username: string;
  fullname: string;
  profileImage: string | null;
  bio: string | null;
  email: string;
  following: number;
  friends: any[];
  artistPlayed: number;
}

const UserProfileView = () => {
    const { showNotification } = useNotification();
  const [selectedTab, setSelectedTab] = React.useState("Playlists");
  const [showFullBio, setShowFullBio] = React.useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  // Fetch user data
  const { data: userData, isLoading } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/api/user/${userId}`);
      return response.data.data;
    },
  });

  // Send friend request
  const handleAddFriend = async (friendId: string) => {
    try {
      await api.post(`/api/user/friend/${userdata?._id}/${friendId}`);
      showNotification({
        type: 'success',
        title: 'Friend Request Sent',
        message: 'Your friend request has been sent successfully!'
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to send friend request. Please try again.'
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Profile" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#f4f4f4]">Loading...</Text>
      </View>
    );
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Playlists":
        return <ProfilePlaylist userId={userId} />;
      case "Tribes":
        return <ProfileTribes userId={userId} />;
      case "Star spotlight":
        return <StarSpotLight userId={userId} />;
      default:
        return null;
    }
  };

  return (
    <View className="pt-5 px-[24px] flex-1">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="gap-y-[24px]">
              <View className="flex-row items-center justify-center mt-[5%]">
                <View className="items-center gap-y-[16px]">
                  <Avatar
                    source={{
                      uri: userData?.profileImage ||
                        "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
                    }}
                    size={75}
                    rounded
                    avatarStyle={{
                      borderWidth: 2,
                      borderColor: "#f4f4f4",
                    }}
                  />
                  <View className="flex-row items-center gap-x-[12px]">
                    <Text className="text-[24px] text-[#f4f4f4] font-PlusJakartaSansBold overflow-hidden">
                      {userData?.username}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats section */}
              <View className="flex-row items-center justify-around gap-x-[12px]">
                <View className="items-center">
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(userData?.following?.toString() as string ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Following
                  </Text>
                </View>

                <View className="mx-[12px] bg-gray-600 w-[1px] h-[24px]" />

                <View className="items-center">
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(userData?.friends?.length.toString() as string ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Friends
                  </Text>
                </View>

                <View className="mx-[12px] bg-gray-600 w-[1px] h-[24px]" />

                <View className="items-center">
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(userData?.artistPlayed ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Artistes played
                  </Text>
                </View>
              </View>

              {/* Add Friend Button */}
              <View className="mt-4 px-4">
                <TouchableOpacity
                    onPress={(e) => {
                        e.stopPropagation();
                        handleAddFriend(item._id);
                      }}
                  className="flex-1 flex-row items-center justify-center py-4 px-4 bg-[#12141B] border border-[#2A2B32] rounded-[12px] gap-x-2">
                  <Text className="text-[16px] text-[#D2D3D5] font-PlusJakartaSansMedium">Add Friend</Text>
                </TouchableOpacity>
              </View>

              {/* Description Section */}
              <View className="mt-4 mx-auto">
                <Text
                  className="text-[14px] text-center text-[#D2D3D5] font-PlusJakartaSansMedium"
                  numberOfLines={showFullBio ? undefined : 1}
                >
                  {userData?.bio || 'No description available'}
                </Text>
                {userData?.bio && userData.bio.length > 100 && (
                  <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
                    <Text className="text-[12px] text-center text-[#FF6D1B] font-PlusJakartaSansMedium mt-2">
                      {showFullBio ? 'See Less' : 'See More'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Tab Navigation */}
            <View className="flex-row justify-between items-center mt-[10%] mb-[24px]">
              {["Playlists", "Tribes", "Star spotlight"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  className="py-[12px]"
                >
                  <Text
                    className={`text-[16px] font-PlusJakartaSansMedium ${
                      selectedTab === tab ? "text-[#f4f4f4]" : "text-[#787A80]"
                    }`}
                  >
                    {tab}
                  </Text>
                  {selectedTab === tab && (
                    <View
                      style={{
                        height: 2,
                        backgroundColor: "#FF6D1B",
                        marginTop: 9,
                      }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        data={[{ key: 'content' }]}
        renderItem={() => renderTabContent()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default UserProfileView;
