import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import ConnectSocial from "@/components/CreatorOnboarding/ConnectSocial";

const ConnectProfile = () => {
  const { width, height } = useWindowDimensions();
  const [currentFlow, setCurrentFlow]= useState("link");

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
       <View className="flex-row items-center gap-x-[120px]">
        <AppBackButton name="" onBackPress={() => router.back()} />
        <Image
         source={require("../../assets/images/logo-gray.png")}
         //   style={styles.logo}
      resizeMode="cover"
    />
       </View>
      ),
    });
  }, [navigation]);

  const handleFlow = () => {
    switch (currentFlow) {
        case "link":
          return <ConnectSocial />
        default:
            return <ConnectSocial />
      }
  }



  const styles = StyleSheet.create({
    button: {
      backgroundColor: "#A187B5",
      alignItems: "center",
      paddingVertical: height * 0.02,
      borderRadius: 56,
      position: "absolute",
      bottom: 150,
      right: 0,
      left: 0
    },
    buttonText: {
      color: "#0a0b0f",
      fontSize: width * 0.045,
      fontFamily: "PlusJakartaSans-Bold",
    },
  });

  return (
    <View className="flex-1 min-h-screen">
        {handleFlow()}
      <TouchableOpacity
        onPress={() => router.push("/(artisteTabs)/(dashboard)")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Start creating</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConnectProfile;
