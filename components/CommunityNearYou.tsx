import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { communities } from '../utils/ArstsisArr'
import CommunityBigCard from './cards/CommunityBigCard'

const CommunityNearYou = () => {
  return (
    <View className='gap-y-[16px]'>
      <Text className='text-[20px] text-[#fff] font-PlusJakartaSansMedium'>Based on music you listen to</Text>
      <FlatList
      showsHorizontalScrollIndicator={false} data={communities}
      renderItem={({item}) => <CommunityBigCard
      item={item} />}
      horizontal
      contentContainerStyle={{
        gap: 16,
      }} />
    </View>
  )
}

export default CommunityNearYou
