import { View, Text, Image, TouchableOpacity, Modal, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import { AppButton } from "@/components/app-components/button";
import { AppleIcon, CreditCardPosIcon } from "@hugeicons/react-native";
import { usePayment } from "@/hooks/useFlutterwavePayment";
import { PayWithFlutterwave } from "flutterwave-react-native";
import { useAppSelector } from "@/redux/hooks";

import Payaza, {
  type IPayaza,
  type PayazaErrorResponse,
  type PayazaSuccessResponse,
  PayazaConnectionMode,
} from "react-native-payaza";

const Index = () => {
  const { name, image } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);

  const payaza = React.useRef<IPayaza>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton name="Join Tribe" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);
  const { initializeFlutterwavePayment, initializeApplePay } = usePayment();

  const handlePaymentComplete = (data: any) => {
    // Close the modal first
    setIsModalVisible(false);

    if (!data) {
      console.log("No payment data received");
      return;
    }

    switch (data.status?.toLowerCase()) {
      case "successful":
        // Navigate to success page with required params
        router.push({
          pathname: "/payment/MintingSuccess",
          params: {
            name: name,
            image: image,
          },
        });
        break;
      case "cancelled":
      case "failed":
      case "closed":
        console.log("Payment was cancelled or closed");
        break;
      default:
        console.log("Payment status:", data.status || "unknown");
        break;
    }
  };

  const { paymentOptions, handleOnRedirect } = initializeFlutterwavePayment({
    amount: 2,
    customerEmail: userdata?.email as string,
    customerName: name as string,
    customerId: userdata?._id as string,
    txRef: `TX-${Date.now()}`,
  });

  const payNow = () => {
    payaza.current?.createTransaction({
      amount: Number(110),
      connectionMode: PayazaConnectionMode.TEST_CONNECTION_MODE,
      email: "example@example.com",
      firstName: "<first name>",
      lastName: "<last name>",
      phoneNumber: "<+12345678900>",
      currencyCode: "NGN",
      transactionReference: "transaction_reference",
    });
  };
  const handleError = (response: PayazaErrorResponse) => {
    Alert.alert(response.data.message, "Error Occurred");
  };
  const handleSuccess = (response: PayazaSuccessResponse) => {
    Alert.alert(
      response.data.message,
      `Transaction reference {$response.data.payaza_reference}`
    );
  };

  // Update the PayWithFlutterwave component
  return (
    <View className="flex-1 px-[24px] gap-y-[24px]">
      <View className="mt-[24px] gap-y-[16px] items-start">
        <Text className="text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]">
          Mint your Tribe Pass
        </Text>
        <Text className="text-[16px] font-PlusJakartaSansMedium text-[#D2D3D5]">
          Mint an NFT of your favorite artist to gain exclusive access to their
          Tribe. This NFT serves as your key pass to connect with fans, join
          conversations, and unlock unique experiences.
        </Text>
      </View>

      <View className="px-[8px] pt-[8px] pb-[32px] h-[60%] border-[0.5px] border-[#787A80] bg-[#0A0B0F] gap-y-[16px] rounded-[32px]">
        <Image
          source={{ uri: image as string }}
          className="w-full h-[80%] rounded-[24px]"
          style={{ resizeMode: "cover" }}
        />
        <View className="flex-row items-end px-[16px]">
          <View className="flex-1 gap-y-[8px]">
            <Text className="text-[24px] text-[#FAFBFB] font-PlusJakartaSansBold">
              {name as string}
            </Text>
            <View className="flex-row items-center w-[93px] bg-[#A187B5] py-[8px] rounded-[56px] px-[12px]">
              <Text className="text-[#0A0B0F] text-[14px] font-PlusJakartaSansBold">
                $2/month
              </Text>
            </View>
          </View>
          <Image
            source={require("../../assets/images/logo-gray.png")}
            className="w-[49px] h-[22px]"
            style={{ resizeMode: "cover" }}
          />
        </View>
      </View>

      <AppButton.Primary
        color="#FF6D1B"
        text="Continue"
        loading={false}
        onPress={() => setIsModalVisible(true)}
      />

      <TouchableOpacity onPress={payNow}>
        <Text style={{ color: "white" }}>Pay Now</Text>
      </TouchableOpacity>

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
            className="bg-[#040405] h-[60%] rounded-t-[32px] p-6"
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
                $2.00
              </Text>
            </View>

            <AppButton.Primary
              color="#FF6D1B"
              text="Pay with USDC"
              loading={false}
              icon={
                <Image
                  source={require("../../assets/images/usdc-icon.png")}
                  className="w-5 h-5"
                />
              }
              onPress={() => {
                setIsModalVisible(false);
                router.push({
                  pathname: "/payment/payInCrypto",
                  params: {
                    name: name,
                    image: image,
                    price: 2,
                  },
                });
              }}
            />

            <Text className="text-gray-500 text-center my-4">Or</Text>
            <View className="w-full gap-y-[32px]">
              {/* <PayWithFlutterwave
       onRedirect={handlePaymentComplete}
   options={{
    ...PaymentRequest,
    amount: 2,
    authorization: process.env.EXPO_PUBLIC_FLUTTERWAVE_PUBLIC_KEY as string,
    tx_ref: `TX-${Date.now()}`,
    customer: {
      email: userdata?.email as string,
      name: name as string,
    }
  }}
  onAbort={() => {
    console.log("Payment aborted");
    setIsModalVisible(false);
  }}
  customButton={(props) => (
    <AppButton.Primary
      color="#FFFFFF"
      text="Pay using Apple pay"
      loading={false}
      icon={<AppleIcon size={24} color="black" variant="solid" />}
      onPress={props.onPress}
      disabled={props.disabled}
    />
  )}
/> */}

              <AppButton.Primary
                color="#FFFFFF"
                text="Pay with Credit/Debit Card"
                loading={false}
                icon={
                  <CreditCardPosIcon size={24} color="black" variant="solid" />
                }
                onPress={() => {
                  setIsModalVisible(false);
                  router.navigate("/payment/payWithCard");
                }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Payaza
        onSuccess={handleSuccess}
        onError={handleError}
        onClose={console.log}
        merchantKey="PZ78-PKTEST-FF00C2E4-3339-4D9A-93AF-1CD4F3A834DC"
        ref={payaza}
      />
    </View>
  );
};

export default Index;
