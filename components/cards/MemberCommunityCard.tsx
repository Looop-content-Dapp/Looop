import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { ArrowRight01Icon } from '@hugeicons/react-native';

interface MemberCommunityCardProps {
  communityName: string;
  description: string;
  coverImage?: string;
  onPress: () => void;
}

const MemberCommunityCard = ({ communityName, description, coverImage, onPress }: MemberCommunityCardProps) => {
  return (
    <TouchableOpacity
      className="h-[100px] bg-[#202227] rounded-[24px] my-[24px] overflow-hidden flex-row items-center"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="w-[80px] h-[80px] rounded-[16px] overflow-hidden ml-4">
        <Image
          source={{
            uri: coverImage || "https://i.pinimg.com/736x/08/36/11/083611341ce01bf33a233cfa6d04331c.jpg"
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 mr-4">
          <Text className="text-[12px] font-PlusJakartaSansBold text-[#9A9B9F] leading-[16px] -tracking-[0.25px]">
            You can check out
          </Text>
          <Text className="text-[16px] font-PlusJakartaSansBold text-white mb-1" numberOfLines={1}>
            {communityName}
          </Text>
          <Text className="text-[14px] font-PlusJakartaSansRegular text-[#8E8E93]" numberOfLines={1}>
            {description}
          </Text>
        </View>
        <ArrowRight01Icon
          size={24}
          color="#FFFFFF"
          variant="stroke"
          className="ml-auto"
        />
      </View>
    </TouchableOpacity>
  );
};

export default MemberCommunityCard;
