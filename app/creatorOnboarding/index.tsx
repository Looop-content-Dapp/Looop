import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import UnderReview from "@/components/CreatorOnboarding/UnderReview";
import Welcome from "@/components/CreatorOnboarding/Welcome";
import { Text } from "react-native";
import api from "@/config/apiConfig";
import { ClaimStatus } from "@/types/index";
import Celebration from "@/assets/svg/Celebration";
import { useAppSelector } from "@/redux/hooks";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LoadingScreen = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#040405",
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      paddingBottom: insets.bottom + 64,
      paddingLeft: width * 0.12
    }}>
      <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">Looop</Text>
      <Text className="text-[20px] font-PlusJakartaSansBold text-[#f4f4f4]">For Creators</Text>
    </View>
  );
}

const CreatorModeWelcome = () => {
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("NOT_SUBMITTED");
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);  
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { claimId } = useAppSelector((state) => state.auth);
  const { push } = useRouter();
  console.log("claimId: ", claimId)

  const checkArtistClaimStatus = async () => {
    if (!claimId){
        setClaimStatus("NOT_SUBMITTED")
        setIsLoading(false);
        return;
    }
    try {
      setIsLoading(true);
      const response = await api.get(`/api/artistclaim/status/${claimId}`);
      setClaimStatus(response.data.data.status);
    } catch (error) {
      console.error("Error checking claim status:", error);
      setClaimStatus("NOT_SUBMITTED");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Refresh on screen focus
  useFocusEffect(
    React.useCallback(() => {
      checkArtistClaimStatus();
    }, [claimId])
  );

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
    scrollContent: {
      flexGrow: 1,
      paddingBottom: Platform.select({ ios: 100, android: 120 }),
    },
    button: {
      backgroundColor: "#A187B5",
      alignItems: "center",
      marginHorizontal: width * 0.05,
      paddingVertical: Platform.select({ ios: height * 0.02, android: height * 0.018 }),
      borderRadius: 56,
      position: "absolute",
      bottom: (insets?.bottom || 0) + (Platform.select({ ios: 20, android: 30 }) || 20),
      right: 0,
      left: 0,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    buttonText: {
      color: "#0a0b0f",
      fontSize: Platform.select({
        ios: width * 0.045,
        android: width * 0.04,
        default: Math.min(width * 0.035, 24),
      }),
      fontFamily: "PlusJakartaSans-Bold",
    },
    loadingText: {
      fontSize: Platform.select({
        ios: 40,
        android: 36,
        default: Math.min(width * 0.06, 48),
      }),
      color: "#fff",
      fontFamily: "PlusJakartaSansBold",
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
      padding: width * 0.04,
      marginTop: height * 0.15,
    },
    congratsTitle: {
      fontSize: Platform.select({
        ios: 24,
        android: 22,
        default: Math.min(width * 0.04, 32),
      }),
      color: '#F4F4F4',
      textAlign: 'center',
      marginBottom: 16,
      fontFamily: "PlusJakartaSans-Bold",
    },
    congratsText: {
      fontSize: Platform.select({
        ios: 16,
        android: 14,
        default: Math.min(width * 0.025, 20),
      }),
      color: '#D2D3D5',
      textAlign: 'center',
      fontFamily: "PlusJakartaSans-Regular",
      paddingHorizontal: width * 0.05,
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

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
