import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from 'expo-router'
import { AppBackButton } from '@/components/app-components/back-btn'

const uploadEP = () => {
    const navigation = useNavigation()
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerLeft: () => (
            <AppBackButton name='Upload music' onBackPress={() => console.log("hello")} />
        )
      })
    }, [navigation])
  return (
    <View>
      <Text>uploadEP</Text>
    </View>
  )
}

export default uploadEP
