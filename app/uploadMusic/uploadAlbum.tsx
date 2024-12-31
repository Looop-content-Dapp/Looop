import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const uploadAlbum = () => {
    const navigation = useNavigation()
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerStyle: {
            backgroundColor: "#000"
        },
        headerLeft: () => (
            <AppBackButton name='Upload music' onBackPress={() => console.log("hello")} />
        ),
        headerTitle: ""
      })
    }, [navigation])
  return (
    <View>
      <Text>uploadAlbum</Text>
    </View>
  )
}

export default uploadAlbum
