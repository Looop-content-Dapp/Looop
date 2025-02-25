import { View, Text } from 'react-native'
import React from 'react'

type Props = {
    title : string
    description : string
}

const AuthHeader = (props: Props) => {
    return (
        <View className="gap-y-2 pt-6">
            <Text className="text-white text-[24px] font-PlusJakartaSansBold">
                {props.title}
            </Text>
            <Text className="text-[#D2D3D5] text-sm font-PlusJakartaSansRegular">
                {props.description}
            </Text>
        </View>
    )
}

export default AuthHeader