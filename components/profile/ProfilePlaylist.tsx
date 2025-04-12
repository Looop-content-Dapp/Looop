import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { PencilEdit02Icon } from '@hugeicons/react-native'

const ProfilePlaylist = () => {
  return (
    <View className='w-full p-4'>
      <View className='flex-row items-center justify-between'>
        <Text className='text-[14px] text-Grey/04 font-PlusJakartaSansMedium flex-1 mr-4'>
          You can pin up to 5 of your favorite playlists on your profile
        </Text>
        <TouchableOpacity className='border-[1px] border-Grey/06 flex-row items-center py-2.5 px-4 rounded-full'>
          <PencilEdit02Icon size={16} color='#787A80' />
          <Text className='text-[14px] text-Grey/04 font-PlusJakartaSansMedium ml-2'>Edit Pins</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfilePlaylist
