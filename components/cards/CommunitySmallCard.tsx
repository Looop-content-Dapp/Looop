import { CheckmarkBadge01Icon } from '@hugeicons/react-native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ImageBackground, View, Text } from 'react-native';
import { formatNumber } from '../../utils/ArstsisArr';

interface ItemProps {
  name: string;
  owner: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
  properties: {
    creation_date: string;
    edition: {
      total: number;
      current: number;
    };
    royalties: {
      // Add royalty details here
    };
  };
  followers: number;
  following: number;
  external_links: Array<{ name: string; url: string }>;
}

type Props ={
    item: ItemProps
}

const CommunitySmallCard = ({ item }: Props) => {

  return (
    <ImageBackground
    source={{uri: item?.image }} className='w-[180px] h-[180px] overflow-hidden rounded-[24px] '>
     <BlurView
     intensity={60}
     style={{ height: "40%", position: "absolute", bottom: 0, width: "100%", paddingLeft: 12, paddingRight: 14, paddingBottom: 20,paddingTop: 10}}
     >
      <View className='flex-row items-center'>
        <Text className='text-[14px] text-[#fff] font-PlusJakartaSansBold text-ellipsis'>{item?.name}</Text>
        <CheckmarkBadge01Icon size={16} color='#fff' variant='solid' />
      </View>
      <Text className='text-Grey/04 text-[12px] font-PlusJakartaSansMedium'>{formatNumber(item?.followers)} Subscribers</Text>
     </BlurView>
    </ImageBackground>
  );
};

export default CommunitySmallCard;
