import React from 'react';
import { View, Text, Image } from 'react-native';
import { CheckmarkBadge01Icon, MoreHorizontalIcon } from '@hugeicons/react-native';
import { Skeleton } from 'moti/skeleton';
import { formatTimeAgo } from '../../utils/dateUtils';
import { Post } from '../../utils/types';

interface UserSectionProps {
  item: Post;
  loading: boolean;
}

const UserSection: React.FC<UserSectionProps> = ({ item, loading }) => {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-x-2">
        <Skeleton show={loading} radius="round">
          <Image
            source={{ uri: item?.artistId?.profileImage }}
            className="w-[48px] h-[48px] rounded-full"
          />
        </Skeleton>
        <Skeleton show={loading} height={35} width={180}>
          <View className="px-4 ">
            <View className="flex-row items-center">
              <Text className="text-[16px] text-[#fff] font-PlusJakartaSansBold">
                {item?.artistId?.name}
              </Text>
              {item?.artistId?.verified && (
                <CheckmarkBadge01Icon size={20} variant="solid" color="#2DD881" />
              )}
            </View>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansBold">
              {item?.communityId?.communityName}
            </Text>
          </View>
        </Skeleton>
      </View>
      <Skeleton show={loading} height={30}>
        <View className="flex-row items-center gap-x-2">
          <Text className="text-[#787A80] text-[12px] font-PlusJakartaSansBold">
            {formatTimeAgo(item?.createdAt)}
          </Text>
          <MoreHorizontalIcon size={24} color="#787A80" variant="solid" />
        </View>
      </Skeleton>
    </View>
  );
};

export default UserSection;
