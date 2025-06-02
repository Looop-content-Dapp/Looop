import { View, Text, Image, TouchableOpacity, Modal, Alert, ScrollView } from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import { AppButton } from "@/components/app-components/button";
import { useAppSelector } from "@/redux/hooks";
import { Paystack, paystackProps } from 'react-native-paystack-webview';

const Index = () => {
  const { name, image, communityId, collectionAddress, type, userAddress } = useLocalSearchParams();
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
  const navigation = useNavigation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton name="Join Tribe" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  const handlePaystackSuccess = (response: any) => {
    try {
      const { reference, transaction, status } = response;
      if (status === 'success') {
        Alert.alert(
          "Payment Successful",
          `Transaction reference: ${reference}`
        );
        setIsModalVisible(false);
        router.push({
          pathname: "/payment/success",
          params: {
            name,
            image,
            reference,
            communityId,
            collectionAddress,
            type: "paystack",
            userAddress: userdata?.wallets?.xion,
          },
        });
      }
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        "Unable to verify your payment. Please contact support."
      );
    }
  };

  const handlePaystackCancel = () => {
    Alert.alert("Payment Cancelled", "You cancelled the payment");
    setIsModalVisible(false);
  };

  const payNow = () => {
    paystackWebViewRef?.current?.startTransaction();
  };

  return (
    <View className="flex-1">
      <AppButton.Primary
        color="#FF6D1B"
        text="Continue to Payment"
        loading={false}
        onPress={() => setIsModalVisible(true)}
        className="absolute bottom-6 left-6 right-6 z-10 py-[16px] rounded-[56px]"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-[24px] gap-y-[24px] pb-[100px]">
          <View className="mt-[24px] gap-y-[16px] items-start">
            <Text className="text-[32px] font-PlusJakartaSansBold text-[#f4f4f4]">
              Mint your Tribe Pass
            </Text>
            <Text className="text-[18px] font-PlusJakartaSansMedium text-[#D2D3D5] mb-4">
              Mint an NFT of your favorite artist to gain exclusive access to their Tribe. This NFT serves as your key pass to connect with fans, join conversations, and unlock unique experiences.
            </Text>
          </View>

          <View className="px-[8px] pt-[8px] pb-[24px] border-[0.5px] border-[#787A80] bg-[#0A0B0F] rounded-[32px] mt-[24px] mb-[24px]">
            <Image
              source={{ uri: image as string }}
              className="w-full aspect-square rounded-[24px]"
              style={{ resizeMode: "cover" }}
            />
            <Text numberOfLines={1} className="text-[24px] text-[#FAFBFB] font-PlusJakartaSansBold pl-[16px] pt-[6px]">{name}</Text>
            <View className="flex-row items-center justify-between px-[16px] mt-[8px]">
              <View className="flex-1">
                <View className="flex-row items-center self-start bg-[#A187B5] py-[6px] rounded-[56px] px-[12px]">
                  <Text className="text-[#0A0B0F] text-[14px] font-PlusJakartaSansBold" numberOfLines={1}>
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

          <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIsModalVisible(false)}
              className="flex-1 justify-end bg-Grey/07/50"
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
                className="bg-[#040405] h-[35%] rounded-t-[32px] p-6"
              >
                <View className="w-[48px] h-[4px] bg-[#787A80] rounded-full mx-auto mb-6" />

                <View className="items-center justify-center gap-y-[24px]">
                  <Text className="text-[20px] font-PlusJakartaSansBold text-white mb-4">
                    Mint collectible
                  </Text>
                  <Text className="text-[16px] font-PlusJakartaSansBold text-[#787A80]">
                    pay
                  </Text>
                  <Text className="text-[28px] font-PlusJakartaSansBold text-white mb-6">
                    $5.00
                  </Text>
                </View>

                <AppButton.Primary
                  color="#FF6D1B"
                  text="Pay Now"
                  loading={false}
                  onPress={payNow}
                />

              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <Paystack
            paystackKey="pk_test_e33557a82d21529a1933a0e04200c28edd269b7e"
            billingEmail={userdata?.email as string}
            amount={"5"} // Amount in kobo (₦5000.00)
            billingName={userdata?.username || ''}
            channels={['card', 'bank', 'ussd',]}
            currency="NGN"
            onCancel={handlePaystackCancel}
            onSuccess={handlePaystackSuccess}
            ref={paystackWebViewRef}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
