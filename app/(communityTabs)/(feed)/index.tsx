import { View, FlatList, ActivityIndicator, Text, Image, Animated, RefreshControl } from 'react-native';
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import PostCard from '../../../components/cards/PostCard';
import { useUserFeed } from '../../../hooks/useUserFeed';
import { useAppSelector } from '@/redux/hooks';
import { router, useNavigation } from 'expo-router';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { MotiView } from 'moti';
import NowPlaying from '@/components/player/NowPlaying';

// Post rendering component
const renderPost = ({ item }) => (
  <PostCard item={item} />
);

// Key extractor function
const keyExtractor = (item) => item._id;

const SkeletonPost = () => {
  return (
    <View className="bg-[#111318] rounded-lg p-4 mb-4">
      <View className="flex-row items-center mb-4">
        <MotiView
          className="w-10 h-10 rounded-full bg-[#202227]"
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
          }}
        />
        <View className="ml-3">
          <MotiView
            className="w-24 h-4 bg-[#202227] rounded"
            from={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
            }}
          />
          <MotiView
            className="w-16 h-3 bg-[#202227] rounded mt-2"
            from={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
              delay: 100,
            }}
          />
        </View>
      </View>
      <MotiView
        className="w-full h-40 bg-[#202227] rounded-lg mb-4"
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
          delay: 200,
        }}
      />
      <MotiView
        className="w-3/4 h-4 bg-[#202227] rounded"
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
          delay: 300,
        }}
      />
      <MotiView
        className="w-1/2 h-4 bg-[#202227] rounded mt-2"
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
          delay: 400,
        }}
      />
      <View className="flex-row justify-between mt-4">
        {[1, 2, 3].map((_, index) => (
          <MotiView
            key={index}
            className="w-16 h-8 bg-[#202227] rounded"
            from={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
              delay: 500 + (index * 100),
            }}
          />
        ))}
      </View>
    </View>
  );
};

const EmptyFeedState = () => {
    return (
      <View className="flex-1 justify-center items-center mt-[30%] px-8 " style={{ minHeight: '70%' }}>
        <Image
          source={require('../../../assets/images/NoPostState.png')}
          className="w-[140px] h-[140px] mb-8"
          resizeMode="contain"
        />
        <Text className="text-[#f4f4f4] text-center text-xl font-PlusJakartaSansBold mb-3">
          Your feed is looking a little empty!
        </Text>
        <Text className="text-[#888] text-center text-base font-PlusJakartaSansMedium px-4">
          Start following more artists and explore your first community to see content here.
        </Text>
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
      <View className="flex-1 min-h-full">
        <NowPlaying />
        <View className="mt-8">
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
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1">
        <NowPlaying />
        <View className="flex-1 justify-center items-center">
          <Text className="text-white">Error loading feed</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 min-h-full">
    <NowPlaying />
    <View className="mt-8 flex-1">
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
        ListEmptyComponent={!isLoading && !isError ? <EmptyFeedState /> : null}
        contentContainerStyle={{
          flexGrow: 1,
        //   paddingHorizontal: 16,
          paddingBottom: 32,
        }}
        style={{
          width: '100%'
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f4f4f4" />
        }
        initialNumToRender={5}
      />
    </View>
  </View>
  );
};

export default Feed;
