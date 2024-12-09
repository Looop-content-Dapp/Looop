import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  Alert,
} from "react-native";
import { router } from "expo-router";
import UnderReview from "@/components/CreatorOnboarding/UnderReview";
import Welcome from "@/components/CreatorOnboarding/Welcome";
import ContractSigning from "@/components/CreatorOnboarding/ContractSigning";
import ConnectSocial from "@/components/CreatorOnboarding/ConnectSocial";

const CreatorModeWelcome = () => {
  const creatorFlow = ["WELCOME", "NOT SUBMITTED", "UNDER REVIEW", "REVIWED", "CONTRACT PENDING", "CONTRACT SIGNED"];
  const { width, height } = useWindowDimensions();
  const [currentFlow, setCurrentFlow] = useState(creatorFlow[0]);

  const handleNext = () => {
    switch (currentFlow) {
      case "WELCOME":
        setCurrentFlow("NOT SUBMITTED");
        break;
      case "NOT SUBMITTED":
        setCurrentFlow("UNDER REVIEW");
        break;
      case "UNDER REVIEW":
        setCurrentFlow("CONTRACT PENDING");
        break;
      case "CONTRACT PENDING":
        setCurrentFlow("CONTRACT SIGNED");
        Alert.alert("Contract Signed!", "Thank you for signing the contract.", [
          { text: "OK", onPress: () => console.log("Contract signed successfully") }
        ]);
        break;
      default:
        setCurrentFlow("WELCOME");
    }
  };

  const handlePrev = () => {
    const currentIndex = creatorFlow.indexOf(currentFlow);
    if (currentIndex > 0) {
      setCurrentFlow(creatorFlow[currentIndex - 1]);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    //   marginTop: height * 0.06,
      marginHorizontal: width * 0.05,
      paddingVertical: height * 0.02,
      borderRadius: 56,
      position: "absolute",
      bottom: 50,
      right: 0,
      left: 0
    },
    buttonText: {
      color: "#0a0b0f",
      fontSize: width * 0.045,
      fontFamily: "PlusJakartaSans-Bold",
    },
  });

  const handleFlow = () => {
    switch (currentFlow) {
      case "WELCOME":
        return <Welcome />;
      case "NOT SUBMITTED":
        return <ConnectSocial setCurrentFlow={setCurrentFlow} />;
      case "UNDER REVIEW":
        return <UnderReview />;
      case "CONTRACT PENDING":
        return <ContractSigning />;
      default:
        return <Welcome />;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={"#040405"}
          translucent={true}
          barStyle="light-content"
        />
        {handleFlow()}

        {currentFlow !== "NOT SUBMITTED" && currentFlow !== "CONTRACT PENDING" && (
             <TouchableOpacity
             onPress={handleNext}
             style={styles.button}
           >
             <Text style={styles.buttonText}>Start creating</Text>
           </TouchableOpacity>
        )}

      </SafeAreaView>
    </>
  );
};

export default CreatorModeWelcome;



/**
 *
 */
