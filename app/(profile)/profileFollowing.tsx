import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Pressable,
    FlatList,
    Image,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import { ArrowLeft02Icon, Search01Icon } from '@hugeicons/react-native';
  import { router } from 'expo-router';
  import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
  import { useQuery } from '../../hooks/useQuery';

  const ProfileFollowing = () => {
    const [artistFollowing, setArtistFollowing] = useState<App.Artist[]>([]);
    const { fetchFollowingArtists, retrieveUserId } = useQuery();

    useEffect(() => {
      // Fetching the list of artists that the user is following
      const fetchData = async () => {
        try {
          const userId = await retrieveUserId();
          if (userId) {
            const followingArtists = await fetchFollowingArtists(userId);
            setArtistFollowing(followingArtists.data);
            console.log("follwoing ", followingArtists.data)
          }
        } catch (error) {
          console.error('Failed to fetch following artists:', error);
        }
      };
      fetchData();
    }, []);

    return (
      <SafeAreaView style={{ flex: 1, minHeight: '100%' }}>
        {/* Header */}
        <View className="flex-row items-center gap-x-[16px] pl-[24px] pt-[24px]">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft02Icon size={24} color="#fff" variant="solid" />
          </TouchableOpacity>
          <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
            Following
          </Text>
        </View>

        {/* Search Bar */}
        <Pressable
          style={{
            width: wp('90%'),
          }}
          className="mx-auto py-[15px] pl-[16px] pr-[63px] bg-[#0A0B0F] h-[48px] flex-row items-center gap-x-[12px] my-[15px]"
        >
          <Search01Icon size={16} color="#787A80" />
          <Text className="text-[12px] font-PlusJakartaSansRegular text-Grey/06">
            Search artistes
          </Text>
        </Pressable>

        {/* List of Artists */}
        <FlatList
          data={artistFollowing}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <FollowingCard item={item} />}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      </SafeAreaView>
    );
  };

  export default ProfileFollowing;

  // Following Card Component
  const FollowingCard = ({ item }) => {
    console.log("artis i follow", item)
    return (
      <View className="flex-row items-center justify-between py-[12px]">
        <View className="flex-row items-center gap-x-[12px]">
          <Image
            source={{ uri: item.artist.images[0].url }}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <View>
            <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[16px]">
              {item.artist.name}
            </Text>
            <Text className="text-[#787A80] font-PlusJakartaSansRegular text-[14px]">
              Genre: {item.artist.genre}
            </Text>
          </View>
        </View>
        <Pressable className="px-[24px] py-[8px] bg-[#1C1C1E] rounded-[24px]">
          <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium">Following</Text>
        </Pressable>
      </View>
    );
  };
