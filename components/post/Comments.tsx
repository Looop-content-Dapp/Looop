import { FavouriteIcon, Message01Icon } from '@hugeicons/react-native';
import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

// Example comment data
const commentsData = [
  {
    id: '1',
    user: 'Zachv bia',
    avatar: 'https://pbs.twimg.com/profile_images/1784616489875591168/tw0FjMFi_400x400.jpg', // Replace with actual image URL
    role: 'Member',
    text: 'Lfg!! Mr Morale!!...the greatest to ever do it!!',
    time: '23m ago',
    likes: 5,
    replies: [
      {
        id: '1-1',
        user: 'Sketch',
        avatar: 'https://pbs.twimg.com/profile_images/1784691957496688640/Eju5nvP__400x400.jpg', // Replace with actual image URL
        role: 'Member',
        text: 'Yooo!...What city you reppin fam?',
        time: '23m ago',
        likes: 4,
        replies: [
          {
            id: '1-1-1',
            user: 'Dave Free',
            avatar: 'https://pbs.twimg.com/profile_images/1671887297544093698/Y8ZZ52gK_400x400.jpg', // Replace with actual image URL
            role: 'Moderator',
            text: 'You know it’s compton fam!',
            time: '23m ago',
            likes: 4,
            replies: []
          },
        ]
      },
    ]
  },
  {
    id: '2',
    user: 'big phee',
    avatar: 'https://pbs.twimg.com/profile_images/1813985712028385280/_kAuBB0g_400x400.jpg', // Replace with actual image URL
    role: 'Member',
    text: 'Mr Morale gimme high five...',
    time: '23m ago',
    likes: 0,
    replies: [
        {
            id: '1-1-1',
            user: 'Dave Free',
            avatar: 'https://pbs.twimg.com/profile_images/1671887297544093698/Y8ZZ52gK_400x400.jpg', // Replace with actual image URL
            role: 'Moderator',
            text: 'You know it’s compton fam!',
            time: '23m ago',
            likes: 4,
            replies: []
          },
    ]
  }
];

const Comments = () => {
    const renderItem = ({ item }) => (
      <View className="relative">
        <Comment comment={item} />
        {item.replies.length > 0 && (
          <View className="pl-8 relative">
            <View className="absolute top-0 left-5 bottom-0 w-px bg-gray-600"></View>
            <CommentsList comments={item.replies} />
          </View>
        )}
      </View>
    );

    return (
      <FlatList
        data={commentsData} // Change to commentsData
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
            minHeight: "100%"
        }}
      />
    );
  };

  export default Comments;

  const Comment = ({ comment }) => {
    return (
      <View className="flex-row mb-4 relative">
        <Image source={{ uri: comment.avatar }} className="w-10 h-10 rounded-full" />
        <View className="flex-1 ml-4">
          <View className="flex-row items-center justify-between">
            <View className='flex-row items-center'>
            <Text className="text-white font-PlusJakartaSansBold font-bold mr-2">{comment.user}</Text>
            <Text className="bg-gray-700 text-white text-xs font-PlusJakartaSansMedium rounded px-2 mr-2">{comment.role}</Text>
            </View>
           <View>
           <Text className="text-gray-400 font-PlusJakartaSansMedium text-xs">{comment.time}</Text>
           </View>
          </View>
          <Text className="text-white font-PlusJakartaSansRegular my-1">{comment.text}</Text>
          <View className="flex-row items-center mt-1">
            <TouchableOpacity className="flex-row items-center mr-4">
              <FavouriteIcon size={18} color="#fff" />
              <Text className="text-white ml-1">{comment.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center">
              <Message01Icon size={18} color="#fff" />
              <Text className="text-white font-PlusJakartaSansMedium ml-1">Reply</Text>
            </TouchableOpacity>
            {comment.replies.length > 0 && (
              <Text className="text-gray-400 text-xs font-PlusJakartaSansMedium ml-auto">{comment.replies.length} Replies</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const CommentsList = ({ comments }: { comments: any[] }) => {
    const renderItem = ({ item }: { item: any }) => (
      <View className="relative">
        <Comment comment={item} />
        {item.replies.length > 0 && (
          <View className="pl-8 relative">
            <View className="absolute top-0 left-5 bottom-0 w-px bg-gray-600"></View>
            <CommentsList comments={item.replies} />
          </View>
        )}
      </View>
    );

    return (
      <FlatList
        data={comments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    );
  };
