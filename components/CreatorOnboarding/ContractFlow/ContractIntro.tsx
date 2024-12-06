import { View, Text } from 'react-native'
import React from 'react'
import Agreement from '@/assets/svg/Agreement'

const ContractIntro = () => {
  return (
    <View className='items-center justify-center'>
        <View className='mt-[10%]'>
            <Agreement />
        </View>
        <View className='gap-y-[12px] mt-[10%]'>
        <Text className='text-[24px] text-[#FFFFFF] font-PlusJakartaSansBold text-start'>Looop for Creators Agreement</Text>
        <Text className='text-[16px] font-PlusJakartaSansRegular text-[#D2D3D5] text-start'>Hey there! Welcome to Looop for Creators! This agreement is all about how you, as an artist, can share your music with the world on our platform. When you upload your tracks, you keep full ownership of your awesome work, and you’re giving Looop the go-ahead to help distribute and promote your music to more fans. We really appreciate your creativity and want to make sure your rights are safe throughout this journey. Let’s create some amazing music together! Check out the contract on the next page!</Text>
      </View>
    </View>
  )
}

export default ContractIntro
