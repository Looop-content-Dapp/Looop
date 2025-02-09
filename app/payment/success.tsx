import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppButton } from '@/components/app-components/button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Audit01Icon, HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native'
import LoadingScreen from '../loadingScreen'
import Confetti from '@/assets/svg/Confetti'

const successful = () => {
  const { name, image, id, description } = useLocalSearchParams()
  console.log('name', )
  const router = useRouter()

  return (
    <View className="flex-1 bg-[#040405] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-full relative">
          {/* Main Image Container with Icons */}
          <View className="relative items-center">
            <Image
              source={{ uri: image as string }}
              className="w-[280px] aspect-square rounded-[32px]"
              style={{ resizeMode: "cover" }}
            />
            
            {/* Audio Wave Icon */}
            <View className="absolute -top-4 -left-4">
              <View className="w-14 h-14 bg-[#1ED760] rounded-full items-center justify-center rotate-[-15deg]">
                <Audit01Icon size={28} color="#000000" />
              </View>
            </View>
            
            {/* Confetti */}
            <View className="absolute -top-8 right-0">
               <Confetti  />
            </View>
            
            {/* Group Icon */}
            <View className="absolute -bottom-6 left-4">
              <View className="w-[80px] h-[80px] bg-[#A187B5] rounded-[20px] items-center justify-center rotate-[15deg]">
                 <UserGroupIcon size={40} color='black' variant='solid' />
              </View>
            </View>
            
            {/* Headphones Icon */}
            <View className="absolute -bottom-2 right-4">
              <View className="w-[60px] h-[60px] bg-[#FF8A49] rounded-[18px] items-center justify-center rotate-[10deg]">
                <HeadphonesIcon size={32} color='black' variant='solid' />
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <View className="mt-16 items-center">
            <Text numberOfLines={1} className="text-[32px] font-PlusJakartaSansBold text-white">
              Welcome to {name}
            </Text>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-[#D2D3D5] text-center mt-3 px-6">
              Connect with other fans and join the important discussions and just have fun
            </Text>
          </View>
        </View>

        {/* Start Exploring Button */}
        <View className="w-full mt-12">
          <AppButton.Primary
            color="#FF6D1B"
            text="Start exploring"
            loading={false}
            onPress={() => router.push('/(tabs)')}
          />
        </View>
      </View>
    </View>
  )
}

export default successful