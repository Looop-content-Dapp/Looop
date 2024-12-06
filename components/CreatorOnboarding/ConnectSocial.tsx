import { View, Text, TextInput, TouchableOpacity, useWindowDimensions, StyleSheet, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { router, useNavigation } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";

type Props ={
    setCurrentFlow: React.Dispatch<React.SetStateAction<string>>
}

const ConnectSocial = ({setCurrentFlow}: Props) => {
    const { width, height } = useWindowDimensions();

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

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          minHeight: "100%",
          backgroundColor: "#000", // Assuming a dark theme
        },
        logo: {
          width: width * 0.18,
          height: width * 0.08,
          maxWidth: 72,
          maxHeight: 32,
          alignSelf: "center",
          marginTop: height * 0.08,
        },
        headerContainer: {
          gap: height * 0.015,
          marginVertical: height * 0.04,
          paddingHorizontal: width * 0.05,
        },
        title: {
          fontSize: 24,
          fontFamily: "PlusJakartaSans-Medium",
          color: "#f4f4f4",
        },
        subtitle: {
          fontSize: width * 0.04,
          color: "#D2D3D5",
          fontFamily: "PlusJakartaSans-Regular",
        },
        linkText: {
          fontSize: width * 0.04,
          fontFamily: "PlusJakartaSans-Medium",
          color: "#f4f4f4",
          textAlign: "center",
        },
        purpleText: {
          color: "#A187B5",
        },
        inputContainer: {
          gap: height * 0.015,
          marginVertical: height * 0.04,
          paddingHorizontal: width * 0.06,
        },
        inputLabel: {
          fontSize: width * 0.04,
          fontFamily: "PlusJakartaSans-Medium",
          color: "#f4f4f4",
        },
        input: {
          borderWidth: 2,
          borderColor: "#12141B",
          width: "100%",
          height: height * 0.08,
          borderRadius: 56,
          paddingHorizontal: width * 0.04,
          color: "#f4f4f4",
        },
        button: {
          backgroundColor: "#A187B5",
          alignItems: "center",
          marginTop: height * 0.06,
          marginHorizontal: width * 0.05,
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
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Create your artiste profile</Text>
            <Text style={styles.subtitle}>
            In order to give creators a thriving environment to share their art, we need to ensure that only creators have access to creator profiles, as such, we need to manually confirm that you’re a music artiste or creator by confirming through your social media profiles.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your main social profile link</Text>
            <TextInput
              placeholder="Ex: https://x.com/looop_music"
              placeholderTextColor="#787A80"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
        onPress={() => setCurrentFlow("UNDER REVIEW")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
        </View>
      );
    };

export default ConnectSocial
