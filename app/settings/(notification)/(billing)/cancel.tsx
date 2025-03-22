import { View, Text, Switch } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const CancelNotification = () => {
    const navigation = useNavigation()
    const [pushEnabled, setPushEnabled] = useState(true)
    const [emailEnabled, setEmailEnabled] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Subscription Cancellation' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    return (
        <View className='flex-1 px-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                Receive notifications about your subscription cancellation and account status changes.
            </Text>

            <View className='gap-y-[24px]'>
                <View className='flex-row items-center justify-between py-[16px]'>
                    <View>
                        <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                            Push Notifications
                        </Text>
                        <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                            Instant alerts for subscription changes
                        </Text>
                    </View>
                    <Switch
                        value={pushEnabled}
                        onValueChange={setPushEnabled}
                        trackColor={{ false: '#202227', true: '#1D2029' }}
                        thumbColor={pushEnabled ? '#f4f4f4' : '#787A80'}
                    />
                </View>

                <View className='flex-row items-center justify-between py-[16px]'>
                    <View>
                        <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                            Email Notifications
                        </Text>
                        <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                            Detailed cancellation confirmation
                        </Text>
                    </View>
                    <Switch
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                        trackColor={{ false: '#202227', true: '#1D2029' }}
                        thumbColor={emailEnabled ? '#f4f4f4' : '#787A80'}
                    />
                </View>
            </View>
        </View>
    )
}

export default CancelNotification
