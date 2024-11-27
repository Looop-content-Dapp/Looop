import { View, Text, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { CheckmarkBadge01Icon, UserGroupIcon, UserSharingIcon } from '@hugeicons/react-native';
import { BlurView } from 'expo-blur';
import { Skeleton } from 'moti/skeleton';

type CommunityInterface = {
    id: number;
    title: string;
    subtitle: string;
    members: string;
    moderators: number;
    backgroundColor: string;
    artist: string;
    image: string;
};

type Props = {
    item: CommunityInterface;
};

const CommunityBigCard = ({ item }: Props) => {
    return (
        <Skeleton
        colorMode='dark'
        transition={{
            type: "timing",
            duration: 2000
        }}
        >
        <ImageBackground
            source={{
                uri: item?.image,
            }}
            className="h-[389px] w-[283px] rounded-[34px] overflow-hidden"
        >
            <View className='bg-Grey/08 rounded-[24px] flex-row items-center gap-x-[6px]' style={{position: "absolute", top: 0, margin: 16, paddingHorizontal: 12, paddingVertical: 8}}>
                <Text className='text-[12px] font-PlusJakartaSansBold text-[#fff]'>{item?.artist}</Text>
                <CheckmarkBadge01Icon size={14} color='#ffff' variant='solid' />
            </View>
            <BlurView
            intensity={60}
                style={{borderRadius: 50, height: "40%", position: "absolute", bottom: 0, width: "100%" }}
            >
                <View className="flex-1 justify-center p-6">
                    <Text className="text-white font-PlusJakartaSansBold text-[20px] font-bold mb-2">{item?.title}</Text>
                    <Text className="text-white text-[14px] font-PlusJakartaSansRegular mb-4">{item?.subtitle}</Text>
                    <View className="flex-row w-full">
                        <View className='flex-row bg-[#ffffff33] p-[10px] items-center gap-x-2 rounded-[10px]'>
                        <Text className="text-white text-[12px] font-PlusJakartaSansBold">{item?.members} Members</Text>
                     </View>
                    </View>
                </View>
            </BlurView>
        </ImageBackground>
     </Skeleton>
    );
};

export default CommunityBigCard;
