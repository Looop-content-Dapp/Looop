import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
    title: string;
    onPress: () => void
}

export default function Button({title, onPress}: Props) {
  return (
    <TouchableOpacity onPress={onPress} className='bg-Orange/08 items-center w-full rounded-[56px] py-[16px]'>
      <Text className='text-[16px] text-[#fff] font-PlusJakartaSansMedium'>{title}</Text>
    </TouchableOpacity>
  )
}
