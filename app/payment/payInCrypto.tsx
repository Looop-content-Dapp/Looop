import {
    View,
    Text,
    Image,
    ScrollView,
    Alert,
  } from "react-native";
  import React, { useLayoutEffect, useState } from "react";
  import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
  import { AppBackButton } from "@/components/app-components/back-btn";
  import { AppButton } from "@/components/app-components/button";
import ChainPicker from "@/components/app-components/ChainPicker";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useJoinCommunity } from "@/hooks/useJoinCommunity";
import { useAppSelector } from "@/redux/hooks";

  const payInCrypto = () => {
    const {
      name,
      image,
      communityId,
      collectionAddress,
      type,
      userAddress
    } = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userdata } = useAppSelector((state) => state.auth);

    const { data: walletData, isLoading: isBalanceLoading } = useWalletBalance(userdata?._id || "");
    const joinCommunity = useJoinCommunity();

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
      if (isBalanceLoading) {
        Alert.alert("Loading", "Please wait while we fetch your balance");
        return;
      }

      if (!walletData?.data?.xion?.balances?.[0]) {
        Alert.alert("Error", "Unable to fetch wallet balance. Please try again later.");
        return;
      }

      try {
        const xionBalance = walletData.data.xion.balances[0];
        const usdcBalance = xionBalance.amountFloat || 0;
        const requiredAmount = 2; // Fixed amount for tribe pass

        if (usdcBalance < requiredAmount) {
          Alert.alert(
            "Insufficient Balance",
            `You need ${requiredAmount} USDC to mint this tribe pass. Your current balance is ${usdcBalance.toFixed(2)} USDC.`,
            [{ text: "OK" }]
          );
          return;
        }

        setIsLoading(true);
        const transactionReference = `P-C-${new Date().toISOString().slice(0,10)}-${Math.random().toString(36).substring(2,12).toUpperCase()}`;

        const result = await joinCommunity.mutateAsync({
          type: "xion",
          userId: userdata?._id || "",
          communityId: communityId as string,
          collectionAddress: collectionAddress as string,
          userAddress: userAddress as string,
          transactionReference,
        });

        if (result.status === "success") {
          Alert.alert(
            "Success",
            "Successfully joined the community!",
            [
              {
                text: "OK",
                onPress: () => router.push("/(settingUp)/communityOnboarding"),
              },
            ]
          );
        }
      } catch (error) {
        Alert.alert("Error", "Failed to join community. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View className="flex-1">
        <ScrollView className="flex-1 px-[24px]" showsVerticalScrollIndicator={false}>
          <View className="mt-[24px] gap-y-[16px]">
            <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">Mint Tribe pass</Text>

            <View className="bg-[#FF6D1B20] p-3 rounded-[8px] mb-2">
              <Text className="text-[14px] text-[#FF6D1B] font-PlusJakartaSansMedium">
                ⚠️ Test Mode: This is a demonstration version. No real cryptocurrency transactions will be processed.
              </Text>
            </View>

            <ChainPicker />

            <View className="bg-[#12141B] p-3 rounded-[8px]">
              <Text className="text-[12px] text-[#A5A6AA]">
                • This is a demo version for testing purposes only{'\n'}
                • No real cryptocurrency will be transferred{'\n'}
                • All network selections and balances are simulated{'\n'}
                • For more information about crypto payments, visit our help center
              </Text>
            </View>
          </View>

          <View className="px-[8px] pt-[8px] pb-[24px] border-[0.5px] border-[#787A80] bg-[#0A0B0F] rounded-[32px] mt-[24px] mb-[24px]">
            <Image
              source={{ uri: image as string }}
              className="w-full aspect-square rounded-[24px]"
              style={{ resizeMode: "cover" }}
            />
            <View className="flex-row items-end px-[16px] mt-[16px]">
              <View className="flex-1 gap-y-[8px]">
                <Text className="text-[24px] text-[#FAFBFB] font-PlusJakartaSansBold">Rave Pass</Text>
                <View className="flex-row items-center w-[93px] bg-[#A187B5] py-[8px] rounded-[56px] px-[12px]">
                  <Text className="text-[#0A0B0F] text-[14px] font-PlusJakartaSansBold">$2/month</Text>
                </View>
              </View>
              <Image
                source={require("../../assets/images/logo-gray.png")}
                className="w-[49px] h-[22px]"
                style={{ resizeMode: "cover" }}
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-[24px] pb-[24px]">
          <AppButton.Primary
            color="#FF6D1B"
            text={isBalanceLoading ? "Checking Balance..." : "Continue (Test Mode)"}
            loading={isBalanceLoading}
            onPress={checkBalanceAndProceed}
          />
        </View>
      </View>
    );
  };

  export default payInCrypto;
