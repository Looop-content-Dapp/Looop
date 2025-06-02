import { View, Text } from 'react-native'
import { ArrowRight01Icon, Shield02Icon, LockKeyIcon, FaceIdIcon } from '@hugeicons/react-native'
import React, { useLayoutEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const AccountSecurity = () => {
    const navigation = useNavigation()

    useLayoutEffect(() => {
      navigation.setOptions({
          headerLeft: () => <AppBackButton name='Account Security' onBackPress={() => router.back()} />,
          headerRight: () => null
      })
    }, [])

    const securityOptions = [
        {
            title: "Two-Factor Authentication",
            description: "Add an extra layer of security with Google Authenticator.",
            icon: <Shield02Icon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(accountSecurity)/two-factor"
        },
        {
            title: "App Passcode",
            description: "Set up a passcode to protect your account.",
            icon: <LockKeyIcon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(accountSecurity)/passcode"
        },
        {
            title: "Face ID",
            description: "Use Face ID for quick and secure access.",
            icon: <FaceIdIcon size={24} color='#787A80' variant='stroke' />,
            route: "/settings/(accountSecurity)/face-id"
        }
    ]

    return (
        <View className='px-[24px] gap-y-[36px] pt-[20px]'>
            <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>
                Enhance your account security with additional authentication methods.
            </Text>
            <View className='gap-y-[12px]'>
                {securityOptions.map((option, key) => (
                    <TouchableOpacity
                        key={key}
                        className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px] gap-x-[16px] rounded-[10px]'
                        onPress={() => router.push(option.route)}
                    >
                        <View className='w-[24px]'>
                            {option.icon}
                        </View>
                        <View className='flex-1'>
                            <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                                {option.title}
                            </Text>
                            <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                                {option.description}
                            </Text>
                        </View>
                        <View className='w-[24px]'>
                            <ArrowRight01Icon size={24} color='#787A80' variant='stroke' />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default AccountSecurity
