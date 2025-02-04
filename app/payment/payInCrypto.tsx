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
  import FilterButton from "@/components/app-components/FilterButton";
import ChainPicker from "@/components/app-components/ChainPicker";
  
  const payInCrypto = () => {
    const {name, image} = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const [isModalVisible, setIsModalVisible] = useState(false);


    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => <AppBackButton name="Crypto Payment" onBackPress={() => router.back()} />
      });
    }, [navigation]);

    const showTestModeAlert = () => {
      Alert.alert(
        "Test Mode",
        "This is a test version of crypto payments. Real transactions are not enabled in this build.",
        [{ text: "OK", onPress: () => setIsModalVisible(true) }]
      );
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
            text="Continue (Test Mode)" 
            loading={false} 
            onPress={showTestModeAlert}
          />
        </View>
      </View>
    );
  };
  
  export default payInCrypto;