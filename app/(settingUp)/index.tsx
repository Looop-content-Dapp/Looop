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
 <View style={{ flexGrow: 1}}>
          <View style={{ width: "100%", height:
          hp("50%"), overflow: 'hidden' }} className='items-center '>

            <ImageBackground
              source={welcomeBg as ImageSourcePropType}
              resizeMode='contain'
              style={{ width: wp("100%"), height: '100%', backgroundColor: "#8D4FB4" }}
            >
              <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 55 }}>
                <Image
                  source={welcome as ImageSourcePropType}
                  resizeMode='contain'
                  style={{ width: wp("100%"), height: '100%' }}
                />
              </View>
            </ImageBackground>
          </View>

          <View className='items-center gap-y-[12px] mt-[56px] tems-stretch'>
            <Text className='text-[16px] text-Grey/06 text-center font-PlusJakartaSansBold'>
              Welcome to Looop
            </Text>
            <Text className='text-[24px] text-center text-[#f4f4f4] leading-[30px] font-PlusJakartaSansBold'>
              The music is now closer than ever!  What do you want to do?
            </Text>
          </View>

          <View style={{ width: wp("95%")}} className='gap-y-[12px] mt-[30%] items-center justify-center mx-auto'>
            <Pressable
              onPress={() => router.push("/(settingUp)/musicSetup")}
              className='py-[15px] px-[16px] flex-row items-center gap-x-[24px] bg-[#202227] justify-between w-full rounded-[10px]'>
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
          </View>
        </View>
  )
}

export default WelcomeToLooop
