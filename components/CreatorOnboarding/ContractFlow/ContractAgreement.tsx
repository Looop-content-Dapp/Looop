import { View, Text } from 'react-native'
import Markdown from 'react-native-markdown-display';
import React, { useLayoutEffect } from 'react'
import { ArtistContract } from '@/utils/contract';
import { ScrollView } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { AppBackButton } from '@/components/app-components/back-btn';
import { InformationCircleIcon } from '@hugeicons/react-native';

const ContractAgreement = () => {
 const navigation = useNavigation()
    useLayoutEffect(() => {
       navigation.setOptions({
        headerShown: true,
        headerLeft: () => (
          <AppBackButton name="" onBackPress={() => router.back()} />
        ),
       })
    }, [])
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className='mx-[24px]' contentContainerStyle={{
        paddingBlock: 156,
        flexGrow: 1
    }}>
        <View className='gap-y-[16px] mx-auto w-[100%]'>
            <Text className='text-[24px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Looop for Creators Agreement</Text>
            <View className='bg-[#202227] p-[16px] gap-y-[8px] rounded-[28px]'>
                <View className='bg-[#0A0B0F] flex-row items-center gap-x-2 py-[8px] pl-[8px] pr-[16px] w-[148px] rounded-[24px]'>
                    <InformationCircleIcon size={18} color='#A5A6AA' variant='stroke' />
                    <Text className='text-[#A5A6AA] text-[14px] font-PlusJakartaSansBold'>Important note</Text>
                </View>
                <Text className='text-[16px] font-PlusJakartaSansRegular text-[#D2D3D5]'>Before you dive in, we encourage you to read through the entire contract agreement. Remember, you can stay on this screen and continue exploring, even if you leave the app, as long as you haven't signed the contract yet. Your music deserves to be shared, and we’re here to support you every step of the way!
                </Text>
            </View>
        </View>
      <Markdown style={markdownStyles}>{ArtistContract}</Markdown>
    </ScrollView>
  )
}
const markdownStyles = {
  heading3: {
    color: '#A5A6AA',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: "PlusJakartaSansBold",
    marginTop: 64
  },
  paragraph: {
    color: '#F4F4F4',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "PlusJakartaSansRegular"
  },
  bullet_list: {
    marginBottom: 8,
    color: "#fff"
  },
  bullet: {
    color: '#FFFFFF', // White bullets
    fontSize: 30,
  },
  list_item_text: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
  },
};
export default ContractAgreement
