import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Pressable, LayoutChangeEvent } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { EllipseSelectionIcon, ThumbsUpIcon, ThumbsDownIcon, ReplayIcon } from '@hugeicons/react-native';

interface CommentProps {
  comment: {
    id: string;
    user: { username: string; profileImage: string; isVerified: boolean };
    timestamp: string;
    text: string;
    likes: number;
    replies: any[];
    isEdited: boolean;
  };
  level?: number; // Tracks nesting level for indentation
}

const Comment: React.FC<CommentProps> = ({ comment, level = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  // Measure the height of the comment content to determine the straight line length
  const onContentLayout = (event: LayoutChangeEvent) => {
    setContentHeight(event.nativeEvent.layout.height);
  };

  // Function to render the curved line
  const renderCurvedLine = () => {
    const startX = 20; // Center of the profile image (w-10 = 40px, so 20px)
    const startY = 40; // Bottom of the profile image (h-10 = 40px)
    const endX = 20 + level * 24; // Adjust end point based on nesting level (24px per level)
    const endY = contentHeight + 40; // End at the reply's profile image (content height + profile image height)

    // Straight line for most of the path, then a gentle curve to the reply
    const straightLength = endY - 40; // Straight part until 40px before the end
    const curveStartY = startY + straightLength;
    const path = `
      M ${startX} ${startY}
      L ${startX} ${curveStartY}
      Q ${startX} ${endY - 10}, ${endX} ${endY}
    `;

    return (
      <Svg height={endY + 10} width={Math.max(startX, endX) + 10} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Path d={path} stroke="#757575" strokeWidth="2" fill="none" />
      </Svg>
    );
  };

  return (
    <View className={`flex-row mb-4 ml-${level * 6}`}>
      {/* Profile Image with Curved Line */}
      <View className="relative">
        <Image
          source={{ uri: comment.user.profileImage }}
          className="w-10 h-10 rounded-full"
        />
        {comment.replies.length > 0 && showReplies && renderCurvedLine()}
      </View>

      {/* Comment Content */}
      <View className="ml-4 flex-1" onLayout={onContentLayout}>
        {/* User Info */}
        <View className="flex-row items-center">
          <Text className="text-white font-bold">{comment.user.username}</Text>
          {comment.user.isVerified && (
            <Image
              source={{ uri: 'https://example.com/verified.png' }}
              className="w-4 h-4 ml-1"
            />
          )}
          <Text className="text-gray-400 ml-2">· {comment.timestamp}</Text>
          {comment.isEdited && <Text className="text-gray-400 ml-1">(edited)</Text>}
          <Pressable className="ml-auto">
            <EllipseSelectionIcon className="w-5 h-5 text-gray-400" />
          </Pressable>
        </View>

        {/* Comment Text */}
        <Text className="text-white mt-1">
          {comment.text.length > 100 ? (
            <>
              {comment.text.slice(0, 100)}...
              <Text className="text-gray-400"> Read more</Text>
            </>
          ) : (
            comment.text
          )}
        </Text>

        {/* Interaction Icons */}
        <View className="flex-row mt-2">
          <Pressable className="flex-row items-center mr-4">
            <ThumbsUpIcon className="w-5 h-5 text-gray-400" />
            <Text className="text-gray-400 ml-1">{comment.likes}</Text>
          </Pressable>
          <Pressable className="flex-row items-center mr-4">
            <ThumbsDownIcon className="w-5 h-5 text-gray-400" />
          </Pressable>
          <Pressable className="flex-row items-center">
            <ReplayIcon className="w-5 h-5 text-gray-400" />
          </Pressable>
        </View>

        {/* Replies Toggle */}
        {comment.replies.length > 0 && (
          <Pressable
            onPress={() => setShowReplies(!showReplies)}
            className="mt-2"
          >
            <Text className="text-white">
              {comment.replies.length} replies{' '}
              <Text className="text-gray-400">{showReplies ? '▲' : '▼'}</Text>
            </Text>
          </Pressable>
        )}

        {/* Nested Replies */}
        {showReplies && (
          <View className="mt-2">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} level={level + 1} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default Comment;
