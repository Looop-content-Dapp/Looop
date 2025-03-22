import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { router, useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'
import { showToast } from '@/config/ShowMessage'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { phoneNumberSchema, type PhoneNumberSchema } from './validation'

const PhoneNumber = () => {
    const navigation = useNavigation()
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<PhoneNumberSchema>({
        resolver: zodResolver(phoneNumberSchema)
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => <AppBackButton name='Phone Number' onBackPress={() => router.back()} />,
            headerRight: () => null
        })
    }, [])

    const onSubmit = async (data: PhoneNumberSchema) => {
        try {
            showToast('Phone number updated successfully', 'success')
            router.back()
        } catch (error) {
            showToast('Failed to update phone number', 'error')
        }
    }

    return (
        <View className='px-[24px] pt-[20px] '>
             <View className='mb-[45px]'>
             <Text className='text-[14px] font-PlusJakartaSansMedium text-[#63656B] leading-[18px] -tracking-[0.28px]'>Update your account details to ensure everything stays current.</Text>
             </View>
             <View className='gap-y-[16px]'>
                <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Phone Number</Text>
             <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className={`bg-transparent border border-[#202227] py-[22px] pl-[24px] rounded-[56px] text-[#f4f4f4] ${errors.phoneNumber ? 'border border-red-500' : ''}`}
                        placeholder="+234 9000 000 0000"
                        placeholderTextColor="#787A80"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                    />
                )}
            />
            {errors.phoneNumber && (
                <Text className='text-red-500 text-[12px] mt-2'>
                    {errors.phoneNumber.message}
                </Text>
            )}
             </View>
        </View>
    )
}

export default PhoneNumber
