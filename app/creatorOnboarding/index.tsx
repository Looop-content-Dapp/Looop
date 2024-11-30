import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { router } from "expo-router";

const CreatorModeWelcome = () => {
  const { width, height } = useWindowDimensions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: "#000",
    },
    headerContainer: {
      alignItems: "center",
      marginTop: "20%",
    },
    image: {
      height: width * 0.45,
      width: width * 0.45,
      maxWidth: 183,
      maxHeight: 183,
    },
    title: {
      fontSize: width * 0.06,
      color: "#D2D3D5",
      textAlign: "center",
      fontFamily: "PlusJakartaSans-Bold",
      marginTop: height * 0.02,
    },
    purpleText: {
      color: "#A187B5",
    },
    infoContainer: {
      backgroundColor: "#12141B",
      padding: width * 0.08,
      marginHorizontal: width * 0.05,
      marginTop: height * 0.04,
      borderRadius: 10,
    },
    infoTitle: {
      fontSize: width * 0.05,
      fontFamily: "PlusJakartaSans-Bold",
      color: "#787A80",
      marginBottom: height * 0.02,
    },
    infoText: {
      fontSize: width * 0.04,
      fontFamily: "PlusJakartaSans-Regular",
      color: "#fff",
      marginBottom: height * 0.015,
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
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={"#040405"}
          translucent={true}
          barStyle="light-content"
        />
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/images/creatormode.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            Welcome to{"\n"}
            <Text style={styles.purpleText}>Creator mode</Text>
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>What you can do</Text>
          <Text style={styles.infoText}>Upload and manage your music</Text>
          <Text style={styles.infoText}>
            Build and connect with your fanbase
          </Text>
          <Text style={styles.infoText}>Interact with your community</Text>
          <Text style={styles.infoText}>Create your own collectibles</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/creatorOnboarding/connectProfile")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Start creating</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

export default CreatorModeWelcome;
