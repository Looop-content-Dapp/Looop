import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ImageBackground, View, Text, Pressable } from 'react-native';
import { formatNumber } from '../../utils/ArstsisArr';
import { router } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';

interface ItemProps {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
  members?: any[];
  tribePass?: {
    collectibleImage: string;
    contractAddress: string;
  };
}

type Props = {
  item: ItemProps;
}

const CommunitySmallCard = ({ item }: Props) => {
    const { userdata } = useAppSelector((state) => state.auth);

  const handleRoute = () => {
    if(!userdata?._id) return console.log("pls login first")

        const isMember = Array.isArray(item.members) && item.members.length > 0
            ? item.members.some(member => member.userId._id === userdata?._id)
            : false;

    if (!isMember) {
      router.push({
        pathname: "/payment",
        params: {
          name: item.name,
          image: item.tribePass?.collectibleImage,
          communityId: item.id,
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
          id: item.id,
          name: item.name,
          image: item.image,
          description: item.description,
          noOfMembers: item.memberCount,
        }
      });
    }
  };

  return (
    <Pressable onPress={handleRoute}>
      <ImageBackground
        source={{ uri: item?.image }}
        className='w-[180px] h-[180px] overflow-hidden rounded-[24px] '
      >
        <BlurView
          intensity={60}
          style={{ height: "40%", position: "absolute", bottom: 0, width: "100%", paddingLeft: 12, paddingRight: 14, paddingBottom: 20, paddingTop: 10}}
        >
          <View className='flex-row items-center'>
            <Text className='text-[14px] text-[#fff] font-PlusJakartaSansBold text-ellipsis'>{item?.name}</Text>
            <CheckmarkBadge01Icon size={16} color='#fff' variant='solid' />
          </View>
          <Text className='text-Grey/04 text-[12px] font-PlusJakartaSansMedium'>{formatNumber(item?.memberCount)} Members</Text>
        </BlurView>
      </ImageBackground>
    </Pressable>
  );
};

export default CommunitySmallCard;
