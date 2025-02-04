import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppButton } from '@/components/app-components/button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Audit01Icon, HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native'
import LoadingScreen from '../loadingScreen'

const MintingSuccessful = () => {
  const { name, image } = useLocalSearchParams()
  const router = useRouter()
  const [showMintingScreen, setShowMintingScreen] = useState(true);

  useEffect(() => {
    // After 3 seconds, show the success screen
    const timer = setTimeout(() => {
      setShowMintingScreen(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showMintingScreen) {
    return (
      <LoadingScreen
        words={[
          { text: 'Minting', color: '#FF6D1B' },
          { text: 'Processing', color: '#FF6D1B' },
          { text: 'Confirming', color: '#FF6D1B' },
        ]}
        prefixText="Please wait"
        finalMessage="Minting your Tribe Pass..."
        showBackButton={false}
        onContinue={() => {}}
        animationDuration={600}
        delayBeforeFinal={2000}
      />
    );
  }

  return (
    <View className="flex-1 bg-[#040405] px-6">
      <View className="flex-1 items-center justify-center">
        <View className="w-full relative">
          {/* Main Image Container with Icons */}
          <View className="relative">
            <Image
              source={{ uri: image as string }}
              className="w-full aspect-square rounded-[32px]"
              style={{ resizeMode: "cover" }}
            />
            
            {/* Floating Icons */}
            <View className="absolute -top-3 -left-3">
              <View className="w-12 h-12 bg-[#1ED760] rounded-full items-center justify-center">
                <Audit01Icon size={24} color="#000000" />
                
              </View>
            </View>
            
            <View className="absolute -top-1 right-4">
              {/* <Image
                source={require("../../assets/images/confetti-icon.png")}
                className="w-16 h-16"
                style={{ resizeMode: "contain" }}
              /> */}
            </View>
            
            <View className="absolute -bottom-3 -left-1">
              <View className="w-14 h-14 bg-[#7B5BA3] rounded-full items-center justify-center">
                 <UserGroupIcon size={24} color='black' variant='solid' />
              </View>
            </View>
            
            <View className="absolute -bottom-2 right-2">
              <View className="w-12 h-12 bg-[#FF6D1B] rounded-full items-center justify-center">
                <HeadphonesIcon size={24} color='black' variant='solid' />
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <View className="mt-8 items-center">
            <Text className="text-[28px] font-PlusJakartaSansBold text-white">
              Welcome to Ravers HQ
            </Text>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-[#D2D3D5] text-center mt-2">
              Connect with other fans and join the important discussions and just have fun
            </Text>
          </View>
        </View>

        {/* Start Exploring Button */}
        <View className="w-full mt-12">
          <AppButton.Primary
            color="#FF6D1B"
            text="Start exploring"
            loading={false}
            onPress={() => router.push('/(tabs)')}
          />
        </View>
      </View>
    </View>
  )
}

export default MintingSuccessful