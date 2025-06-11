import { View, Text, Switch } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const DisplaySettings = () => {
    const navigation = useNavigation()
    const [darkMode, setDarkMode] = useState(true)
    const [reducedMotion, setReducedMotion] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Display' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    return (
        <View className='px-[24px] gap-y-[36px] pt-[20px]'>
            <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>
                Customize your app appearance
            </Text>
            <View className='gap-y-[12px]'>
                <View className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px]'>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        trackColor={{ false: '#787A80', true: '#00FF00' }}
                    />
                </View>
                <View className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px]'>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Reduced Motion</Text>
                    <Switch
                        value={reducedMotion}
                        onValueChange={setReducedMotion}
                        trackColor={{ false: '#787A80', true: '#00FF00' }}
                    />
                </View>
            </View>
        </View>
    )
}

export default DisplaySettings
