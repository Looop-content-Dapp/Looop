import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton'
import { router } from 'expo-router'

const ProfileCard = ({item}) => {
  return (
    <Pressable
    onPress={() => router.push(`/(musicTabs)/(home)/_screens/artist/${item._id}`)}
    className="items-start gap-y-[4px]">
  <Skeleton radius="round">
    <Image
      source={{ uri: item.image }}
      className="w-[140px] h-[140px] m-[8px] rounded-full bg-white"
    />
  </Skeleton>
  <Skeleton >
  <Text className="text-[#fff] items-center font-bold font-PlusJakartaSansBold text-[14px]">
      {item.name}
    </Text>
  </Skeleton>
  </Pressable>
  )
}

export default ProfileCard
