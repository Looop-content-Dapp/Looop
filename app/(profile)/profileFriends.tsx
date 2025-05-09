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
  import { MotiView } from 'moti';

  import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/config/apiConfig';

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

const ProfileFriends = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();

    const { data: users = [], isLoading } = useQuery<User[]>({
        queryKey: ['user'],
        queryFn: async () => {
          const response = await api.get(`/api/user/friend/${userId}`);
          console.log("my friends", response.data.data)
          return response.data.data
        },
      });

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
            data={users}
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
           <View style={{ paddingHorizontal: 14 }}>
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
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/(profile)/userProfileView',
        params: { userId: user?._id }
      })}
      className="flex-row items-center justify-between p-4 border-b border-[#2A2B32]">
      <View className="flex-row items-center gap-x-3">
        <Image
          source={{ uri: user?.profileImage || 'https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg' }}
          className="w-12 h-12 rounded-full"
        />
        <View>
          <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">{user?.fullname || user?.username}</Text>
          <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">{user?.email.slice(0, 12)}...{user?.email.slice(15, 20)}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
        //   handleAddFriend(item._id);
        }}
        className="bg-[#FF6D1B] px-4 py-2 rounded-[8px]"
      >
        <Text className="text-[14px] text-[#f4f4f4] font-PlusJakartaSansMedium">Add Friend</Text>
      </TouchableOpacity>
    </TouchableOpacity>
        )}
        </>

    );
  };

  export default ProfileFriends;
