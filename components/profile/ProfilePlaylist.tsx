import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { PencilEdit02Icon } from '@hugeicons/react-native'

const ProfilePlaylist = () => {
  return (
    <View>
     <View className='flex-row items-center justify-between px-3'>
        <Text className='text-[14px] text-Grey/04 font-PlusJakartaSansMedium w-[70%]'>You can pin up to 5 of your favorite playlists on your profile</Text>
        <TouchableOpacity className='border-2 border-Grey/06 flex-row gap-x-2 items-center py-[12px] px-[16px] rounded-[24px]'>
            <PencilEdit02Icon size={16} color='#787A80' />
            <Text className='text-[14px] text-Grey/04 font-PlusJakartaSansMedium'>Edit Pins</Text>
        </TouchableOpacity>
     </View>
    </View>
  )
}

export default ProfilePlaylist
