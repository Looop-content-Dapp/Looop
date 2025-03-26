import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import { CheckmarkCircle02Icon } from '@hugeicons/react-native'

const LanguageSettings = () => {
    const navigation = useNavigation()
    const [selectedLanguage, setSelectedLanguage] = useState('english')

    const languages = [
        { id: 'english', name: 'English' },
        { id: 'spanish', name: 'Español' },
        { id: 'french', name: 'Français' },
        { id: 'german', name: 'Deutsch' },
    ]

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Language' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    return (
        <View className='px-[24px] gap-y-[36px] pt-[20px]'>
            <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>
                Select your preferred language
            </Text>
            <View className='gap-y-[12px]'>
                {languages.map((lang) => (
                    <TouchableOpacity
                        key={lang.id}
                        className='bg-[#0A0B0F] border-2 border-[#12141B] flex-row items-center justify-between p-[16px]'
                        onPress={() => setSelectedLanguage(lang.id)}
                    >
                        <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>{lang.name}</Text>
                        {selectedLanguage === lang.id && (
                            <CheckmarkCircle02Icon size={24} color='#00FF00' variant='solid' />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default LanguageSettings
