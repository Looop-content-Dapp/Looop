import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Settings02Icon, Share05Icon, Wallet02Icon } from "@hugeicons/react-native";
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
import { setUserData } from "@/redux/slices/auth";
import { useGetUser } from "@/hooks/useGetUser"; // Add this import
import { FlatList } from 'react-native' // Add this import if not already present

const profile = () => {
  const [selectedTab, setSelectedTab] = useState("Playlists");
  const navigation = useNavigation();

  const { userdata } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Use the hook and handle loading state
  const { data: result, isLoading } = useGetUser(userdata?._id);
  console.log(userdata?._id, "result")

  // Use result instead of userdata from Redux
  const currentUser = result || userdata;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Profile" onBackPress={() => router.back()} />
      ),
      headerRight: () => {
        return (
          <View className="flex-row items-center gap-x-[16px] mr-4">
            <TouchableOpacity onPress={() => router.navigate("/wallet/userWallet")}>
              <Wallet02Icon size={24} color="#787A80" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("/settings")}>
              <Settings02Icon size={24} color="#787A80" />
            </TouchableOpacity>
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
        return <ProfileTribes />;
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
              <View className="flex-row items-center justify-between h-[80px]">
                <View className="flex-row items-center gap-x-[16px]">
                  <Avatar
                    source={{
                      uri: currentUser?.profileImage ||
                        "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
                    }}
                    size={64}
                    rounded
                  />
                  <View className="flex-row items-center gap-x-[12px]">
                    <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold overflow-hidden">
                      {currentUser?.username}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/(profile)/editProfile")} className="border border-Grey/06 py-[8px] px-[12px] rounded-[24px]">
                      <Text className="text-[12px] text-Grey/04 font-PlusJakartaSansBold">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity onPress={() => onShare(currentUser)}>
                  <Share05Icon size={24} color="#787A80" />
                </TouchableOpacity>
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
                  onPress={() => router.push("/(profile)/profileFriends")}
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

              <TouchableOpacity
                onPress={() => currentUser?.artist !== null ? router.push("/(artisteTabs)/(dashboard)"): router.push("/creatorOnboarding")}
                className="border border-[#787A80] rounded-[10px] my-6 items-center py-[14px]"
              >
                <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/04">
                  Switch to Artiste profile
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View className="flex-row justify-between items-center mt-[24px] mb-[24px]">
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
