import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Share05Icon, ArrowLeft01Icon, ArrowLeft02Icon } from '@hugeicons/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Annnoucement from '../components/community/Annoucement';
import Events from '../components/community/Events';
import Posts from '../components/community/Posts';

const communityDetails = () => {
    const {id, name, description, image}= useLocalSearchParams()
    const [activeTab, setActiveTab] = useState('posts');
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showStickyTabs, setShowStickyTabs] = useState(false); // Track if sticky tabs should be shown

    const renderTabContent = () => {
        switch (activeTab) {
            case 'posts':
                return <Posts />;
            case 'announcements':
                return <Annnoucement />;
            case 'events':
                return <Events />;
            default:
                return null;
        }
    };

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 300],
        outputRange: [300, 60],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [150, 300],
        outputRange: [0, 1], // Header will fade in after 150px scroll
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0], // Image fades as user scrolls
        extrapolate: 'clamp',
    });

    return (
        <View className='flex-1 min-h-screen'>
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
                    zIndex: 10, // To keep it above other content
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}
            >
                <TouchableOpacity onPress={() => router.back()} className='mt-[40px] ml-[30px]'>
                    <ArrowLeft01Icon size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-[18px] font-bold ml-4">{name}</Text>
            </Animated.View>

            {/* Parallax Image Background */}
            <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
                <ImageBackground
                    source={{ uri: image as string }}
                    className='h-full w-full'
                    resizeMode='cover'
                >
                <TouchableOpacity onPress={() => router.back()} className='mt-[40px] ml-[30px]'>
                    <ArrowLeft02Icon size={24} color="#fff" />
                </TouchableOpacity>
                </ImageBackground>
            </Animated.View>

            {/* Sticky Tabs */}
            {showStickyTabs && (
                <View
                    style={{
                        position: 'absolute',
                        top: 80, // Below the header
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        backgroundColor: 'black',
                    }}
                    className='flex-row justify-around border-b-[1px] border-gray-600'
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
                            // Show the sticky tabs if the user scrolls past the original tab bar
                            if (offsetY > 250) {
                                setShowStickyTabs(true);
                            } else {
                                setShowStickyTabs(false);
                            }
                        },
                    }
                )}
                scrollEventThrottle={16}
            >
                <View
                    style={{ width: wp('100%') }}
                    className='gap-y-[16px] px-[24px] pt-[24px] pb-[54px] border-b-[1px] border-Grey/07'
                >
                    <View className='flex-row items-start justify-between'>
                        <View className="gap-y-[24px] items-center">
                            <Text className='text-[24px] font-PlusJakartaSansBold text-[#fff]'>{name}</Text>
                            <View className='bg-[#12141B] py-[8px] px-[12px] items-center justify-center'>
                                <Text className='text-[12px] text-[#fff] font-PlusJakartaSansRegular'>22.7M Members</Text>
                            </View>
                        </View>
                        <View className='flex-row items-center gap-x-[4px]'>
                            {/* <TouchableOpacity className='border-2 border-[#A5A6AA] px-[32px] py-[12px] rounded-[24px]'>
                                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#fff]'>Join Tribe</Text>
                            </TouchableOpacity> */}
                            <TouchableOpacity className='border border-[#A5A6AA] h-[42px] w-[42px] rounded-full items-center justify-center'>
                                <Share05Icon size={24} color='#A5A6AA' variant='stroke' />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text
                        style={{ width: wp('90%') }}
                        numberOfLines={3}
                        className='text-[14px] font-PlusJakartaSansRegular text-[#fff]'
                    >
                       {description}
                    </Text>
                </View>

                {/* Original Tab Navigation */}
                <View className='flex-row justify-around bg-black border-b-[1px] border-gray-600'>
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
        </View>
    );
};

export default communityDetails;
