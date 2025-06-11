import { View, Text, Image, Dimensions, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppButton } from '@/components/app-components/button'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Audit01Icon, HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native'
import LoadingScreen from '../loadingScreen'
import Confetti from '@/assets/svg/Confetti'
import { useJoinCommunity } from '@/hooks/community/useJoinCommunity'
import { useAppSelector } from '@/redux/hooks'

const { width, height } = Dimensions.get('window'); 

const successful = () => {
  const { name, image, userId, communityId } = useLocalSearchParams()
  const { userdata } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [showMintingScreen, setShowMintingScreen] = useState(true);
  const joinCommunityMutation = useJoinCommunity();

  useEffect(() => {
    const joinCommunity = async () => {
      try {
        await joinCommunityMutation.mutateAsync({
          userId: userdata?._id as string,
          communityId: communityId as string,
          type: 'starknet'
        });

        // Only hide the minting screen after successful join
        setTimeout(() => {
          setShowMintingScreen(false);
        }, 3000);
      } catch (error) {
        console.error('Failed to join community:', error);
        // Handle error appropriately
      }
    };

    joinCommunity();
  }, []);

  if (showMintingScreen || joinCommunityMutation.isPending) {
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
    <SafeAreaView className="flex-1 bg-[#040405]">
      <View className="flex-1 bg-[#040405] px-6">
      <View className="flex-1 items-center mt-[100px]">
        <View className="w-full relative">
          {/* Main Image Container with Icons */}
          <View className="relative items-center">
            <Image
              source={{ uri: image as string }}
              className="w-[216px] aspect-square rounded-[32px]"
              style={{ resizeMode: "cover" }}
            />

            {/* Floating Icons */}
            <View className="absolute -top-3 -left-3">
              <View className="w-12 h-12 bg-[#1ED760] rounded-full items-center justify-center">
                <Audit01Icon size={24} color="#000000" />

              </View>
            </View>

            <View className="absolute -top-28 right-4">
               <Confetti />
            </View>

            <View className="absolute -bottom-3  left-12">
              <View className="w-[90px] h-[90px] bg-[#A187B5] rounded-[24px] items-center justify-center">
                 <UserGroupIcon size={46} color='black' variant='solid' />
              </View>
            </View>

            <View className="absolute bottom-12 right-20">
              <View className="w-[64px] h-[64px] bg-[#FF8A49] rounded-[24px] items-center justify-center">
                <HeadphonesIcon size={34.133} color='black' variant='solid' />
              </View>
            </View>
          </View>

          {/* Welcome Text */}
          <View className="mt-[105px] items-center">
            <Text className="text-[28px] font-PlusJakartaSansBold text-white">
              Welcome to {name}
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
            onPress={() => router.navigate({
                pathname: "/CommunityDetails",
                params: {
                    id: communityId,
                }
            })}
          />
        </View>
      </View>
    </View>
    </SafeAreaView>
  )
}

export default successful
