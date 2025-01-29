import {
    View,
    Text,
    Image,
    ScrollView,
  } from "react-native";
  import React, { useLayoutEffect, useState } from "react";
  import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
  import { AppBackButton } from "@/components/app-components/back-btn";
  import { AppButton } from "@/components/app-components/button";
  import FilterButton from "@/components/app-components/FilterButton";
  
  const payInCrypto = () => {
    const {name, image} = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('Xion');
    const networkOptions = ['Xion', 'Starknet'];

    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => <AppBackButton name="Crypto Payment" onBackPress={() => router.back()} />
      });
    }, [navigation]);

    const networkIcon = (
      <Image 
        source={selectedNetwork === 'Xion' 
          ? require("../../assets/images/xion.png")
          : require("../../assets/images/starknet.png")
        } 
        className="w-5 h-5" 
      />
    );

    return (
      <View className="flex-1">
        <ScrollView className="flex-1 px-[24px]" showsVerticalScrollIndicator={false}>
          <View className="mt-[24px] gap-y-[16px]">
            <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">Mint Tribe pass</Text>

            <View className="bg-[#0A0B0F] border border-[#1B1E26] px-[8px] py-[11px] rounded-[16px]">
              <View className="flex-row items-center bg-[#12141B] justify-between rounded-[14px] pl-[21px] pr-[12px] py-[11px]">
                <View className="flex-row items-center gap-x-[8px]">
                  <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">2</Text>
                  <Image source={require("../../assets/images/usdc-icon.png")} className="w-5 h-5" />
                  <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">USDC</Text>
                </View>
                <FilterButton
                  options={networkOptions}
                  selectedOption={selectedNetwork}
                  onOptionSelect={setSelectedNetwork}
                  icon={networkIcon}
                />
              </View>
              <View className="flex-row items-center px-[16px] gap-x-[16px] py-[8px] border-t-[0.5px] border-[#2A2C32]">
                <View className="flex-row items-center">
                  <Image source={require("../../assets/images/xion.png")} className="w-4 h-4 mr-[4px]" />
                  <Text className="text-[14px] text-[#A5A6AA]">32.998 USDC</Text>
                </View>
                <View className="flex-row items-center">
                  <Image source={require("../../assets/images/starknet.png")} className="w-4 h-4 mr-[4px]" />
                  <Text className="text-[14px] text-[#A5A6AA]">32.998 USDC</Text>
                </View>
              </View>
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
            text="Continue" 
            loading={false} 
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      </View>
    );
  };
  
  export default payInCrypto;