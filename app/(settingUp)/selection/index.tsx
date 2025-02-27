import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import {
  ArrowRight02Icon,
  HeadphonesIcon,
  UserGroupIcon,
  ArrowLeft02Icon,
} from "@hugeicons/react-native";
import { AppButton } from "@/components/app-components/button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Selection = () => {
    const navigation = useNavigation();
    const router = useRouter();
    useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: () => (
          <Text className="text-[20px] text-center text-[#f4f4f4] leading-[30px] font-PlusJakartaSansBold">
            What do you listen to?
          </Text>
        ),
        headerBackTitleVisible: true,
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft02Icon size={24} color="white" />
          </TouchableOpacity>
        ),
      });
    }, [navigation]);
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-[20px] text-center text-[#f4f4f4] leading-[30px] font-PlusJakartaSansBold">
        Selection</Text>
    </View>
  )
}

export default Selection