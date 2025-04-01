import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Animated,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Posts from '../components/community/Posts';
import Annoucement from '../components/community/Annoucement';
import Events from '../components/community/Events';
import { ArrowLeft01Icon } from '@hugeicons/react-native';
import { formatNumber } from '@/utils/ArstsisArr';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const TAB_HEIGHT = 50;

const CommunityDetails = () => {
    const { id, name, description, image, noOfMembers } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('posts');
    const scrollY = useRef(new Animated.Value(0)).current;
    const { height: SCREEN_HEIGHT } = useWindowDimensions();

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: 'clamp',
    });

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
                return <Posts communityId={id as string} />;
            case 'announcements':
                return <Annoucement communityId={id as string} />;
            case 'events':
                return <Events />;
            default:
                return null;
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#040405' }}>

            <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: headerHeight,
                        zIndex: 0,
                        opacity: imageOpacity,
                    }}
                >
                    <ImageBackground
                        source={{ uri: image as string }}
                        style={{
                            flex: 1,
                            backgroundColor: '#040405',
                        }}
                        resizeMode="cover"
                    >
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                            }}
                        />
                    </ImageBackground>
                </Animated.View>

                {/* Sticky Header and Parallax Header remain unchanged */}
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
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                       <ArrowLeft01Icon size={24} color='#f4f4f4' variant='stroke' />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>
                        {name}
                    </Text>
                </Animated.View>

                <View
                    style={{
                        position: 'absolute',
                        top: 40,
                        left: 16,
                        zIndex: 15,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ArrowLeft01Icon size={24} color='#f4f4f4' variant='stroke' />
                    </TouchableOpacity>
                </View>

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
                    }}
                >
                    {/* Profile Info */}
                    <View className="p-4">
                        <View className="flex-row justify-between">
                            <View>
                                <Text numberOfLines={1} ellipsizeMode='clip' className="text-white text-xl font-bold">
                                    {name}
                                </Text>
                                <View className="bg-[#12141B] py-1 px-2 rounded mt-2">
                                    <Text className="text-white text-xs">{formatNumber(noOfMembers as string)} Members</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="bg-[#202227] py-2.5 px-6 items-center justify-center rounded-full"
                            >
                                <Text className="text-white text-sm">Member</Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            className="text-white text-sm opacity-80 mt-4 font-PlusJakartaSansRegular"
                            numberOfLines={3}
                        >
                            {description}
                        </Text>
                    </View>

                    {/* Tab Bar */}
                    <View
                        style={{
                            height: TAB_HEIGHT,
                            backgroundColor: '#040405',
                            borderBottomWidth: 1,
                            borderBottomColor: '#333',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        {['Posts', 'Announcements', 'Events'].map((tab) => (
                            <TouchableOpacity
                                key={tab.toLowerCase()}
                                onPress={() => setActiveTab(tab.toLowerCase())}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    paddingVertical: 16,
                                    borderBottomWidth: activeTab === tab.toLowerCase() ? 2 : 0,
                                    borderBottomColor: '#ff6b00',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: activeTab === tab.toLowerCase() ? '#fff' : '#666',
                                    }}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Tab Content */}
                    <View style={{ flex: 1, marginTop: 16 }}>{renderTabContent()}</View>
                </Animated.ScrollView>

                {/* Sticky Tab Bar - appears when scrolled */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: HEADER_MIN_HEIGHT,
                        left: 0,
                        right: 0,
                        height: TAB_HEIGHT,
                        backgroundColor: '#040405',
                        borderBottomWidth: 1,
                        borderBottomColor: '#333',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        zIndex: 5,
                        opacity: scrollY.interpolate({
                            inputRange: [
                                HEADER_MAX_HEIGHT + 150,
                                HEADER_MAX_HEIGHT + 200
                            ],
                            outputRange: [0, 1],
                            extrapolate: 'clamp',
                        }),
                    }}
                >
                    {['Posts', 'Announcements', 'Events'].map((tab) => (
                        <TouchableOpacity
                            key={tab.toLowerCase()}
                            onPress={() => setActiveTab(tab.toLowerCase())}
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                paddingVertical: 16,
                                borderBottomWidth: activeTab === tab.toLowerCase() ? 2 : 0,
                                borderBottomColor: '#ff6b00',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: activeTab === tab.toLowerCase() ? '#fff' : '#666',
                                }}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </View>
        </GestureHandlerRootView>
    );
};

export default CommunityDetails;
