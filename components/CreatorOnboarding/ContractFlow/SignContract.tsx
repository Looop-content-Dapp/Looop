import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const SignContract = () => {
    const navigation = useNavigation()

    // useLayoutEffect(() => {
    //   navigation.setOptions({
    //     headerShow: true,
    //     headerRight: () => (
    //     <AppBackButton name='' onBackPress={() => router.back()} />
    // )
    //   })
    // }, [navigation])
  return (
    <View className='px-[24px]'>
      <Text className='text-[24px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Sign Agreement</Text>
      <View className='gap-y-[32px] mt-[32px]'>
      <Text className='text-[20px] text-[#A5A6AA] font-PlusJakartaSansBold '>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date upon which this digital contract is duly signed on-chain.</Text>
      </View>

    </View>
  )
}

export default SignContract
