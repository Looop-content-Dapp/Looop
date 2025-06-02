import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import QRCode from 'react-native-qrcode-svg'

const TwoFactorAuth = () => {
    const navigation = useNavigation()
    const [secret] = useState('JBSWY3DPEHPK3PXP') // This should come from your backend

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Two-Factor Authentication' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    return (
        <View className='flex-1 px-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                Scan this QR code with Google Authenticator to enable two-factor authentication.
            </Text>

            <View className='items-center mb-[32px]'>
                <View className='bg-white p-[16px] rounded-[10px]'>
                    <QRCode
                        value={`otpauth://totp/Looop:user@example.com?secret=${secret}&issuer=Looop`}
                        size={200}
                    />
                </View>
            </View>

            <View className='gap-y-[16px]'>
                <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                    Manual Setup
                </Text>
                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                    If you can't scan the QR code, enter this code manually in Google Authenticator:
                </Text>
                <View className='bg-[#0A0B0F] border-2 border-[#12141B] p-[16px] rounded-[10px]'>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4] text-center'>
                        {secret}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                className='bg-[#FF5454] py-[16px] rounded-[10px] mt-auto mb-[32px]'
                onPress={() => router.push('/settings/(accountSecurity)/verify-2fa')}
            >
                <Text className='text-[16px] font-PlusJakartaSansMedium text-white text-center'>
                    Continue
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default TwoFactorAuth
