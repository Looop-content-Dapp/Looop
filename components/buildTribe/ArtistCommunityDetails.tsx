import React, { useRef, useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { Add01Icon, ArrowLeft02Icon } from "@hugeicons/react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PostCard from '../cards/PostCard';
import { Post, useGetCommunityPosts } from "@/hooks/useCreateCommunity";
import CreatePostModal from "../modals/CreatePostModal";

// Types for the Tribe Pass NFT details
interface TribePass {
    collectibleDescription: string;
    collectibleImage: string;
    collectibleName: string;
    collectibleType: 'PNG' | 'JPG' | 'WEBP' | 'GIF';
    communitySymbol: string;
    contractAddress: string;
    transactionHash: string;
  }

  // Main Community interface
  interface Community {
    __v: number;
    _id: string;
    communityName: string;
    coverImage: string;
    createdAt: string;  // ISO date string
    createdBy: string;
    description: string;
    memberCount: number;
    status: 'active' | 'inactive';  // Add other possible status values if they exist
    tribePass: TribePass;
    updatedAt: string;  // ISO date string
  }

interface ArtistCommunityDetailProps {
  community: Community;
}

// Update FeedItem type
type FeedItem = {
  id: string;
  content: string;
  media: Array<{
    type: string;
    url: string;
    mimeType: string;
    size: number;
    _id: string;
  }>;
  user: {
    name: string;
    profileImage: string;
    verified: boolean;
    communityInfo?: {
      name: string;
      description: string;
    };
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  actions?: {
    like: boolean;
  };
  createdAt: string;
};

// Update transform function
const transformToFeedItem = (post: Post): FeedItem => ({
  id: post._id,
  content: post.content,
  media: post.media,
  user: {
    name: post.artistId.name,
    profileImage: post.artistId.profileImage,
    verified: post.artistId.verified,
    // communityInfo: {
    //   name: community.communityName,
    //   description: community.description
    // }
  },
  engagement: {
    likes: post.likeCount,
    comments: post.commentCount,
    shares: post.shareCount
  },
  actions: {
    like: post.likes.length > 0
  },
  createdAt: post.createdAt
});

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const TAB_HEIGHT = 50;

// Remove the duplicate transformToFeedItem function from the component scope
// Keep only the one defined at file scope and update it to include community

const ArtistCommunityDetails = ({ community }: ArtistCommunityDetailProps) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { data: communityData, isLoading } = useGetCommunityPosts(community._id);


  // Interpolate values for animations
  const stickyHeaderOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <View className="min-h-[200px]">
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-4">
                <ActivityIndicator color="#A187B5" />
              </View>
            ) : !communityData?.data.posts || communityData.data.posts.length === 0 ? (
              <View className="flex-1 items-center justify-center py-4">
                <Text className="text-gray-400 text-[16px]">No posts yet</Text>
              </View>
            ) : (
              <View className="gap-y-4">
                {communityData.data.posts.map((post) => (
                  <PostCard
                    key={post._id}
                    item={post}
                  />
                ))}
              </View>
            )}
          </View>
        );
      case 'announcements':
        return (
          <View className="min-h-[200px]">
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-4">
                <ActivityIndicator color="#A187B5" />
              </View>
            ) : !communityData?.data.announcements || communityData.data.announcements.length === 0 ? (
              <View className="flex-1 items-center justify-center py-4">
                <Text className="text-gray-400 text-[16px]">No announcements yet</Text>
              </View>
            ) : (
              <View className="gap-y-4">
                {communityData.data.announcements.map((announcement) => (
                  <PostCard
                    key={announcement._id}
                    item={announcement}
                  />
                ))}
              </View>
            )}
          </View>
        );
      case 'events':
        return (
          <View className="min-h-[200px]">
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-4">
                <ActivityIndicator color="#A187B5" />
              </View>
            ) : !communityData?.data.events || communityData.data.events.length === 0 ? (
              <View className="flex-1 items-center justify-center py-4">
                <Text className="text-gray-400 text-[16px]">No events yet</Text>
              </View>
            ) : (
              <View className="gap-y-4">
                {communityData.data.events.map((event) => (
                  <PostCard
                    key={event._id}
                    item={transformToFeedItem(event)}
                  />
                ))}
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#040405' }}>
        {/* Update Animated Header Background */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_MAX_HEIGHT,
            zIndex: 0,
            opacity: imageOpacity,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
                  outputRange: [0, -HEADER_MIN_HEIGHT],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}
        >
          <ImageBackground
            source={{ uri: community.coverImage }}
            style={{ flex: 1, backgroundColor: '#040405' }}
            resizeMode="cover"
          >
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }} />
          </ImageBackground>
        </Animated.View>

        {/* Sticky Header */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_MIN_HEIGHT,
            backgroundColor: '#040405',
            opacity: stickyHeaderOpacity,
            zIndex: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 40,
          }}
        >
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.3)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ArrowLeft02Icon size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>
            {community.communityName}
          </Text>
        </Animated.View>

        {/* Main Scrollable Content */}
        <Animated.ScrollView
          style={{ flex: 1 }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          bounces={false}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT,
            paddingBottom: 50, // Add padding at the bottom to account for FAB
          }}
        >
          {/* Community Info */}
          <View className="p-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white text-xl font-bold">{community.communityName}</Text>
                <View className="bg-[#12141B] py-1 px-2 rounded mt-2">
                  <Text className="text-white text-xs">{community.memberCount} Members</Text>
                </View>
              </View>
              <TouchableOpacity
                className="border border-[#787A80] py-2.5 px-6 rounded-full"
                onPress={() => setShowCreatePost(true)}
              >
                <Text className="text-white text-sm">Manage</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-white text-sm opacity-80 mt-4" numberOfLines={3}>
              {community.description}
            </Text>
          </View>

          {/* Tab Bar */}
          <View className="h-[50px] bg-[#040405] border-b border-[#333] flex-row">
            {['Posts', 'Announcements', 'Events'].map((tab) => (
              <TouchableOpacity
                key={tab.toLowerCase()}
                onPress={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 items-center justify-center ${
                  activeTab === tab.toLowerCase() ? 'border-b-2 border-[#ff6b00]' : ''
                }`}
              >
                <Text className={`text-[16px] ${
                  activeTab === tab.toLowerCase() ? 'text-white' : 'text-[#666]'
                }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </Animated.ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={() => setShowCreatePost(true)}
          className="absolute bottom-6 right-6 z-30 bg-[#A187B5] w-[72px] h-[72px] rounded-[24px] items-center justify-center shadow-lg"
          style={{
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}
        >
          <Add01Icon size={32} color="#040405" variant="solid" />
        </TouchableOpacity>

        {/* Create Post Modal */}
        <CreatePostModal
          isVisible={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          community={community}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ArtistCommunityDetails;
