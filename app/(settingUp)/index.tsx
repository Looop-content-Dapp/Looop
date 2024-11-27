import { View, Text, Image, Pressable, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowRight02Icon, HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native'
import { router } from 'expo-router'

const WelcomeToLooop = () => {
  return (
    <SafeAreaView style={{flex: 1, paddingHorizontal: 24}}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{ width: "100%", height: 282.633, borderRadius: 24, overflow: 'hidden' }} className='items-center mt-[65px]'>
      <Image
      source={require("../../assets/images/Looopbadge.png")}
       style={{ width: '100%', height: '100%' }}
     />
   </View>

        <View className='items-center gap-y-[12px] mt-[56px] tems-stretch'>
          <Text className='text-[20px] text-Grey/06 text-center font-PlusJakartaSansBold'>
            Welcome to Looop
          </Text>
          <Text className='text-[24px] text-center text-[#f4f4f4] leading-[30px] '>
            This is where the cool kids hang out. Ready to start exploring? What do you want to do first?
          </Text>
        </View>

        <View className='gap-y-[12px] mt-[50px]'>
          <Pressable
         onPress={() => router.push("/(settingUp)/musicSetup")}
           className='py-[15px] px-[16px] flex-row items-center gap-x-[16px] bg-[#0A0B0F] justify-between w-full'>
            <HeadphonesIcon size={24} color='#FF6D1B' variant='solid' />
            <View className='flex-1'>
              <Text className='text-Grey/06 font-PlusJakartaSansBold text-[14px]'>
                Listen to music
              </Text>
              <Text className='text-[16px] font-PlusJakartaSansRegular text-[#f4f4f4]'>
                Start exploring new sounds right away
              </Text>
            </View>
            <ArrowRight02Icon size={24} color='#787A80' variant='solid' />
          </Pressable>

          <Pressable  onPress={() => router.push("/(settingUp)/communityOnboarding")} className='py-[15px] px-[16px] flex-row items-center gap-x-[16px] bg-[#0A0B0F] justify-between w-full'>
            <UserGroupIcon size={24} color='#FF6D1B' variant='stroke' />
            <View className='flex-1'>
              <Text className='text-Grey/06 font-PlusJakartaSansBold text-[14px]'>
                Explore Tribes
              </Text>
              <Text className='text-[16px] font-PlusJakartaSansRegular text-[#f4f4f4]'>
                Exciting ways to connect with new talents and your favorite artists
              </Text>
            </View>
            <ArrowRight02Icon size={24} color='#787A80' variant='solid' />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WelcomeToLooop
