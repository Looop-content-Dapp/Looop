import React from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const ConnectProfile = () => {
  const { width, height } = useWindowDimensions();

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
      alignItems: "center",
      paddingHorizontal: width * 0.05,
    },
    title: {
      fontSize: width * 0.06,
      fontFamily: "PlusJakartaSans-Medium",
      color: "#f4f4f4",
      textAlign: "center",
    },
    subtitle: {
      fontSize: width * 0.04,
      color: "#D2D3D5",
      fontFamily: "PlusJakartaSans-Regular",
      textAlign: "center",
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
    },
    buttonText: {
      color: "#fff",
      fontSize: width * 0.045,
      fontFamily: "PlusJakartaSans-Bold",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/logo-gray.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Connect your artiste profile</Text>
        <Text style={styles.subtitle}>
          To get started with Creator mode, you need to already have your music
          uploaded on Looop through a distributor. All you need is a link to
          your profile/catalog from your distributor platform
        </Text>
      </View>

      <Text style={styles.linkText}>
        Don't have music up yet?{" "}
        <Text style={styles.purpleText}>See supported distributors here</Text>
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Paste your profile link here</Text>
        <TextInput
          placeholder=""
          placeholderTextColor="#787A80"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push("/(artisteTabs)/(dashboard)")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Start creating</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConnectProfile;
