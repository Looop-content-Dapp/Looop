import { View, Text, ImageBackground, TouchableOpacity, Animated, ScrollView } from "react-native";
import { ArrowLeft02Icon, PencilEdit02Icon, Add01Icon } from "@hugeicons/react-native";
import React, { useRef, useState } from 'react';
import CreatePostModal from "../modals/CreatePostModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

interface Community {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  __v: number;
}

interface ArtistCommunityDetailProps {
  community: Community;
}

const ArtistCommunityDetails = ({ community }: ArtistCommunityDetailProps) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Interpolate values for animations
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [260, 60],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return <View className="h-[1000px]"><Text className="text-white">Posts Content</Text></View>;
      case 'announcements':
        return <View className="h-[1000px]"><Text className="text-white">Announcements Content</Text></View>;
      case 'events':
        return <View className="h-[1000px]"><Text className="text-white">Events Content</Text></View>;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 min-h-screen">
      {/* Animated header with back button */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: 'black',
          opacity: headerOpacity,
          zIndex: 10,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity>
          <ArrowLeft02Icon size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-bold ml-4">{community?.name}</Text>
      </Animated.View>

      {/* Parallax Image Background */}
      <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/564x/64/19/30/641930ec1d900889da248ebe6ad7144d.jpg"
          }}
          style={{
            height: hp("27.9%"),
            width: wp("100%")
          }}
        >
          <View className="mt-[40px] px-[24px]">
            <TouchableOpacity>
              <ArrowLeft02Icon size={32} color="#fff" />
            </TouchableOpacity>

            <View className="items-end justify-end mt-[30%]">
              <TouchableOpacity className="border border-[#D2D3D5] py-[16px] px-[12px] rounded-[24px]">
                <Text className="text-[14px] font-PlusJakartaSansMedium text-[#D2D3D5]">Change Cover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      {/* Sticky Tabs */}
      {showStickyTabs && (
        <View
          style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            zIndex: 20,
            backgroundColor: 'black',
          }}
          className="flex-row justify-around border-b-[1px] border-gray-600"
        >
          <TouchableOpacity
            onPress={() => setActiveTab('posts')}
            className={`py-[16px] ${activeTab === 'posts' ? 'border-b-2 border-Orange/08' : ''}`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === 'posts' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('announcements')}
            className={`py-[16px] ${activeTab === 'announcements' ? 'border-b-2 border-Orange/08' : ''}`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === 'announcements' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Announcements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('events')}
            className={`py-[16px] ${activeTab === 'events' ? 'border-b-2 border-Orange/08' : ''}`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === 'events' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Events
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              if (offsetY > 200) {
                setShowStickyTabs(true);
              } else {
                setShowStickyTabs(false);
              }
            },
          }
        )}
        scrollEventThrottle={16}
      >
        <View className="px-[24px] mt-[24px] gap-y-[12px]">
          <View className="flex-row items-center justify-between">
            <Text className="text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]">{community?.name}</Text>
            <TouchableOpacity className="border border-[#787A80] py-[12px] px-[16px] gap-x-[8px] rounded-[24px] flex-row items-center">
              <PencilEdit02Icon size={16} color="#787A80" />
              <Text className="text-[14px] font-PlusJakartaSansMedium text-[#D2D3D5]">Edit</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-[14px] font-PlusJakartaSansRegular text-[#D2D3D5]">{community.description}</Text>
        </View>

        {/* Original Tab Navigation */}
        <View className="flex-row justify-around bg-black border-b-[1px] border-gray-600 mt-4">
          <TouchableOpacity
            onPress={() => setActiveTab('posts')}
            className={`py-[16px] ${activeTab === 'posts' ? 'border-b-2 border-Orange/08' : ''}`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === 'posts' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('announcements')}
            className={`py-[16px] ${activeTab === 'announcements' ? 'border-b-2 border-Orange/08' : ''}`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === 'announcements' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Announcements
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('events')}
            className={`py-[16px] ${activeTab === 'events' ? 'border-b-2 border-Orange/08' : ''}`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === 'events' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Events
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="px-4 py-2">{renderTabContent()}</View>
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
       onPress={() => setShowCreatePost(true)}
        className="absolute bottom-[85px] right-6 z-30 bg-[#A187B5] w-[72px] h-[72px] rounded-[24px] items-center justify-center shadow-lg"
        style={{
          elevation: 5, // for Android shadow
          shadowColor: '#000', // for iOS shadow
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <Add01Icon size={32} color="#040405" variant="solid" />
      </TouchableOpacity>
      <CreatePostModal
        isVisible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        community={community}
      />
    </View>
  );
};

export default ArtistCommunityDetails;
