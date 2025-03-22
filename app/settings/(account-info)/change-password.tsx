import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import { showToast } from '@/config/ShowMessage'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordSchema, type PasswordSchema } from './validation'
import { ViewIcon, ViewOffIcon } from "@hugeicons/react-native"

const ChangePassword = () => {
    const navigation = useNavigation()
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema)
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Change Password' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    const onSubmit = async (data: PasswordSchema) => {
        try {
            showToast('Password updated successfully', 'success')
            router.back()
        } catch (error) {
            showToast('Failed to update password', 'error')
        }
    }

    return (
        <View className='px-[24px] pt-[20px]'>
            <View className='mb-[45px]'>
                <Text className='text-[14px] font-PlusJakartaSansMedium text-[#63656B] leading-[18px] -tracking-[0.28px]'>
                Protect your account with 2FA, manage logged-in devices, and customize security settings to keep your data safe.
                </Text>
            </View>
            <View className='gap-y-[24px]'>
                <View className='gap-y-[16px]'>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>New Password</Text>
                    <View className='relative'>
                        <Controller
                            control={control}
                            name="newPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className={`bg-transparent border border-[#202227] py-[22px] pl-[24px] pr-[56px] rounded-[56px] text-[#f4f4f4] ${errors.newPassword ? 'border-red-500' : ''}`}
                                    placeholder="Enter new password"
                                    placeholderTextColor="#787A80"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showNewPassword}
                                />
                            )}
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            className='absolute right-[24px] top-[22px]'
                        >
                            {showNewPassword ? (
                                <ViewOffIcon size={24} color='#787A80' variant='solid' />
                            ) : (
                                <ViewIcon size={24} color='#787A80' variant='solid' />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors.newPassword && (
                        <Text className='text-red-500 text-[12px] mt-2'>
                            {errors.newPassword.message}
                        </Text>
                    )}
                </View>

                <View className='gap-y-[16px]'>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Confirm New Password</Text>
                    <View className='relative'>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    className={`bg-transparent border border-[#202227] py-[22px] pl-[24px] pr-[56px] rounded-[56px] text-[#f4f4f4] ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    placeholder="Confirm new password"
                                    placeholderTextColor="#787A80"
                                    value={value}
                                    onChangeText={onChange}
                                    secureTextEntry={!showConfirmPassword}
                                />
                            )}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            className='absolute right-[24px] top-[22px]'
                        >
                            {showConfirmPassword ? (
                                <ViewOffIcon size={24} color='#787A80' variant='solid' />
                            ) : (
                                <ViewIcon size={24} color='#787A80' variant='solid' />
                            )}
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                        <Text className='text-red-500 text-[12px] mt-2'>
                            {errors.confirmPassword.message}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    )
}

export default ChangePassword
