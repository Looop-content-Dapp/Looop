// UserSection.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { CheckmarkBadge01Icon, MoreHorizontalIcon } from '@hugeicons/react-native';
import { Skeleton } from 'moti/skeleton';

interface UserSectionProps {
  user: {
    avatar: any; // Replace with correct type
    name: string;
    username: string;
    verified: boolean;
  };
  loading: boolean;
}

const UserSection: React.FC<UserSectionProps> = ({ user, loading }) => (
  <View className='flex-row items-center justify-between'>
    <View className='flex-row items-center gap-x-4'>
      <Skeleton show={loading} radius="round">
        <Image source={user?.avatar} className='w-[48px] h-[48px] rounded-full' />
      </Skeleton>
      <Skeleton show={loading} height={35} width={180}>
        <View className='px-4'>
          <View className='flex-row items-center'>
            <Text className='text-[16px] text-[#fff] font-PlusJakartaSansBold'>{user?.name}</Text>
            {user?.verified && (
              <CheckmarkBadge01Icon size={20} variant='solid' color='#2DD881' />
            )}
          </View>
          <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansBold'>{user?.username}</Text>
        </View>
      </Skeleton>
    </View>
    <Skeleton show={loading} height={30}>
      <View className='flex-row items-center gap-2'>
        <Text className='text-Grey/06 text-[12px] font-PlusJakartaSansBold'>5hr</Text>
        <MoreHorizontalIcon size={24} color='#787A80' variant='solid' />
      </View>
    </Skeleton>
  </View>
);

export default UserSection;
