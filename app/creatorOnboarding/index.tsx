import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import UnderReview from "@/components/CreatorOnboarding/UnderReview";
import Welcome from "@/components/CreatorOnboarding/Welcome";
import ConnectSocial from "@/components/CreatorOnboarding/ConnectSocial";
import { Text } from "react-native";

export type CreatorFlowState =
  | "WELCOME"
  | "NOT_SUBMITTED"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "CREATE_PROFILE"
  | "PROFILE_SUCCESSFUL"
  | "CONTRACT_PENDING"
  | "CONTRACT_SIGNED";

const CreatorModeWelcome = () => {
  const [currentFlow, setCurrentFlow] = useState<CreatorFlowState>("WELCOME");
  const { width, height } = useWindowDimensions();
  const { push } = useRouter();

  const handleNext = () => {
    switch (currentFlow) {
      case "WELCOME":
        setCurrentFlow("NOT_SUBMITTED");
        break;
      case "NOT_SUBMITTED":
        setCurrentFlow("UNDER_REVIEW");
        break;
      case "UNDER_REVIEW":
        push("/creatorOnboarding/createProfile");
        break;
      case "REVIEWED":
        push("/creatorOnboarding/ContractSigning");
        break;
      default:
        setCurrentFlow("WELCOME");
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#040405",
    },
    button: {
      backgroundColor: "#A187B5",
      alignItems: "center",
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
      case "NOT_SUBMITTED":
        return <ConnectSocial setCurrentFlow={setCurrentFlow} />;
      case "UNDER_REVIEW":
        return <UnderReview />;
      default:
        return <Welcome />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={"#040405"}
        translucent={true}
        barStyle="light-content"
      />
      {handleFlow()}

      {currentFlow !== "NOT_SUBMITTED" && (
        <TouchableOpacity
          onPress={handleNext}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {currentFlow === "WELCOME" ? "Start creating" : "Continue"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default CreatorModeWelcome;
