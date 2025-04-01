import { View, FlatList, ActivityIndicator, Text, Image } from 'react-native';
import React, { useLayoutEffect } from 'react';
import PostCard from '../../../components/cards/PostCard';
import { useUserFeed } from '../../../hooks/useUserFeed';
import { useAppSelector } from '@/redux/hooks';
import { router, useNavigation } from 'expo-router';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';

// Post rendering component
const renderPost = ({ item }) => (
  <PostCard item={item} />
);

// Key extractor function
const keyExtractor = (item) => item._id;

const Feed = () => {
    const navigation = useNavigation()
  const { data, isLoading, isError } = useUserFeed();
  const { userdata} = useAppSelector((state) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
       headerLeft: () => <View className='flex-1 flex-row items-center gap-x-[76px]'>
          <Text className='text-[24px] font-PlusJakartaSansMedium  text-[#f4f4f4]'>My Feed</Text>
          <Image source={require("../../../assets/images/logo-gray.png")} className='w-[45px] h-[20px]' />
       </View>,
       headerRight: () =>  <Avatar
       source={{
         uri:
           userdata?.profileImage
             ? userdata?.profileImage
             : "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
       }}
       size={40}
       rounded
       onPress={() => router.push("/(profile)") }
       avatarStyle={{
         borderWidth: 2,
         borderColor: "#f4f4f4",
       }}
     />,
       headershown: true,
       title: ""
    })
  }, [])

  /**
   *   <Image source={require("../../../assets/images/logo-gray.png")} className='w-[45px] h-[20px]' />
            <Avatar
                rounded
                source={{
                  uri: userdata?.profileImage
                }}
                size={40}
             />
             <Text className='text-[24px] font-PlusJakartaSansMedium  text-[#f4f4f4]'>My Feed</Text>
   */

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Error loading feed</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 min-h-full mt-8">
      <FlatList
        data={data?.data?.posts || []}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          rowGap: 20,
          marginHorizontal: 4,
          alignContent: "center",
          justifyContent: "center",
          paddingBottom: 32
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Feed;
