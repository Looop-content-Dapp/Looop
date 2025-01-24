import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import UnderReview from "@/components/CreatorOnboarding/UnderReview";
import Welcome from "@/components/CreatorOnboarding/Welcome";
import { Text } from "react-native";
import api from "@/config/apiConfig";
import { ClaimStatus } from "@/types/index";
import Celebration from "@/assets/svg/Celebration";
import { useAppSelector } from "@/redux/hooks";

const LoadingScreen = () => (
    <View style={{
      flex: 1,
      backgroundColor: "#040405",
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      paddingBottom: 64,
      paddingLeft: 49
    }}>
      <Text className="text-[40px] text-[#fff] font-PlusJakartaSansBold">Looop</Text>
      <Text className="text-[40px] text-[#fff] font-PlusJakartaSansBold">For Creators</Text>
    </View>
  );

const CreatorModeWelcome = () => {
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("NOT_SUBMITTED");
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { width, height } = useWindowDimensions();
  const { claimId } = useAppSelector((state) => state.auth);
  const { push } = useRouter();

  const checkArtistClaimStatus = async () => {
    if (!claimId){
        setClaimStatus("NOT_SUBMITTED")
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/api/artistclaim/status/${claimId}`);
      console.log(response.data)
      setClaimStatus(response.data.data.status);
    } catch (error) {
      console.error("Error checking claim status:", error);
      setClaimStatus("NOT_SUBMITTED");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkArtistClaimStatus();
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen if either the data is loading or we're within the minimum display time
  if (isLoading || showLoadingScreen) {
    return <LoadingScreen />;
  }

  const handleNext = async () => {
    if (isSubmitting) return;

    switch (claimStatus) {
      case "NOT_SUBMITTED":
      case "rejected":
        push({
          pathname: "/creatorOnboarding/createProfile",
          params: { flow: claimStatus }
        });
        break;
      case "approved":
        push({
          pathname: "/creatorOnboarding/ContractSigning",
          params: { flow: claimStatus }
        });
        break;
      case "pending":
        setIsLoading(true);
        await checkArtistClaimStatus();
        break;
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
    disabledButton: {
      opacity: 0.6,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    congratsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      marginTop: '20%',
    },
    congratsTitle: {
      fontSize: 24,
      color: '#F4F4F4',
      textAlign: 'center',
      marginBottom: 16,
      fontFamily: "PlusJakartaSans-Bold",
    },
    congratsText: {
      fontSize: 16,
      color: '#D2D3D5',
      textAlign: 'center',
      fontFamily: "PlusJakartaSans-Regular",
    },
  });

  const getButtonText = () => {
    switch (claimStatus) {
      case "NOT_SUBMITTED":
        return "Get Started";
      case "pending":
        return "Check Status";
      case "approved":
        return "Continue to Contract";
      case "rejected":
        return "Try Again";
      default:
        return "Continue";
    }
  };

  const renderContent = () => {
    switch (claimStatus) {
      case "NOT_SUBMITTED":
      case "rejected":
        return <Welcome />;
      case "pending":
        return <UnderReview />;
      case "approved":
        return (
          <View style={styles.congratsContainer}>
             <Celebration />
            <Text style={styles.congratsTitle}>
              Congratulations!
            </Text>
            <Text style={styles.congratsText}>
              Your creator profile has been approved. Continue to review and sign your contract.
            </Text>
          </View>
        );
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
      {renderContent()}

      <TouchableOpacity
        onPress={handleNext}
        style={[
          styles.button,
          (isSubmitting || (claimStatus === "pending" && !isLoading)) && styles.disabledButton
        ]}
        disabled={isSubmitting || (claimStatus === "pending" && !isLoading)}
      >
        <View style={styles.buttonContent}>
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#0a0b0f" />
              <Text style={styles.buttonText}>Processing...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreatorModeWelcome;
