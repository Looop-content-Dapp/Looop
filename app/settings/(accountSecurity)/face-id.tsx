import { View, Text, Switch } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import * as LocalAuthentication from 'expo-local-authentication'

const FaceID = () => {
    const navigation = useNavigation()
    const [isEnabled, setIsEnabled] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Face ID' onBackPress={() => router.back()} />,
            headerRight: () => null
        })

        checkBiometricSupport()
    }, [])

    const checkBiometricSupport = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync()
        const enrolled = await LocalAuthentication.isEnrolledAsync()

        if (!compatible || !enrolled) {
            // router.back()
            // Show error message that device doesn't support Face ID
        }
    }

    const toggleFaceID = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to enable Face ID',
                disableDeviceFallback: true
            })

            if (result.success) {
                setIsEnabled(!isEnabled)
                // Update user preferences in your backend
            }
        } catch (error) {
            console.error('Face ID authentication error:', error)
        }
    }

    return (
        <View className='flex-1 px-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                Use Face ID for quick and secure access to your account.
            </Text>

            <View className='flex-row items-center justify-between py-[16px]'>
                <View>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                        Enable Face ID
                    </Text>
                    <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                        Use facial recognition to log in
                    </Text>
                </View>
                <Switch
                    value={isEnabled}
                    onValueChange={toggleFaceID}
                    trackColor={{ false: '#202227', true: '#1D2029' }}
                    thumbColor={isEnabled ? '#f4f4f4' : '#787A80'}
                />
            </View>
        </View>
    )
}

export default FaceID
