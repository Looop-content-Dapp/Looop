import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import UnderReview from "@/components/CreatorOnboarding/UnderReview";
import Welcome from "@/components/CreatorOnboarding/Welcome";
import ConnectSocial from "@/components/CreatorOnboarding/ConnectSocial";
import { Text } from "react-native";
import api from "@/config/apiConfig";

export type CreatorFlowState =
  | "WELCOME"
  | "REVIEWED"
  | "CREATE_PROFILE"
  | "PROFILE_SUCCESSFUL"
  | "CONTRACT_PENDING"
  | "CONTRACT_SIGNED";

const CreatorModeWelcome = () => {
  const [currentFlow, setCurrentFlow] = useState("NOT_SUBMITTED");
  const { width, height } = useWindowDimensions();
  const { navigate,  } = useRouter();

  const checkArtistClaimStatus = async() => {
    //6789049be992488c1469306e
    try {
        const response  = await api.get("/api/artistclaim/status/")
        setCurrentFlow(response.data.data.status)
    } catch (error) {
     console.log("error checking status", error)
     setCurrentFlow("NOT_SUBMITTED")
    }
   }
  useEffect(() => {

   checkArtistClaimStatus()
  }, [currentFlow])

  const handleNext = () => {
    switch (currentFlow) {
      case "NOT_SUBMITTED":
        navigate({
            pathname: "/creatorOnboarding/createProfile",
            params: {
                flow: currentFlow
            }
        })
        break;
      case "approved":
        navigate({
            pathname: "/creatorOnboarding/ContractSigning",
            params: {
                flow: currentFlow
            }
        });
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
      case "NOT_SUBMITTED":
        return <Welcome />;
       case "pending":
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

      <TouchableOpacity
          onPress={handleNext}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {"Continue"}
          </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreatorModeWelcome;
