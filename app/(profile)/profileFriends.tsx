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
  import { MotiView } from 'moti';

  const ProfileFriends = () => {
    const [artistFollowing, setArtistFollowing] = useState<App.Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { fetchFollowingArtists, retrieveUserId, getUserFriends } = useQuery();

    useEffect(() => {
      // Fetching the list of artists that the user is following
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const userId = await retrieveUserId();
          if (userId) {
            const followingArtists = await getUserFriends(userId);
            setArtistFollowing(followingArtists.friends);
            console.log("my friends", followingArtists.friends)
          }
        } catch (error) {
          console.error('Failed to fetch following artists:', error);
        } finally {
          setIsLoading(false);
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
            Friends
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
            Search Friends
          </Text>
        </Pressable>

        {/* List of Artists or Skeleton Loading */}
        <FlatList
            data={artistFollowing}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <FollowingCard user={item} loading={isLoading}  />}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          />
      </SafeAreaView>
    );
  };

  // Following Card Component
  const FollowingCard = ({ user, loading }) => {
    console.log('single user', user);
    return (
        <>
        {loading ? (
           <View style={{ paddingHorizontal: 24 }}>
           {Array.from({ length: 5 }).map((_, index) => (
             <MotiView
               key={index}
               from={{ opacity: 0.3 }}
               animate={{ opacity: 1 }}
               transition={{
                 type: 'timing',
                 duration: 800,
                 loop: true,
                 repeatReverse: true,
               }}
               className="flex-row items-center justify-between py-[12px] mb-[12px]"
             >
               <View className="flex-row items-center gap-x-[12px]">
                 <MotiView
                   style={{ width: 48, height: 48, borderRadius: 24 }}
                   className="bg-[#1C1C1E]"
                   from={{ opacity: 0.3 }}
                   animate={{ opacity: 1 }}
                   transition={{
                     type: 'timing',
                     duration: 800,
                     loop: true,
                     repeatReverse: true,
                   }}
                 />
                 <View>
                   <MotiView
                     className="w-[100px] h-[16px] bg-[#1C1C1E] mb-[8px]"
                     from={{ opacity: 0.3 }}
                     animate={{ opacity: 1 }}
                     transition={{
                       type: 'timing',
                       duration: 800,
                       loop: true,
                       repeatReverse: true,
                     }}
                   />
                   <MotiView
                     className="w-[80px] h-[14px] bg-[#1C1C1E]"
                     from={{ opacity: 0.3 }}
                     animate={{ opacity: 1 }}
                     transition={{
                       type: 'timing',
                       duration: 800,
                       loop: true,
                       repeatReverse: true,
                     }}
                   />
                 </View>
               </View>
               <MotiView
                 className="px-[24px] py-[8px] bg-[#1C1C1E] rounded-[24px]"
                 from={{ opacity: 0.3 }}
                 animate={{ opacity: 1 }}
                 transition={{
                   type: 'timing',
                   duration: 800,
                   loop: true,
                   repeatReverse: true,
                 }}
               />
             </MotiView>
           ))}
         </View>
        ): (
            <View className="flex-row items-center justify-between py-[12px]">
            <View className="flex-row items-center gap-x-[12px]">
              <Image
                source={{ uri: user.profileImage }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
              <View>
                <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[16px]">
                  {user.name}
                </Text>
                <Text className="text-[#787A80] font-PlusJakartaSansRegular text-[14px]">
                  Genre: {user.genre}
                </Text>
              </View>
            </View>
            <Pressable className="px-[24px] py-[8px] bg-[#1C1C1E] rounded-[24px]">
              <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium">Following</Text>
            </Pressable>
          </View>
        )}
        </>

    );
  };

  export default ProfileFriends;
