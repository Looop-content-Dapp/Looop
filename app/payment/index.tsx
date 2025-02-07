import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import { AppButton } from "@/components/app-components/button";
import { Money02Icon } from "@hugeicons/react-native";
import { useAppSelector } from "@/redux/hooks";
import Payaza, {
  type IPayaza,
  type PayazaErrorResponse,
  type PayazaSuccessResponse,
  PayazaConnectionMode,
} from "react-native-payaza";
import api from "@/config/apiConfig";
import { getPathWithConventionsCollapsed } from "expo-router/build/fork/getPathFromState-forks";
import LoadingScreen from "../loadingScreen";

const Index = () => {
  const { name, image, communityAddress, communityId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);
  const [loader, setLoader] = useState<boolean>(false);

  const payaza = React.useRef<IPayaza>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton name="Join Tribe" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  const payNow = () => {
    payaza.current?.createTransaction({
      amount: Number(2),
      connectionMode: PayazaConnectionMode.TEST_CONNECTION_MODE,
      email: userdata?.email as string,
      firstName: userdata?.username as string,
      lastName: "<last name>",
      phoneNumber: userdata?.tel as string,
      currencyCode: "USD",
      transactionReference: "transaction_reference",
    });
  };

  const handleError = (response: PayazaErrorResponse) => {
    Alert.alert(response.data.message, "Error Occurred");
  };

  const handleSuccess = async (response: any) => {
    setLoader(true);
    try {
      const { transactionReference } = response.data;
      const payload = {
        type: "xion",
        userId: userdata?._id,
        communityId: communityId,
        collectionAddress: communityAddress,
        userAddress: userdata?.wallets?.xion,
        transactionReference: transactionReference,
      };

      const res = await api.post("/api/community/joincommunity", payload);
      if (res) {
        Alert.alert(
          "Payment Successful",
          `Transaction reference: ${res.data?.message}`
        );
        setLoader(false);
        setIsModalVisible(false);
        router.push({
          pathname: "/payment/success",
          params: {
            name: name,
            image: image,
            reference: transactionReference,
          },
        });
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  return (
    <>
      <View className="flex-1 bg-[#0A0B0F]">
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
                Mint an NFT of your favorite artist to gain exclusive access to
                their Tribe. This NFT serves as your key pass to connect with
                fans, join conversations, and unlock unique experiences.
              </Text>
            </View>

            <View className="px-[8px] pt-[8px] pb-[32px] aspect-[3/4] border-[0.5px] border-[#787A80] bg-[#0A0B0F] gap-y-[16px] rounded-[32px] shadow-lg">
              <Image
                source={{ uri: image as string }}
                className="w-full h-[70%] rounded-[24px]"
                style={{ resizeMode: "cover" }}
              />
              <View className="flex-row items-end px-[16px]">
                <View className="flex-1 gap-y-[8px]">
                  <Text className="text-[28px] text-[#FAFBFB] font-PlusJakartaSansBold">
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
                  className="bg-[#040405] h-[45%] rounded-t-[32px] p-6"
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
                    loading={loader}
                    disabled={loader}
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
                    <AppButton.Primary
                      color={"#FFFFFF"}
                      text="Pay wisth Cash"
                      loading={loader}
                      disabled={loader}
                      icon={
                        <Money02Icon size={24} color="black" variant="solid" />
                      }
                      onPress={payNow}
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
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
