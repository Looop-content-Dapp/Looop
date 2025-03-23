import { View, Text, FlatList, ScrollView } from 'react-native'
import React from 'react'
import CommunitySmallCard from './cards/CommunitySmallCard'
import { artistsArr } from '../utils/ArstsisArr'

const ArtistYouFollow = () => {
  return (
    <View className='gap-y-[16px] pt-[32px] h-[284px]'>
      <Text className='text-[20px] text-[#fff] font-PlusJakartaSansMedium'>Artist You Follow</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{
        gap: 16
      }}>
        {artistsArr.map((item, index) => (
            <CommunitySmallCard key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  )
}

export default ArtistYouFollow
