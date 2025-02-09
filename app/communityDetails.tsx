import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Share05Icon, ArrowLeft01Icon, ArrowLeft02Icon } from '@hugeicons/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Annnoucement from '../components/community/Annoucement';
import Events from '../components/community/Events';
import Posts from '../components/community/Posts';
import { Skeleton } from "moti/skeleton";
import { prefetchCommunityData } from '@/utils/prefetch';
import { formatNumber } from '@/utils/ArstsisArr';

const communityDetails = () => {
    const { id } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('posts');
    const scrollY = useRef(new Animated.Value(0)).current;
    const [showStickyTabs, setShowStickyTabs] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [communityData, setCommunityData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunityData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                if (!id) {
                    throw new Error('Community ID is missing');
                }

                const data = await prefetchCommunityData(id as string);
                setCommunityData(data);
                console.log("communityData: ", data);

            } catch (error: any) {
                console.error('Error fetching community data:', error);
                setError(error.message || 'Failed to load community details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommunityData();
    }, [id]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-black">
                <Skeleton
                    show={true}
                    width="100%"
                    height={300}
                    colorMode="dark"
                />
                <View className="p-6">
                    <Skeleton
                        show={true}
                        width={200}
                        height={24}
                        radius={4}
                        colorMode="dark"
                    />
                    <View className="h-4" />
                    <Skeleton
                        show={true}
                        width="100%"
                        height={60}
                        radius={4}
                        colorMode="dark"
                    />
                </View>
            </View>
        );
    }

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
                    top: 35,
                    left: 0,
                    right: 0,
                    height: 60,
                    backgroundColor: '#040405',
                    opacity: headerOpacity,
                    zIndex: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft01Icon size={24} color="#fff" variant='stroke' />
                </TouchableOpacity>
                <Text className="text-white text-[18px] font-bold ml-4">
                    {communityData?.communityName}
                </Text>
            </Animated.View>

            {/* Parallax Image Background */}
            <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
                <ImageBackground
                    source={{ uri: communityData?.coverImage as string }}
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
                        backgroundColor: '#040405',
                    }}
                    className='flex-row justify-around border-b-[1px] border-gray-600'
                >
                    <TouchableOpacity
                        onPress={() => setActiveTab('posts')}
                        className={`py-[10px] px-[24px] ${activeTab === 'posts' ? 'border-b-2 border-Orange/08 w-fit' : ''}`}
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansMedium text-white`}
                        >
                            Posts
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('announcements')}
                        className={`py-[10px] px-[24px] ${activeTab === 'announcements' ? 'border-b-2 border-Orange/08 w-fit' : ''}`}
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansMedium text-white`}
                        >
                            Announcements
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('events')}
                        className={`py-[10px] px-[24px] ${activeTab === 'events' ? 'border-b-2 border-Orange/08 w-fit' : ''}`}
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansMedium text-white`}
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
    className='px-6 pt-6 pb-14 gap-y-[16px] bg-[#040405] border-b border-Grey/07 space-y-4'
>
    <View className='flex-row justify-between items-start'>
        <View className='space-y-6 items-start'>
            <Text className='text-2xl font-PlusJakartaSansBold text-white'>
                {communityData?.communityName}
            </Text>
            <View className='bg-[#12141B] p-[8px] rounded-md'>
                <Text className='text-[12px] font-PlusJakartaSansRegular text-white'>
                    {formatNumber(communityData?.memberCount)} Members
                </Text>
            </View>
        </View>
        
        <TouchableOpacity 
            className='border border-[#A5A6AA] h-[42px] w-[42px] rounded-full items-center justify-center'
            activeOpacity={0.7}
        >
            <Share05Icon 
                size={24} 
                color='#A5A6AA' 
                variant='stroke' 
            />
        </TouchableOpacity>
    </View>

    <Text
        style={{ width: wp('90%') }}
        numberOfLines={3}
        className='text-[14px] font-PlusJakartaSansRegular text-white'
    >
        {communityData?.description}
    </Text>
</View>

                {/* Original Tab Navigation */}
                <View className='flex-row justify-between bg-[#040405] border-b-[1px] border-gray-600'>
                    <TouchableOpacity
                        onPress={() => setActiveTab('posts')}
                        className={`py-[10px] px-[24px] ${activeTab === 'posts' ? 'border-b-2 border-Orange/08 w-fit' : ''}`}
                    >
                        <Text
                             className={`text-[16px] font-PlusJakartaSansMedium text-white`}
                        >
                            Posts
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('announcements')}
                        className={`py-[10px] px-[24px] ${activeTab === 'announcements' ? 'border-b-2 border-Orange/08 w-fit' : ''}`}
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansMedium text-white`}
                        >
                            Announcements
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('events')}
                        className={`py-[10px] px-[24px] ${activeTab === 'events' ? 'border-b-2 border-Orange/08 w-fit' : ''}`}
                    >
                        <Text
                            className={`text-[16px] font-PlusJakartaSansMedium text-white`}
                        >
                            Events
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View className="px-4 mt-[14px]">{renderTabContent()}</View>
            </Animated.ScrollView>
        </View>
    );
};

export default communityDetails;
