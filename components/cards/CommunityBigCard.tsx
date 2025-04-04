import { View, Text, ImageBackground, Pressable, Alert } from 'react-native';
import React from 'react';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { BlurView } from 'expo-blur';
import { Skeleton } from 'moti/skeleton';
import { Community } from '@/hooks/useGetCommunities';
import { router } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';

type Props = {
    item: Community;
};

const CommunityBigCard = ({ item}: Props) => {
    const { userdata } = useAppSelector((state) => state.auth);

    const handleRoute = () => {
        if (!item) {
            Alert.alert("Error", "Community information not available");
            return;
        }

        if(!userdata?._id) {
            Alert.alert(
                "Login Required",
                "Please login to access this community",
                [
                    { text: "OK", onPress: () => router.push("/auth") }
                ]
            );
            return;
        }

        // Fixed member check logic with null check for userId
        const isMember = Array.isArray(item.members) && item.members.length > 0
            ? item.members.some(member => member.userId && member.userId._id === userdata._id)
            : false;

        if (!isMember) {
            router.push({
                pathname: "/payment",
                params: {
                    name: item.communityName,
                    image: item.tribePass?.collectibleImage,
                    communityId: item._id,
                    collectionAddress: item.tribePass?.contractAddress,
                    type: "xion",
                    userAddress: userdata?.wallets?.xion?.address,
                    currentRoute: "/(communityTabs)/(explore)/search",
                },
            });
        } else {
            router.navigate({
                pathname: '/communityDetails',
                params: {
                    id: item._id,
                    name: item.communityName,
                    image: item.coverImage,
                    description: item.description,
                    noOfMembers: item.memberCount,
                }
            });
        }
    };

    return (
        <Pressable onPress={handleRoute}>
            <Skeleton
                colorMode='dark'
                transition={{
                    type: "timing",
                    duration: 2000
                }}
            >
                <ImageBackground
                    source={{
                        uri: item?.coverImage,
                    }}
                    className="h-[389px] w-[283px] bg-Grey/06 rounded-[34px] overflow-hidden"
                    resizeMode="cover"
                >
                    <View
                        className='bg-[#ffffff14] backdrop-blur-md rounded-[24px] flex-row items-center gap-x-[6px]'
                        style={{
                            position: "absolute",
                            top: 0,
                            margin: 16,
                            paddingHorizontal: 12,
                            paddingVertical: 8
                        }}
                    >
                        <Text
                            className='text-[12px] font-PlusJakartaSansBold text-[#fff]'
                            numberOfLines={1}
                        >
                            {item?.tribePass.collectibleName}
                        </Text>
                        <CheckmarkBadge01Icon size={14} color='#ffff' variant='solid' />
                    </View>
                    <BlurView
                        intensity={60}
                        tint="dark"
                        style={{
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            height: "45%",
                            position: "absolute",
                            bottom: 0,
                            width: "100%"
                        }}
                    >
                        <View className="flex-1 justify-end p-6 gap-y-2">
                            <Text
                                className="text-white font-PlusJakartaSansBold text-[20px] font-bold"
                                numberOfLines={1}
                            >
                                {item?.communityName}
                            </Text>
                            <Text
                                className="text-[#ffffff] text-[14px] font-PlusJakartaSansRegular"
                                numberOfLines={2}
                            >
                                {item?.description}
                            </Text>
                            <View className="flex-row w-full mt-2">
                                <View className='flex-row bg-[#ffffff1a] p-[10px] items-center gap-x-2 rounded-[10px]'>
                                    <Text className="text-white text-[12px] font-PlusJakartaSansBold">
                                        {item?.memberCount.toLocaleString()} Members
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </ImageBackground>
             </Skeleton>
        </Pressable>
    );
};

export default CommunityBigCard;
