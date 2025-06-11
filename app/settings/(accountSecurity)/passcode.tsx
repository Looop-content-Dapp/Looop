import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const Passcode = () => {
    const navigation = useNavigation()
    const [passcode, setPasscode] = useState('')
    const [step, setStep] = useState('create') // 'create' or 'confirm'

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Set Passcode' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    const handleNumberPress = (number: string) => {
        if (passcode.length < 6) {
            setPasscode(prev => prev + number)
        }
    }

    const handleDelete = () => {
        setPasscode(prev => prev.slice(0, -1))
    }

    return (
        <View className='flex-1 px-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                {step === 'create'
                    ? 'Create a 6-digit passcode to protect your account.'
                    : 'Confirm your passcode.'}
            </Text>

            <View className='flex-row justify-center gap-x-[16px] mb-[48px]'>
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        className={`w-[16px] h-[16px] rounded-full ${
                            passcode.length > i ? 'bg-[#FF5454]' : 'bg-[#12141B]'
                        }`}
                    />
                ))}
            </View>

            <View className='flex-row flex-wrap justify-center gap-[16px] mt-[80%]'>
                {[1,2,3,4,5,6,7,8,9,0,'delete'].map((num, index) => (
                    <TouchableOpacity
                        key={index}
                        className='w-[72px] h-[72px] rounded-full bg-[#0A0B0F] border-2 border-[#12141B] items-center justify-center'
                        onPress={() => num === 'delete' ? handleDelete() : handleNumberPress(num.toString())}
                    >
                        <Text className='text-[24px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                            {num === 'delete' ? '←' : num}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default Passcode
