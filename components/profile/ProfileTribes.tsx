import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useTribes } from '@/hooks/useTribes'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'expo-router'
import { getColors } from 'react-native-image-colors'

// Separate component for tribe item
const TribeItem = ({ item }) => {
  const [backgroundColor, setBackgroundColor] = useState('#1C1C1E')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [subTextColor, setSubTextColor] = useState('#787A80')
  const router = useRouter()

  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.slice(1, 3), 16)
    const g = parseInt(bgColor.slice(3, 5), 16)
    const b = parseInt(bgColor.slice(5, 7), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  useEffect(() => {
    const fetchColors = async () => {
      if (item.coverImage) {
        try {
          const result = await getColors(item.coverImage, {
            fallback: '#1C1C1E',
            cache: true,
          })
          let bgColor = '#1C1C1E'
          if (result.platform === 'android') {
            bgColor = result.dominant
          } else if (result.platform === 'ios') {
            bgColor = result.background
          }
          setBackgroundColor(bgColor)
          const mainColor = getContrastColor(bgColor)
          setTextColor(mainColor)
          setSubTextColor(mainColor === '#FFFFFF' ? '#787A80' : '#666666')
        } catch (error) {
          setBackgroundColor('#1C1C1E')
          setTextColor('#FFFFFF')
          setSubTextColor('#787A80')
        }
      }
    }
    fetchColors()
  }, [item.coverImage])

  return (
    <TouchableOpacity
      className="mb-4 overflow-hidden h-[120px] flex-row rounded-[16px]"
      style={{ backgroundColor }}
      onPress={() => router.push({
        pathname: `/communityDetails`,
        params: {
            id: item?.id,
            name: item?.name,
            image: item?.coverImage,
            description: item?.description,
            noOfMembers: item?.memberCount,
        }
      })}
    >
      <Image
        source={{ uri: item.coverImage }}
        className="w-[120px] h-full"
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-center">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-[20px] text-[#F4F4F4] font-PlusJakartaSansBold"
            style={{ color: textColor }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <Text
            className="text-[12px] font-PlusJakartaSansMedium"
            style={{ color: subTextColor }}
            numberOfLines={1}
          >
            {item.artist.name}
          </Text>
          <Text
            className="text-[12px] font-PlusJakartaSansMedium"
            style={{ color: subTextColor }}
          >
            {" • "}
          </Text>
          <Text
            className="text-[12px] font-PlusJakartaSansMedium"
            style={{ color: subTextColor }}
          >
            {item.memberCount} Members
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

interface ProfileTribesProps {
  userId: string;
}

const ProfileTribes = ({ userId }: ProfileTribesProps) => {
  const { data, isLoading, error } = useTribes(1, 10, 30000, userId)

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
       <ActivityIndicator size="small" color="#FF7A1B" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#f4f4f4]">Error loading tribes</Text>
      </View>
    )
  }

  if (!data?.data.communities?.length) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-[#f4f4f4]">No tribes joined yet</Text>
      </View>
    )
  }

  return (
    <View className="px-0">
      <FlatList
        data={data.data.communities}
        renderItem={({ item }) => <TribeItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  )
}

export default ProfileTribes
