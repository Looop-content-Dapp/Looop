import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router'
import Checkbox from 'expo-checkbox'
import { FormField } from '@/components/app-components/formField'
import { useState } from 'react'


interface SignContractProps {
  fullName: string;
  setFullName: (value: string) => void;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  onError?: (error: string) => void;
}

const SignContract = ({ fullName, setFullName, isChecked, setIsChecked, onError }: SignContractProps) => {
    const [nameError, setNameError] = useState<string>('')

    const validateFullName = (name: string) => {
        if (name.length < 2) {
            setNameError('Name must be at least 2 characters long')
            return false
        }
        if (!/^[a-zA-Z\s]*$/.test(name)) {
            setNameError('Name should only contain letters and spaces')
            return false
        }
        setNameError('')
        return true
    }

    const currentDate = new Date().toLocaleDateString('en-GB')

    return (
        <View className='px-[24px]'>
            <Text className='text-[24px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Sign Agreement</Text>
            
            <View className='gap-y-[32px] mt-[32px]'>
                <Text className='text-[20px] text-[#A5A6AA] font-PlusJakartaSansBold'>IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date upon which this digital contract is duly signed on-chain.</Text>
                
                <Text className='text-[14px] text-[#7F5AF0] font-PlusJakartaSansMedium'>This agreement will be permanently stored on the blockchain for transparency and immutability.</Text>

                <View className='gap-y-[8px] flex-row items-center'>
                    <Text className='text-[16px] text-[#A5A6AA] font-PlusJakartaSansRegular'>Platform Representative:</Text>
                    <Text className='text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold'>JOSEPH OMOTADE</Text>
                </View>

                <View className='gap-y-[8px] flex-row items-center'>
                    <Text className='text-[16px] text-[#A5A6AA] font-PlusJakartaSansRegular'>Title/Position:</Text>
                    <Text className='text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold'>FOUNDER, CEO</Text>
                </View>

                <View className='gap-y-[8px] flex-row items-center'>
                    <Text className='text-[16px] text-[#A5A6AA] font-PlusJakartaSansRegular'>Date:</Text>
                    <Text className='text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold'>{currentDate}</Text>
                </View>

                <View className='gap-y-[8px] mt-[68px]'>
                    <Text className='text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4]'>Creator Fullname</Text>
                    <Text className='text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]'>As represented in govt issued documents</Text>
                    <FormField.TextField
                        placeholder="Enter fullname"
                        value={fullName}
                        onChangeText={(text) => {
                            setFullName(text)
                            validateFullName(text)
                        }}
                        error={nameError}
                    />
                </View>

                <View className='flex-row items-start gap-x-[12px] bg-[#12141B] p-[16px] rounded-[8px]'>
                    <Checkbox
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? '#7F5AF0' : "#D2D3D5"}
                        style={{
                            borderRadius: 4
                        }}
                    />
                    <Text className='flex-1 text-[16px] font-PlusJakartaSansRegular text-[#D2D3D5]'>
                        I hereby confirm that I understand and agree to the terms outlined in this agreement. I acknowledge that this contract will be stored on the blockchain.
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default SignContract
