import { View, Text, TouchableOpacity, Image, SafeAreaView, Alert } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { AppBackButton } from "@/components/app-components/back-btn";
import { Copy01Icon } from "@hugeicons/react-native";
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';

const StablecoinFundingScreen = () => {
  const navigation = useNavigation();
  const { chain, address } = useLocalSearchParams<{ chain: string; address: string }>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Fund your account instantly" onBackPress={() => router.back()} />,
    });
  }, [navigation]);

  const handleCopyAddress = async () => {
    await Clipboard.setStringAsync(address);
    Alert.alert("Success", "Address copied to clipboard");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#040405]">
      <View className="px-6">
        <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium mt-4">
          Send USDC to this address to add funds to your USD balance
        </Text>

        {/* Warning Box */}
        <View className="bg-[#FF6D1B20] p-4 rounded-[10px] mt-6">
          <Text className="text-[16px] font-PlusJakartaSansBold text-[#FF6D1B] mb-2">
            PAYMENT INSTRUCTION
          </Text>
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#FF6D1B]">
            Only send USDC on the {chain} network to this address. Your deposit will appear in your account within minutes.
          </Text>
        </View>

        {/* QR Code */}
        <View className="items-center justify-center mt-8 p-6 rounded-[10px]">
          <QRCode
            value={address}
            size={200}
          />
        </View>

        {/* Network and Address Details */}
        <View className="mt-8 gap-y-[16px]">
          <View>
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              Network
            </Text>
            <Text className="text-[16px] text-white font-PlusJakartaSansBold mt-1">
              {chain}
            </Text>
          </View>

          <View className="">
            <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
              USDC Address
            </Text>
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-[16px] text-white font-PlusJakartaSansBold flex-1 mr-2">
                {address}
              </Text>
              <TouchableOpacity onPress={handleCopyAddress}>
                <Copy01Icon size={24} color="#FF6D1B" variant="solid" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Share Address Button */}
        <TouchableOpacity
          className="bg-[#111318] py-4 rounded-[10px] mt-8"
          onPress={() => {
            // Implement share functionality
          }}
        >
          <Text className="text-[#FF6D1B] text-center text-[16px] font-PlusJakartaSansBold">
            Share address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default StablecoinFundingScreen;
