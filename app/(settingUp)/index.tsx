import { View, Text, Image, Pressable, ScrollView,
  ImageSourcePropType,
  ImageBackground,
  StatusBar
 } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowRight02Icon, HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native'
import { router } from 'expo-router'
import { welcome, welcomeBg } from '@/assets/images/images'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const WelcomeToLooop = () => {
  return (
    <>
      <StatusBar
        backgroundColor="#8D4FB4"
        translucent={true}
        barStyle="light-content"
      />

      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 365,
        backgroundColor: "#8D4FB4",
        zIndex: -1
      }} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, }}>
          <View style={{ width: "100%", height:
          hp("40%"), overflow: 'hidden' }} className='items-center '>

            <ImageBackground
              source={welcomeBg as ImageSourcePropType}
              resizeMode='cover'
              style={{ width: '100%', height: '100%', backgroundColor: "#8D4FB4" }}
            >
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={welcome as ImageSourcePropType}
                  resizeMode='cover'
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            </ImageBackground>
          </View>

          <View className='items-center gap-y-[12px] mt-[56px] tems-stretch'>
            <Text className='text-sm text-Grey/06 text-center font-PlusJakartaSansBold'>
              Welcome to Looop
            </Text>
            <Text className='text-[24px] text-center text-[#f4f4f4] leading-[30px] font-PlusJakartaSansBold'>
              The music is now closer than ever!  What do you want to do first?
            </Text>
          </View>

          <View className='gap-y-[12px] mt-[30%] items-center justify-center mx-auto w-[90%]'>
            <Pressable
              onPress={() => router.push("/(settingUp)/musicSetup")}
              className='py-[15px] px-[16px] flex-row items-center gap-x-[24px] bg-[#202227] justify-between w-full'>
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

            {/* <Pressable
              onPress={() => router.push("/(settingUp)/communityOnboarding")}
              className='py-[15px] px-[16px] flex-row items-center gap-x-[16px] bg-[#202227] justify-between w-full'>
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
            </Pressable> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  )
}

export default WelcomeToLooop
