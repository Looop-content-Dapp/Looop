import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppButton } from '@/components/app-components/button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Audit01Icon, HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native'
import LoadingScreen from '../loadingScreen'
import Confetti from '@/assets/svg/Confetti'
import api from '@/config/apiConfig'
import { useAppSelector } from '@/redux/hooks'

const successful = () => {
  const { name, image } = useLocalSearchParams()
  const router = useRouter()
  const { userdata } = useAppSelector((state) => state.auth)
  const [showMintingScreen, setShowMintingScreen] = useState(true);
  const  chainType = "xion"

  const handleJoinCommunity = async() => {
    const payload = {
      "recipientAddress": "xion1u6z49wty3j3a4ldn8hwv2jplyxq6rvhs472s4y",
      "type": "xion",
      "userId": userdata?._id,
      "communityId": "67a0eab9c60ab771cc6c2756",
      "collectionAddress": "xion1v47tm32nxfjtlfrcek5dq3xcg8jd6qcj4gye7flaazuh2h3ydtmqdkmn7h",
      "userAddress":  chainType === "xion" ?  userdata?.wallets.xion : userdata?.wallets.starknet,
      "transactionReference": `Minting tribe pass of ${name} to ${userdata?._id} with wallet address ${chainType === "xion" ?  userdata?.wallets.xion : userdata?.wallets.starknet}`
  }
    try {
      const res = await api.post('/api/community/joincommunity', payload)
    } catch (error) {
      
    }
  }
  

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
          <View className="relative items-center">
            <Image
              source={{ uri: image as string }}
              className="w-[280px] aspect-square rounded-[32px]"
              style={{ resizeMode: "cover" }}
            />
            
            {/* Audio Wave Icon */}
            <View className="absolute -top-4 -left-4">
              <View className="w-14 h-14 bg-[#1ED760] rounded-full items-center justify-center rotate-[-15deg]">
                <Audit01Icon size={28} color="#000000" />
              </View>
            </View>
            
            {/* Confetti */}
            <View className="absolute -top-8 right-0">
               <Confetti  />
            </View>
            
            {/* Group Icon */}
            <View className="absolute -bottom-6 left-4">
              <View className="w-[80px] h-[80px] bg-[#A187B5] rounded-[20px] items-center justify-center rotate-[15deg]">
                 <UserGroupIcon size={40} color='black' variant='solid' />
              </View>
            </View>
            
            {/* Headphones Icon */}
            <View className="absolute -bottom-2 right-4">
              <View className="w-[60px] h-[60px] bg-[#FF8A49] rounded-[18px] items-center justify-center rotate-[10deg]">
                <HeadphonesIcon size={32} color='black' variant='solid' />
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <View className="mt-16 items-center">
            <Text className="text-[32px] font-PlusJakartaSansBold text-white">
              Welcome to Ravers HQ
            </Text>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-[#D2D3D5] text-center mt-3 px-6">
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

export default successful