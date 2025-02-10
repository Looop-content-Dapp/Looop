import { View, Text, TextInput } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const PhoneNumber = () => {
    const navigation = useNavigation()
    const [phoneNumber, setPhoneNumber] = useState('')

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Phone Number' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    })



    return (
        <View className='px-[24px] gap-y-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#787A80] font-PlusJakartaSansMedium'>
                Update your phone number. This number will be used for account recovery and notifications.
            </Text>
            <View className='gap-y-[16px]'>
                <View className='gap-y-[8px]'>
                    <Text className='text-[14px] text-[#f4f4f4] font-PlusJakartaSansMedium'>Phone Number</Text>
                    <TextInput
                        className='bg-[#0A0B0F] border-2 border-[#12141B] p-[16px] rounded-[8px] text-[#f4f4f4]'
                        placeholder="Enter your phone number"
                        placeholderTextColor="#787A80"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>
            </View>
        </View>
    )
}

export default PhoneNumber