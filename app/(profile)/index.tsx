import { AppBackButton } from "@/components/app-components/back-btn";
import { useClerkAuthentication } from "@/hooks/auth/useAuth";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useAppSelector } from "@/redux/hooks";
import { useAbstraxionAccount } from "@burnt-labs/abstraxion-react-native";
import {
  Edit01Icon,
  MoreHorizontalIcon,
  Setting06Icon,
  UserAdd01Icon,
  UserLock01Icon,
  UserMinus01Icon,
  Wallet02Icon,
} from "@hugeicons/react-native";
import { useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  ActivityIndicator, // Import ActivityIndicator
  Alert,
  FlatList,
  Modal,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
  ProfilePlaylist,
  ProfileTribes,
  StarSpotLight,
} from "../../components/profile";
import { formatNumber } from "../../utils/ArstsisArr";

const profile = () => {
  const [selectedTab, setSelectedTab] = useState("Playlists");
  const [showFullBio, setShowFullBio] = useState(false);
  const { handleLogout } = useClerkAuthentication();
  const navigation = useNavigation();

  const { userdata } = useAppSelector((state) => state.auth); // Keep this for initial checks or other purposes if needed
  const router = useRouter();

  // Use the hook and handle loading/error states
  const { data: result, isLoading, isError, error } = useGetUser();
  if (isError) {
    console.error("Profile screen - error from useGetUser:", error);
  }

  // Use result instead of userdata from Redux for the main display
  const currentUser = result ? { ...result || userdata } : null; // Set to null if no result

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
            <TouchableOpacity
              onPress={() => router.navigate("/wallet/userWallet")}
              className=""
            >
              <Wallet02Icon size={24} color="#63656B" variant="solid" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowOptionsModal(true)}
              className=""
            >
              <MoreHorizontalIcon size={24} color="#63656B" variant="solid" />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation]);

  interface OptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onEditProfile: () => void;
  }

  const OptionsModal: React.FC<OptionsModalProps> = ({
    visible,
    onClose,
    onEditProfile,
  }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
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
            <Text className="text-[16px] text-[#f4f4f4] ml-4 font-PlusJakartaSansMedium">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push("/settings");
            }}
            className="flex-row items-center px-6 py-4 border-b border-[#2A2B32]"
          >
            <Setting06Icon size={24} color="#63656B" variant="solid" />
            <Text className="text-[16px] text-[#f4f4f4] ml-4 font-PlusJakartaSansMedium">
              Settings
            </Text>
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
    if (!user || !user._id) {
      Alert.alert("Error", "User data is not available to share. Please try again later.");
      return;
    }
    try {
      // Use user._id for the link and user.username for the message
      const profileUrl = `https://yourapp.com/user/${user._id}`;
      const userName = user.username || "A Looop User";

      const message = `🎵 Check out ${userName}'s profile on Looop and let's explore some huge fun! 👀
Profile link: ${profileUrl}`;

      const shareResult = await Share.share({
        message,
      });

      if (shareResult.action === Share.sharedAction) {
        if (shareResult.activityType) {
          console.log("Shared with activity type:", shareResult.activityType);
        } else {
          console.log("Profile shared successfully!");
          // Alert.alert("Success", "Profile shared successfully!"); // Optional: can be a bit intrusive
        }
      } else if (shareResult.action === Share.dismissedAction) {
        console.log("Share dialog dismissed");
      }
    } catch (shareError: any) {
      console.error("Error sharing profile:", shareError);
      Alert.alert("Error", `Failed to share the profile: ${shareError.message}`);
    }
  };

  const renderTabContent = () => {
    if (!currentUser) return null; // Don't render tabs if no user data
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
      />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="gap-y-[24px]">
              <View className="flex-row items-center justify-center mt-[5%]">
                <View className="items-center gap-y-[16px]">
                  <Avatar
                    source={{
                      uri:
                        currentUser?.profileImage ||
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
                      {currentUser?.username || 'Username'}
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
                    {formatNumber(
                      currentUser?.following?.toString() ?? "0"
                    )}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Following
                  </Text>
                </TouchableOpacity>

                <View className="mx-[12px] bg-gray-600 w-[1px] h-[24px]" />

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(profile)/profileFriends",
                      params: { userId: currentUser?._id },
                    })
                  }
                  className="items-center"
                >
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(
                      currentUser?.friendsCount?.toString() ?? "0" // Use friendsCount if available, or friends.length
                    )}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Friends
                  </Text>
                </TouchableOpacity>

                <View className="mx-[12px] bg-gray-600 w-[1px] h-[24px]" />

                <TouchableOpacity className="items-center">
                  <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {formatNumber(currentUser?.artistPlayed?.toString() ?? "0")}
                  </Text>
                  <Text className="text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]">
                    Artistes
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-around items-center mt-4 gap-x-2 px-4">
                <TouchableOpacity
                  onPress={() => router.push("/(profile)/editProfile")}
                  className="flex-1 flex-row items-center justify-center py-4 px-4 bg-[#12141B] border border-[#2A2B32] rounded-[12px] gap-x-2"
                >
                  <Text className="text-[16px] text-[#D2D3D5] font-PlusJakartaSansMedium">
                    Edit Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onShare(currentUser)} // Pass the currentUser object
                  className="flex-1 flex-row items-center justify-center py-4 px-4 bg-[#12141B] border border-[#2A2B32] rounded-[12px] gap-x-2"
                >
                  <Text className="text-[16px] text-[#D2D3D5] font-PlusJakartaSansMedium">
                    Share Profile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/(profile)/addFriends")}
                  className="flex-row items-center justify-center p-3 bg-[#12141B] border border-[#2A2B32] rounded-[12px]"
                >
                  <UserAdd01Icon size={24} color="#63656B" variant="solid" />
                </TouchableOpacity>
              </View>

              {/* Description Section */}
              <View className="mt-4 mx-auto">
                <Text
                  className="text-[14px] text-center text-[#D2D3D5] font-PlusJakartaSansMedium"
                  numberOfLines={showFullBio ? undefined : 1}
                >
                  {currentUser?.bio || "No description available. Edit your profile to add one!"}
                </Text>
                {currentUser?.bio && currentUser.bio.length > 100 && (
                  <TouchableOpacity
                    onPress={() => setShowFullBio(!showFullBio)}
                  >
                    <Text className="text-[12px] text-center text-[#FF6D1B] font-PlusJakartaSansMedium mt-2">
                      {showFullBio ? "See Less" : "See More"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Tab Navigation */}
            <View className="flex-row justify-between items-end mt-8 mb-6">
              {["Playlists", "Tribes", "Star spotlight"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  className="flex-1 items-center"
                  style={{ minWidth: 0 }}
                >
                  <View
                    className={`w-full items-center pb-3 ${
                      selectedTab === tab
                        ? "border-b-2 border-[#FF6D1B]"
                        : "border-b-2 border-transparent"
                    }`}
                  >
                    <Text
                      className={`text-[16px] font-PlusJakartaSansMedium ${
                        selectedTab === tab
                          ? "text-[#f4f4f4]"
                          : "text-[#787A80]"
                      }`}
                    >
                      {tab}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        data={[{ key: "content" }]}
        renderItem={() => renderTabContent()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default profile;
