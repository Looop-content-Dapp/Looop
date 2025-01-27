import { View, Text, Pressable, TouchableOpacity, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { AccessIcon, ArrowRight01Icon, Notification02Icon, Settings01Icon, Shield02Icon, UserCircleIcon, Search01Icon } from '@hugeicons/react-native'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import { MaterialIcons } from '@expo/vector-icons'

const index = () => {
    const navigation = useNavigation()
    const [searchQuery, setSearchQuery] = useState('')

    useLayoutEffect(() => {
      navigation.setOptions((
        {
          headerLeft: () =><AppBackButton name='Settings' onBackPress={() => router.back()} />,
          headerRight: () => null
        }
      ))
    })

    const settingsMenuItems = [
        {
            title: "Account Info",
            description: "Update your account details, change your password, or deactivate your account.",
            icon: <UserCircleIcon size={24} color='#787A80' variant='stroke' />
        },
        {
            title: "Account Security",
            description: "Protect your account with 2FA, manage logged-in devices, and customize security settings to keep your data safe.",
            icon: <Shield02Icon size={24} color='#787A80' variant='stroke' />
        },
        {
            title: "Notification",
            description: "Decide how and when you receive alerts. Customize email, push, and in-app notifications to stay updated.",
            icon: <Notification02Icon size={24} color='#787A80' variant='stroke' />
        },
        {
            title: "Languages & Display",
            description: "Adjust your preferred language, text size, and display settings to improve usability.",
            icon: <MaterialIcons name="accessibility" size={24} color="#787A80" />
        },
        {
            title: "Preferences",
            description: "Customize your app experience with personal preferences and default settings.",
            icon: <Settings01Icon size={24} color='#787A80' variant='stroke' />
        },
    ]

    const filteredSettings = settingsMenuItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <View className='px-[24px]'>
            <View className='relative'>
                <TextInput
                    className='bg-[#0A0B0F] border-2 border-[#12141B] text-[#f4f4f4] p-[12px] pl-[40px] rounded-[10px] mb-[16px] mt-[24px]'
                    placeholder="Search settings..."
                    placeholderTextColor="#787A80"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View className='absolute left-[12px] top-[36px]'>
                    <Search01Icon size={20} color='#787A80' variant='stroke' />
                </View>
            </View>
            <View className='gap-y-[12px]'>
                {
                    filteredSettings.map((menu, key) => (
                        <TouchableOpacity key={key} className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px] gap-x-[16px] '>
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

                <Pressable className='bg-[#12141B] items-center justify-center mx-auto p-[10px] rounded-[10px]'>
                    <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>Log Out</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default index