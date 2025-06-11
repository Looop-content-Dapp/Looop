import { View, Text } from 'react-native'
import { ArrowRight01Icon, SmartPhone02Icon, Message02Icon } from '@hugeicons/react-native'
import React, { useLayoutEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const personalInfo = () => {
    const navigation = useNavigation()


    useLayoutEffect(() => {
      navigation.setOptions((
        {
          headerLeft: () =><AppBackButton name='Personal Details' onBackPress={() => router.back()} />,
          headerRight: () => null
        }
      ))
    })

    const settingsMenuItems = [
        {
            title: "Phone Number",
            description: "Update and manage the phone number linked to your account.",
            icon: <SmartPhone02Icon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(account-info)/phone-number"
        },
        {
            title: "Email Address",
            description: "Update your email address and manage email preferences.",
            icon: <Message02Icon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(account-info)/email"
        },
    ]

    return (
        <View className='px-[24px] gap-y-[36px] pt-[20px]'>
            <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>
                Update your account details to keep your information current.
            </Text>
            <View className='gap-y-[12px]'>
                {
                    settingsMenuItems.map((menu, key) => (
                        <TouchableOpacity
                            key={key}
                            onPress={() => router.push(menu.route)}
                            className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px] gap-x-[16px]'
                        >
                            <View className='w-[24px]'>
                                {menu.icon}
                            </View>
                            <View className='flex-1'>
                                <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>{menu.title}</Text>
                                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>{menu.description}</Text>
                            </View>
                            <View className='w-[24px]'>
                                <ArrowRight01Icon size={24} color='#787A80' variant='stroke' />
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </View>
    )
}

export default personalInfo
