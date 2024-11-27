import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppleIcon, CreditCardPosIcon } from "@hugeicons/react-native";
import { ExclusiveIcon, InteractionIcon, PriorityIcon } from "../../utils/icon";
import TransactionSuccess from "./TransactionSucess";

// Main Payment Bottom Sheet Component
const PaymentBottomSheet = ({
  isVisible,
  closeSheet,
  communityData,
  onPaymentComplete,
}) => {
  const bottomSheetRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(isVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    setIsSheetVisible(isVisible);
    if (!isVisible) {
      setShowSuccess(false);
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        setIsSheetVisible(false);
        setTimeout(() => {
          closeSheet();
          setShowSuccess(false);
        }, 100);
      }
    },
    [closeSheet]
  );

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setIsSheetVisible(false);
      closeSheet();
      setShowSuccess(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 200);
  }, [closeSheet, onPaymentComplete]);

  if (!isSheetVisible) {
    return null;
  }

  const handlePaymentComplete = async (paymentMethod) => {
    try {
      setIsLoading(true);
      setActiveButton(paymentMethod);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowSuccess(true);
      // await onPaymentComplete();
    } catch (error) {
      console.error("Payment error:", error);
      // Handle payment error here
    }
  };

  if (!isSheetVisible) {
    return null;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isSheetVisible ? 0 : -1}
      snapPoints={showSuccess ? ["100%"] : ["85%"]}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "#040405" }}
      handleIndicatorStyle={{
        backgroundColor: "#787A80",
        width: 80,
        height: 4,
        borderRadius: 10,
      }}
    >
      <BottomSheetView style={styles.container}>
        {showSuccess ? (
          <TransactionSuccess
            communityName={communityData?.name}
            tribePass={communityData?.tribePass}
            onClose={handleClose}
          />
        ) : (
          <>
            <Text style={styles.paymentTitle}>Mint Community Pass</Text>

            <View style={styles.benefitsSection}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <ExclusiveIcon size={24} color="#0000FF" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitHeader}>
                    Exclusive Content Access
                  </Text>
                  <Text style={styles.benefitDesc}>
                    Get early access to unreleased tracks, behind-the-scenes
                    content, and exclusive merchandise
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <PriorityIcon size={24} color="#FF0000" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitHeader}>Priority Access</Text>
                  <Text style={styles.benefitDesc}>
                    Be first in line for concert tickets, unique sales, and
                    special events
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <InteractionIcon size={24} color="#00FF00" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitHeader}>
                    Direct Artist Interaction
                  </Text>
                  <Text style={styles.benefitDesc}>
                    Participate in exclusive Q&As, virtual meetups, and
                    community events
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.paymentSection}>
              <Text style={styles.amountText}>
                $ {communityData?.price || 2}.00
              </Text>
              <Text style={styles.minimumText}>Monthly Subscription</Text>

              <TouchableOpacity
                style={[styles.paymentButton, styles.applePayButton]}
                onPress={() => handlePaymentComplete("apple")}
                disabled={isLoading}
              >
                {isLoading && activeButton === "apple" ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <AppleIcon size={24} color="#040405" variant="solid" />
                    <Text style={styles.applePayText}>Pay with Apple Pay</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentButton, styles.creditCardButton]}
                onPress={() => handlePaymentComplete("card")}
                disabled={isLoading}
              >
                {isLoading && activeButton === "card" ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <CreditCardPosIcon
                      size={24}
                      color="#f4f4f4"
                      variant="solid"
                    />
                    <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[14px]">
                      Pay with Credit Card
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentButton, styles.starknetButton]}
                onPress={() => handlePaymentComplete("starknet")}
                disabled={isLoading}
              >
                {isLoading && activeButton === "starknet" ? (
                  <ActivityIndicator color="#000000" />
                ) : (
                  <>
                    <Image
                      source={require("../../assets/images/starknet.png")}
                      style={styles.starknetLogo}
                    />
                    <Text style={styles.buttonText}>
                      Pay with Starknet USDC
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.poweredByContainer}>
                <Text style={styles.poweredByText}>Powered by</Text>
                <Image
                  source={require("../../assets/images/starknet.png")}
                  style={styles.starknetLogo}
                />
                <Text style={styles.poweredByText}>Starknet</Text>
              </View>
            </View>
          </>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  // Payment styles
  paymentTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSansBold",
    marginBottom: 24,
    textAlign: "center",
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSansSemiBold",
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  benefitIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  benefitContent: {
    flex: 1,
  },
  benefitHeader: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSansSemiBold",
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 14,
    color: "#787A80",
    fontFamily: "PlusJakartaSansRegular",
    lineHeight: 20,
  },
  paymentSection: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#1E1E1E",
  },
  amountText: {
    fontSize: 32,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSansBold",
    marginBottom: 8,
  },
  minimumText: {
    fontSize: 14,
    color: "#787A80",
    fontFamily: "PlusJakartaSansRegular",
    marginBottom: 24,
  },
  applePayButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 56,
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  applePayImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  applePayText: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "PlusJakartaSansSemiBold",
  },
  creditCardButton: {
    backgroundColor: "transparent",
    borderRadius: 56,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3C",
  },
  creditCardText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSansSemiBold",
  },
  poweredByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  poweredByText: {
    color: "#787A80",
    fontSize: 12,
    fontFamily: "PlusJakartaSansMedium",
  },
  starknetLogo: {
    width: 20,
    height: 20,
    marginHorizontal: 4,
  },
  // Success styles
  successContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSansBold",
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#787A80",
    fontFamily: "PlusJakartaSansRegular",
    textAlign: "center",
    marginBottom: 24,
  },
  benefitsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  successBenefitsTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSansSemiBold",
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 14,
    color: "#787A80",
    fontFamily: "PlusJakartaSansRegular",
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 56,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "PlusJakartaSansSemiBold",
  },
  paymentButton: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 56,
  },
  starknetButton: {
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 16,
    color: "#000000",
    fontFamily: "PlusJakartaSansSemiBold",
    marginLeft: 8,
  },
  memberButton: {
    backgroundColor: "#FF6D1B",
    borderWidth: 0,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  joinButton: {
    borderWidth: 2,
    borderColor: "#FF6D1B",
    backgroundColor: "transparent",
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  memberButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
  joinButtonText: {
    color: "#FF6D1B",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default PaymentBottomSheet;
