import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import CommunitySmallCard from './cards/CommunitySmallCard'
import { useFollowedCommunities } from '../hooks/useFollowedCommunities'
import { useAppSelector } from '@/redux/hooks'

const ArtistYouFollow = () => {
    const { userdata } = useAppSelector((state) => state.auth)
    const { data: communities, isLoading } = useFollowedCommunities(userdata?._id || '');

  if (isLoading || !communities?.length) {
    return null;
  }

  return (
    <View className='gap-y-[16px] pt-[32px] h-[284px]'>
      <Text className='text-[20px] text-[#fff] font-PlusJakartaSansMedium'>Artist You Follow</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
        gap: 16
      }}>
        {communities.map((community) => (
          <CommunitySmallCard
            key={community._id}
            item={{
              id: community._id,
              name: community.communityName,
              image: community.coverImage,
              description: community.description,
              memberCount: community.memberCount,
              members: community.members,
              tribePass: community.tribePass
            }}
          />
        ))}
      </ScrollView>
    </View>
  )
}

export default ArtistYouFollow
