import { View, Text, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const Verify2FA = () => {
    const navigation = useNavigation()
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Verify 2FA' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    const handleNumberPress = (number: string) => {
        if (code.length < 6) {
            setCode(prev => prev + number)
            setError('')
        }
    }

    const handleDelete = () => {
        setCode(prev => prev.slice(0, -1))
        setError('')
    }

    const handleVerify = async () => {
        try {
            // Here you would verify the code with your backend
            // const response = await verify2FACode(code)

            // Temporary mock verification
            if (code === '123456') {
                router.push('/settings/(accountSecurity)')
                // Show success message
            } else {
                setError('Invalid code. Please try again.')
            }
        } catch (error) {
            setError('Something went wrong. Please try again.')
        }
    }

    return (
        <View className='flex-1 px-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                Enter the 6-digit code from your Google Authenticator app to verify and enable 2FA.
            </Text>

            <View className='flex-row justify-center gap-x-[16px] mb-[48px]'>
                {[...Array(6)].map((_, i) => (
                    <View
                        key={i}
                        className={`w-[16px] h-[16px] rounded-full ${
                            code.length > i ? 'bg-[#FF5454]' : 'bg-[#12141B]'
                        }`}
                    />
                ))}
            </View>

            {error ? (
                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#FF5454] text-center mb-[24px]'>
                    {error}
                </Text>
            ) : null}

            <View className='flex-row flex-wrap justify-center mt-[50%] gap-[16px]'>
                {[1,2,3,4,5,6,7,8,9,'',0,'delete'].map((num, index) => (
                    <TouchableOpacity
                        key={index}
                        className={`w-[72px] h-[72px] rounded-full bg-[#0A0B0F] border-2 border-[#12141B] items-center justify-center ${
                            num === '' ? 'opacity-0' : ''
                        }`}
                        onPress={() => {
                            if (num === 'delete') {
                                handleDelete()
                            } else if (num !== '') {
                                handleNumberPress(num.toString())
                            }
                        }}
                        disabled={num === ''}
                    >
                        <Text className='text-[24px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                            {num === 'delete' ? '←' : num}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                className={`bg-[#FF5454] py-[16px] rounded-[10px] mt-auto mb-[32px] ${
                    code.length === 6 ? 'opacity-100' : 'opacity-50'
                }`}
                onPress={handleVerify}
                disabled={code.length !== 6}
            >
                <Text className='text-[16px] font-PlusJakartaSansMedium text-white text-center'>
                    Verify
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default Verify2FA
