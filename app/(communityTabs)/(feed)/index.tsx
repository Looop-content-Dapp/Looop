import { View, FlatList, ActivityIndicator, Text, Image, Animated, RefreshControl } from 'react-native';
import React, { useLayoutEffect, useRef, useEffect } from 'react';
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

const SkeletonPost = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  return (
    <View className="bg-[#2a2a2a] rounded-lg p-4 mb-4 overflow-hidden">
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          transform: [{ translateX }],
        }}
      />
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-full bg-[#3a3a3a]" />
        <View className="ml-3">
          <View className="w-24 h-4 bg-[#3a3a3a] rounded" />
          <View className="w-16 h-3 bg-[#3a3a3a] rounded mt-2" />
        </View>
      </View>
      <View className="w-full h-40 bg-[#3a3a3a] rounded-lg mb-4" />
      <View className="w-3/4 h-4 bg-[#3a3a3a] rounded" />
      <View className="w-1/2 h-4 bg-[#3a3a3a] rounded mt-2" />
      <View className="flex-row justify-between mt-4">
        <View className="w-16 h-8 bg-[#3a3a3a] rounded" />
        <View className="w-16 h-8 bg-[#3a3a3a] rounded" />
        <View className="w-16 h-8 bg-[#3a3a3a] rounded" />
      </View>
    </View>
  );
};

const Feed = () => {
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = React.useState(false);
    const { data, isLoading, isError, refetch, isFetching } = useUserFeed();
    const { userdata } = useAppSelector((state) => state.auth);

    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }, []);

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

  if (isLoading) {
    return (
      <View className="flex-1 min-h-full mt-8">
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <SkeletonPost />}
          keyExtractor={(item) => `skeleton-${item}`}
          contentContainerStyle={{
            marginHorizontal: 4,
            paddingBottom: 32
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f4f4f4" />
          }
        />
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
      {isFetching && !refreshing && (
        <ActivityIndicator
          size="large"
          color="#f4f4f4"
          style={{ position: 'absolute', top: 10, alignSelf: 'center', zIndex: 1 }}
        />
      )}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f4f4f4" />
        }
      />
    </View>
  );
};

export default Feed;
