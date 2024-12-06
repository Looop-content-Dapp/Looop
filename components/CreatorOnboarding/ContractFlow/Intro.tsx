import { View, Text } from 'react-native'
import React from 'react'
import Celebration from '@/assets/svg/Celebration'

const Intro = () => {
  return (
    <View className='items-center justify-center'>
     <View className='mt-[30%]'>
     <Celebration />
     </View>
      <View className='gap-y-[12px]'>
        <Text className='text-[28px] text-[#FFFFFF] font-PlusJakartaSansBold text-center'>You got in!</Text>
        <Text className='text-[16px] font-PlusJakartaSansRegular text-[#D2D3D5] text-center'>Congratulations! We’ve reviewed your social profiles and we’re welcoming you to Looop for Creators. There’s just one last step before you can start creating for your fans and building your community. </Text>
      </View>
    </View>
  )
}

export default Intro
