import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { MoreHorizontalIcon, Settings02Icon, Share05Icon, Wallet02Icon, UserAdd01Icon, Edit01Icon, UserLock01Icon, UserMinus01Icon } from "@hugeicons/react-native";
import { Avatar } from "react-native-elements";
import {
  ProfilePlaylist,
  ProfileTribes,
  StarSpotLight,
} from "../../components/profile";
import { useNavigation, useRouter } from "expo-router";
import { useQuery } from "../../hooks/useQuery";
import { formatNumber } from "../../utils/ArstsisArr";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AppBackButton } from "@/components/app-components/back-btn";
import { useGetUser } from "@/hooks/useGetUser"; // Add this import
import { FlatList } from 'react-native' // Add this import if not already present
import { useClerkAuthentication } from "@/hooks/useClerkAuthentication";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion-react-native";


const profile = () => {
  const [selectedTab, setSelectedTab] = useState("Playlists");
  const [showFullBio, setShowFullBio] = useState(false);
  const { handleLogout } = useClerkAuthentication()
  const { logout } = useAbstraxionAccount()
  const navigation = useNavigation();

  const { userdata } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Use the hook and handle loading state
  const { data: result, isLoading } = useGetUser(userdata?._id);

  // Use result instead of userdata from Redux
  const currentUser = {
    ...(result || userdata)
  };

  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Profile" onBackPress={() => router.back()} />
      ),
      headerRight: () => {
        return (
          <View className="flex-row items-center gap-x-[16px] mr-4">
            <TouchableOpacity onPress={() => router.navigate("/wallet/userWallet")} className="bg-[#202227] p-[12px] rounded-full">
              <Wallet02Icon size={24} color="#63656B" variant="solid" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowOptionsModal(true)}
              className="rounded-full bg-[#202227] p-[12px]">
              <MoreHorizontalIcon size={24} color="#63656B" variant="solid" />
            </TouchableOpacity>
          </View>
        )
      },
    });
  }, [navigation]);

  const OptionsModal = ({ visible, onClose, onEditProfile, onLogout, onDeleteAccount }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="mt-auto bg-[#202227] rounded-t-[20px] pb-10"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="w-12 h-1 bg-[#2A2B32] rounded-full mx-auto mt-3 mb-6" />

          <TouchableOpacity
            onPress={onEditProfile}
            className="flex-row items-center px-6 py-4 border-b border-[#2A2B32]"
          >
            <Edit01Icon size={24} color="#63656B" variant="solid" />
            <Text className="text-[16px] text-[#f4f4f4] ml-4 font-PlusJakartaSansMedium">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLogout}
            className="flex-row items-center px-6 py-4 border-b border-[#2A2B32]"
          >
            <UserLock01Icon size={24} color="#63656B" variant="solid" />
            <Text className="text-[16px] text-[#f4f4f4] ml-4 font-PlusJakartaSansMedium">Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDeleteAccount}
            className="flex-row items-center px-6 py-4"
          >
            <UserMinus01Icon size={24} color="#FF3B30" variant="solid" />
            <Text className="text-[16px] text-[#FF3B30] ml-4 font-PlusJakartaSansMedium">Delete Account</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );

  // Function to generate a shareable link for the user
  const getAlbumShareLink = (albumId: any) => {
    return `https://yourapp.com/user/${albumId}`; // Replace with your actual URL scheme
  };

  // Share function
  const onShare = async (user: any) => {
    try {
      const albumUrl = getAlbumShareLink(user.id);
      const albumTitle = user.title;
      const albumArtist = user.artist || "Unknown Artist"; // Adjust based on your user data structure

      const message = `🎵 Check out My pofile and ;let explore some huge fun !\nListen here: ${albumUrl}`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Album shared successfully!");
          Alert.alert("Success", "Album shared successfully!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dialog dismissed");
      }
    } catch (error) {
      console.error("Error sharing user:", error);
      Alert.alert("Error", "Failed to share the user. Please try again.");
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Playlists":
        return <ProfilePlaylist />;
      case "Tribes":
        return <ProfileTribes userId={currentUser._id} />;
      case "Star spotlight":
        return <StarSpotLight />;
      default:
        return null;
    }
  };

  return (
    <View className="pt-5 px-[24px] flex-1">
      <OptionsModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onEditProfile={() => {
          setShowOptionsModal(false);
          router.push("/(profile)/editProfile");
        }}
        onLogout={() => {
          setShowOptionsModal(false);
          handleLogout();
          router.dismissTo("/");
        }}
        onDeleteAccount={() => {
          setShowOptionsModal(false);
          Alert.alert(
            "Delete Account",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  // Add your delete account logic here
                }
              }
            ]
          );
        }}
      />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="gap-y-[24px]">
              <View className="flex-row items-center justify-center mt-[5%]">
                <View className="items-center gap-y-[16px]">
                  <Avatar
                    source={{
                      uri: currentUser?.profileImage ||
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
                      {currentUser?.username}
                    </Text>
                  </View>
                </View>

              </View>

              {/* Stats section */}
              <View className="flex-row items-center justify-around gap-x-[12px]">
                <TouchableOpacity
                  onPress={() => router.push("/(profile)/profileFollowing")}
                  className="items-center"
                >
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(currentUser?.following?.toString() as string ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Following
                  </Text>
                </TouchableOpacity>

                <View className="mx-[12px] bg-gray-600 w-[1px] h-[24px]" />

                <TouchableOpacity
                  onPress={() => router.push({
                    pathname: "/(profile)/profileFriends",
                    params: { userId: currentUser?._id },
                  })}
                  className="items-center"
                >
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(userdata?.friends?.length.toString() as string ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Friends
                  </Text>
                </TouchableOpacity>

                <View className="mx-[12px] bg-gray-600 w-[1px] h-[24px]" />

                <TouchableOpacity className="items-center">
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(userdata?.artistPlayed ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Artistes played
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-around items-center mt-4 gap-x-2 px-4">
                <TouchableOpacity
                  onPress={() => router.push("/(profile)/editProfile")}
                  className="flex-1 flex-row items-center justify-center py-4 px-4 bg-[#12141B] border border-[#2A2B32] rounded-[12px] gap-x-2">
                  <Text className="text-[16px] text-[#D2D3D5] font-PlusJakartaSansMedium">Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onShare(currentUser)}
                  className="flex-1 flex-row items-center justify-center py-4 px-4 bg-[#12141B] border border-[#2A2B32] rounded-[12px] gap-x-2">
                  <Text className="text-[16px] text-[#D2D3D5] font-PlusJakartaSansMedium">Share Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/(profile)/addFriends")}
                  className="flex-row items-center justify-center p-3 bg-[#12141B] border border-[#2A2B32] rounded-[12px]">
                  <UserAdd01Icon size={24} color="#63656B" variant="solid" />
                </TouchableOpacity>
              </View>

              {/* Description Section */}
              <View className="mt-4 mx-auto">
                <Text
                  className="text-[14px] text-center text-[#D2D3D5] font-PlusJakartaSansMedium"
                  numberOfLines={showFullBio ? undefined : 1}
                >
                  {currentUser?.bio || 'No description available'}
                </Text>
                {currentUser?.bio && currentUser.bio.length > 100 && (
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

export default profile;
