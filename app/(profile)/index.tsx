import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { MoreHorizontalIcon, Settings02Icon, Share05Icon, Wallet02Icon, UserAdd01Icon } from "@hugeicons/react-native";
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
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuItemTitle
} from "@/components/DropDown";
import { useClerkAuthentication } from "@/hooks/useClerkAuthentication";
import { useAbstraxionAuth } from "@/hooks/useSocialAuth";
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
            <DropdownMenuRoot>
              <DropdownMenuTrigger asChild>
                <TouchableOpacity className="rounded-full">
                  <MoreHorizontalIcon size={24} color="#63656B" variant="solid" />
                </TouchableOpacity>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={5} align="end" className="bg-[#202227] rounded-[10px] w-[150px]">
                <DropdownMenuItem
                  key="edit-profile"
                  textValue="Edit Profile"
                  onSelect={() => router.push("/(profile)/editProfile")}
                  className="py-2 px-3"
                >
                  <Text className="text-[#f4f4f4] text-[14px]">Edit Profile</Text>
                </DropdownMenuItem>
                <DropdownMenuItem
                  key="logout"
                  textValue="Log Out"
                  onSelect={() => {
                  handleLogout()
                  router.dismissTo("/")
                  }}
                  className="py-2 px-3"
                >
                  <Text className="text-[#f4f4f4] text-[14px]">Log Out</Text>
                </DropdownMenuItem>
                <DropdownMenuItem
  key="delete-account"
  textValue="Delete Account"
  onSelect={() => {
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
  className="py-2 px-3"
>
  <DropdownMenuItemTitle color="red" style={{ color: "red" }}>
    Delete Account
  </DropdownMenuItemTitle>
</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuRoot>
          </View>
        )
      },
    });
  }, [navigation]);

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

//   if (isLoading) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text className="text-[#f4f4f4]">Loading...</Text>
//       </View>
//     );
//   }

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
