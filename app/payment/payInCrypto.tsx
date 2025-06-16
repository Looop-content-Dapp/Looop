import { AppBackButton } from "@/components/app-components/back-btn";
import { AppButton } from "@/components/app-components/button";
import ChainPicker from "@/components/app-components/ChainPicker";
import LoadingModal from '@/components/app-components/LoadingModal'; // Added import
import { useNotification } from "@/context/NotificationContext";
import { useJoinCommunity } from "@/hooks/community/useJoinCommunity";
import { useAppSelector } from "@/redux/hooks";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const payInCrypto = () => {
  const { showNotification } = useNotification();
  const {
    name,
    image,
    communityId,
    collectionAddress,
    type,
    userAddress,
    currentRoute,
  } = useLocalSearchParams();
  console.log("communityIds", communityId);
  const navigation = useNavigation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionLoading, setIsTransactionLoading] = useState(false); // Added state for loading modal
  const { userdata } = useAppSelector((state) => state.auth);
  const joinCommunity = useJoinCommunity();
  console.log("currentRoute", currentRoute);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton
          name="Crypto Payment"
          onBackPress={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  const checkBalanceAndProceed = async () => {
    try {
      setIsLoading(true);
      setIsTransactionLoading(true); // Show loading modal
      console.log("Starting join community process:", {
        userId: userdata?._id,
        communityId,
        type,
      });

      const result = await joinCommunity.mutateAsync({
        userId: userdata?._id || "",
        communityId: communityId as string,
        type: "starknet",
      });

      console.log("Join community result:", result);

      if (result.status === "success") {
        showNotification({
          type: "success",
          title: "Success",
          message: "Successfully joined the community!",
          position: "top",
        });
      } else {
        throw new Error("Join community response was not successful");
      }
    } catch (error: any) {
      console.error("Join community error details:", {
        error: error.message,
        response: error.response?.data.error,
        stack: error.stack,
      });

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.error ||
        "Failed to join community. Please try again.";

      showNotification({
        type: "error",
        title: "Error",
        message: errorMessage,
        position: "top",
      });
      // router.dismissTo(`${currentRoute}`)
    } finally {
      setIsLoading(false);
      setIsTransactionLoading(false); // Hide loading modal
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-[24px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-[24px] gap-y-[16px]">
          <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">
            Mint Tribe pass
          </Text>

          <View className="bg-[#FF6D1B20] p-3 rounded-[8px] mb-2">
            <Text className="text-[14px] text-[#FF6D1B] font-PlusJakartaSansMedium">
              ⚠️ Test Mode: This is a demonstration version. No real
              cryptocurrency transactions will be processed.
            </Text>
          </View>

          <ChainPicker userId={userdata?._id} />

          <View className="bg-[#12141B] p-3 rounded-[8px]">
            <Text className="text-[12px] text-[#A5A6AA]">
              • This is a demo version for testing purposes only{"\n"}• No real
              cryptocurrency will be transferred{"\n"}• All network selections
              and balances are simulated{"\n"}• For more information about
              crypto payments, visit our help center
            </Text>
          </View>
        </View>

        <View className="px-[8px] pt-[8px] pb-[24px] border-[0.5px] border-[#787A80] bg-[#0A0B0F] rounded-[32px] mt-[24px] mb-[24px]">
          <Image
            source={{ uri: image as string }}
            className="w-full aspect-square rounded-[24px]"
            style={{ resizeMode: "cover" }}
          />
          <Text
            numberOfLines={1}
            className="text-[24px] text-[#FAFBFB] font-PlusJakartaSansBold pl-[16px] pt-[6px]"
          >
            {name}
          </Text>
          <View className="flex-row items-center justify-between px-[16px] mt-[8px]">
            <View className="flex-1">
              <View className="flex-row items-center self-start bg-[#A187B5] py-[6px] rounded-[56px] px-[12px]">
                <Text
                  className="text-[#0A0B0F] text-[14px] font-PlusJakartaSansBold"
                  numberOfLines={1}
                >
                  $5/month
                </Text>
              </View>
            </View>
            <Image
              source={require("../../assets/images/logo-gray.png")}
              className="w-[49px] h-[22px] ml-[16px]"
              style={{ resizeMode: "contain" }}
            />
          </View>
        </View>
      </ScrollView>

      <View className="px-[24px] pb-[24px]">
        <AppButton.Primary
          color="#FF6D1B"
          text={"Continue (Test Mode)"}
          loading={isLoading}
          disabled={isLoading}
          onPress={checkBalanceAndProceed}
        />
      </View>
      <LoadingModal visible={isTransactionLoading} message="Processing your transaction..." />
    </View>
  );
};

export default payInCrypto;
