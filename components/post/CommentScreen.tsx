import React from 'react';
import { View, FlatList } from 'react-native';
import Comment from './Comment';


// Sample data based on image description
const commentsData = [
  {
    id: '1',
    user: {
      username: 'ImylarHastros',
      profileImage: 'https://example.com/profile1.jpg',
      isVerified: false,
    },
    timestamp: '2h ago',
    text: 'So talented in your creativity, I\'m retired at 47, went from Grace to Grace. This video here reminds me of my transformation from a nobody to good home, honest wife and 35k...',
    likes: 192,
    replies: [
      {
        id: '1.1',
        user: {
          username: 'Max_Jean',
          profileImage: 'https://example.com/profile2.jpg',
          isVerified: false,
        },
        timestamp: '1h ago',
        text: 'He\'s the right combo of marketer and engineer, congrats to him!',
        likes: 3,
        replies: [],
        isEdited: false,
      },
    ],
    isEdited: true,
  },
  {
    id: '2',
    user: {
      username: 'simonbusshart1463',
      profileImage: 'https://example.com/profile3.jpg',
      isVerified: false,
    },
    timestamp: '10h ago',
    text: 'really nice and humble guy great inspo thank',
    likes: 0,
    replies: [],
    isEdited: false,
  },
];

const CommentsScreen = () => {
  return (
    <View className="flex-1 p-4">
      <FlatList
        data={commentsData}
        renderItem={({ item }) => <Comment comment={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CommentsScreen;
