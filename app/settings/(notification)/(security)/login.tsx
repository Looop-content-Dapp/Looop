import { View, Text, Switch } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const LoginNotification = () => {
    const navigation = useNavigation()
    const [pushEnabled, setPushEnabled] = useState(true)
    const [emailEnabled, setEmailEnabled] = useState(true)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Login Security' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    return (
        <View className='flex-1 px-[24px] pt-[20px]'>
            <Text className='text-[14px] text-[#63656B] font-PlusJakartaSansMedium mb-[32px]'>
                Stay informed about new device logins and unusual account activity to keep your account secure.
            </Text>

            <View className='gap-y-[24px]'>
                <View className='flex-row items-center justify-between py-[16px]'>
                    <View>
                        <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>
                            Push Alerts
                        </Text>
                        <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                            Instant alerts for new device logins
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
                            Email Alerts
                        </Text>
                        <Text className='text-[14px] font-PlusJakartaSansMedium text-[#787A80]'>
                            Email notifications for security events
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

export default LoginNotification
