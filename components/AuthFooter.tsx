import { View, Text, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { StarknetB, XIONB } from '@/assets/images/images'

const AuthFooter = () => {
    return (
        <View className="flex-col gap-y-4">
            <Text
                className="text-center text-[#787A80] font-PlusJakartaSansRegular text-xs uppercase ">
                Powered by
            </Text>
            <View className="flex-row items-center justify-center gap-x-2">
                <View className="flex-row items-center justify-center gap-x-2">
                    <Image
                        source={XIONB as ImageSourcePropType}
                        style={{
                            width: 20, height: 20,

                        }}
                    />
                    <Text className="text-[#787A80] font-PlusJakartaSansRegular uppercase">
                        Xion
                    </Text>
                </View>
                <View className="flex-row items-center justify-center gap-x-2">
                    <Image
                        source={StarknetB as ImageSourcePropType}
                        style={{
                            width: 20, height: 20,

                        }}
                    />
                    <Text className="text-[#787A80] font-PlusJakartaSansRegular uppercase">
                        Starknet
                    </Text>
                </View>
            </View>



        </View>
    )
}

export default AuthFooter