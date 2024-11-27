import { View, Text, TouchableOpacity, ScrollView, Share, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft02Icon, MoreHorizontalIcon, Share05Icon } from '@hugeicons/react-native';
import { Avatar } from 'react-native-elements';
import { useUser } from '@clerk/clerk-expo';
import { ProfilePlaylist, ProfileTribes, StarSpotLight } from '../../components/profile';
import { router } from 'expo-router';
import { useQuery } from '../../hooks/useQuery';
import { formatNumber } from '../../utils/ArstsisArr';

const profile = () => {
  const [selectedTab, setSelectedTab] = useState('Playlists');
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile]= useState<any>()


  const { retrieveUserId, getUserById } = useQuery();

  useEffect(() => {
      const fetchSubscriptions = async () => {
          try {
              setLoading(true); // Set loading to true before fetching
              const id = await retrieveUserId()
              if(id){
              const user = await getUserById(id)
                setUserProfile(user.data)
              }
          } catch (error) {
              console.error("Error fetching genres:", error);
          } finally {
              setLoading(false); // Set loading to false after fetching
          }
      };
      fetchSubscriptions();
  }, []);

  // Function to generate a shareable link for the user
  const getAlbumShareLink = (albumId) => {
    return `https://yourapp.com/user/${albumId}`; // Replace with your actual URL scheme
  };

  // Share function
  const onShare = async (user: any) => {
    try {
      const albumUrl = getAlbumShareLink(user.id);
      const albumTitle = user.title;
      const albumArtist = user.artist || 'Unknown Artist'; // Adjust based on your user data structure

      const message = `🎵 Check out My pofile and ;let explore some huge fun !\nListen here: ${albumUrl}`;

      const result = await Share.share({
        message,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Album shared successfully!');
          Alert.alert('Success', 'Album shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dialog dismissed');
      }
    } catch (error) {
      console.error('Error sharing user:', error);
      Alert.alert('Error', 'Failed to share the user. Please try again.');
    }
  };

    return (
        <SafeAreaView style={{ flex: 1, minHeight: "100%",}}>
            <View className="flex-row items-center justify-between h-[80px]  py-[24px] pl-[12px]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-[32px] h-[32px]"
                    >
                        <ArrowLeft02Icon size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
                        My Profile
                    </Text>
                </View>
                <MoreHorizontalIcon size={32} color="#787A80" />
            </View>

      <View className='gap-y-[24px]'>
        <View className='flex-row items-center justify-between h-[80px] px-[24px]'>
          <View className='flex-row items-center gap-x-[16px]'>
            <Avatar
              source={{
                 uri:
                 userProfile?.profileImage ?
                  userProfile?.profileImage :
                  "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg"
                }}
              size={64}
              rounded
            />
            <View className='flex-row items-center gap-x-[12px]'>
            <Text className='text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold overflow-hidden'>
              {userProfile?.username}
            </Text>
            <TouchableOpacity className='border border-Grey/06 py-[8px] px-[12px] rounded-[24px]'>
                <Text className='text-[12px] text-Grey/04 font-PlusJakartaSansBold'>Edit</Text>
            </TouchableOpacity>
            </View>

          </View>
          <TouchableOpacity onPress={onShare}>
          <Share05Icon size={24} color='#787A80' />
          </TouchableOpacity>

        </View>

        <View className='flex-row items-center justify-center gap-x-[12px]'>
          <TouchableOpacity onPress={() => router.push("/(profile)/profileFollowing")} className='items-center border-r-2 '>
            <Text className='text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]'>{formatNumber(userProfile?.following ? userProfile.following : 0)}</Text>
            <Text className='text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]'>Following</Text>
          </TouchableOpacity>
          <View className='mx-[12px] bg-[#12141b] w-[1px] h-[20px]' />
          <TouchableOpacity onPress={() => router.push("/(profile)/profileFriends")} className='items-center'>
            <Text className='text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]'>{formatNumber(userProfile?.friendsCount ? userProfile.friendsCount : 0)}</Text>
            <Text className='text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]'>Friends</Text>
          </TouchableOpacity>
          <View className='mx-[12px] bg-[#12141b] w-[1px] h-[20px]' />
          <TouchableOpacity className='items-center'>
            <Text className='text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]'>{formatNumber(userProfile?.artistPlayed ? userProfile.artistPlayed : 0)}</Text>
            <Text className='text-[12px] font-PlusJakartaSansBold text-[#D2D3D5]'>Artistes played</Text>
          </TouchableOpacity>
        </View>

                <TouchableOpacity onPress={() => router.push("/creatorOnboarding")} className="border border-[#787A80] rounded-[10px] items-center py-[16px]">
                    <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/04">
                        Switch to Artiste profile
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Tab Navigation */}
            <View className="flex-row justify-around items-center mt-[24px]">
                {["Playlists", "Tribes", "Star spotlight"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setSelectedTab(tab)}
                        className="py-[12px]"
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansBold ${
                                selectedTab === tab
                                    ? "text-[#f4f4f4]"
                                    : "text-[#787A80]"
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

            {/* Content for selected tab */}
            <ScrollView className="flex-1 mt-[24px]">
                {selectedTab === "Playlists" && <ProfilePlaylist />}
                {selectedTab === "Tribes" && <ProfileTribes />}
                {selectedTab === "Star spotlight" && <StarSpotLight />}
            </ScrollView>
        </SafeAreaView>
    );
};

export default profile;
