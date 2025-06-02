import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Keyboard, Pressable } from 'react-native';
import Animated, { FadeIn, withSpring, useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { FavouriteIcon, Comment02Icon, Share05Icon, EyeIcon } from '@hugeicons/react-native';
import { router } from 'expo-router';
// import Reanimated, { withSpring, useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { useAppSelector } from '@/redux/hooks';
import CommentsBottomSheet from '@/components/bottomSheet/CommentsBottomSheet';
import { Portal } from '@gorhom/portal';

interface Engagement {
  likes: number;
  comments: number;
  shares: number;
  plays?: number;
}

interface Actions {
  like: boolean;
}

interface EngagementSectionProps {
  engagement: Engagement;
  actions: Actions;
  index: string;
  onLikeUpdate?: (success: boolean) => void;
  onCommentPress?: () => void;
}

const EngagementSection: React.FC<EngagementSectionProps> = ({
  engagement,
  actions,
  index,
  onLikeUpdate,
  onCommentPress
}) => {
  const fadeAnim = useSharedValue(1);
  // State for controlling comments visibility
  const [showComments, setShowComments] = useState(false);

  const scale = useSharedValue(1);
  const { userdata } = useAppSelector((state) => state.auth);
  const { likePost, isLiking } = usePostInteractions();
  const lastLikeTime = useRef(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLikeAnimation = () => {
    'worklet';
    scale.value = withSpring(1.5, {
      damping: 8,
      stiffness: 120,
      mass: 0.5
    }, () => {
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 100
      });
    });
  };

  const handleLike = async () => {
    if (isLiking) return;

    const now = Date.now();
    if (now - lastLikeTime.current < 300) return; // Reduced debounce for better responsiveness
    lastLikeTime.current = now;

    handleLikeAnimation();
    onLikeUpdate?.(true); // Optimistic update

    try {
      await likePost({
        userId: userdata?._id || "",
        postId: index
      });
    } catch (error) {
      console.error('Like failed:', error);
      onLikeUpdate?.(false); // Revert on failure
    }
  };

  const handleCommentPress = () => {
    console.log("Comment pressed, showing bottom sheet"); // Debug log
    setShowComments(true);
    Keyboard.dismiss();
  };

  const handleCloseComments = () => {
    console.log("Closing comment sheet"); // Debug log
    setShowComments(false);
  };

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mt-2">
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center justify-around gap-x-4">
            <Animated.View style={[animatedStyle, { transform: [{ scale: fadeAnim.value }] }]}>
              <Pressable
                onPress={handleLike}
                disabled={isLiking}
                className={`bg-[#1A1B1E] border ${actions.like ? 'border-[#FF3B30]' : 'border-[#2C2D31]'} py-2.5 px-4 flex-row items-center gap-x-2 rounded-full shadow-sm ${actions.like ? 'bg-[#FF3B3015]' : ''}`}
                style={({ pressed }) => pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }}
              >
                <FavouriteIcon
                  variant={actions.like ? 'solid' : 'stroke'}
                  size={18}
                  color={actions.like ? '#FF3B30' : '#9A9BA0'}
                />
                <Text className={`${actions.like ? 'text-[#FF3B30]' : 'text-[#9A9BA0]'} font-medium text-sm`}>
                  {engagement.likes}
                </Text>
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={handleCommentPress}
              className="bg-[#1A1B1E] border border-[#2C2D31] py-2.5 px-4 flex-row items-center gap-x-2 rounded-full shadow-sm"
              style={({ pressed }) => pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }}
            >
              <Comment02Icon variant="stroke" size={18} color="#9A9BA0" />
              <Text className="text-[#9A9BA0] font-medium text-sm">{engagement.comments}</Text>
            </Pressable>
          </View>

          <Pressable
            className="p-2 rounded-full bg-[#1A1B1E] border border-[#2C2D31]"
            style={({ pressed }) => pressed && { opacity: 0.9 }}
          >
            <EyeIcon variant="stroke" size={18} color="#9A9BA0" />
          </Pressable>
        </View>
      </View>

      {/* CommentsBottomSheet - wrapped in Portal for proper modal rendering */}
      <Portal>
        <CommentsBottomSheet
          isVisible={showComments}
          onClose={handleCloseComments}
          postId={index}
          commentsCount={engagement.comments}
        />
      </Portal>
    </View>
  );
};

export default EngagementSection;
