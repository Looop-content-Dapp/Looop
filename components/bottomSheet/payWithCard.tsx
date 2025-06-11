import { AppButton } from "@/components/app-components/button";
import ChainPicker from "@/components/app-components/ChainPicker";
import { FormField } from "@/components/app-components/formField";
import { useFlutterwavePayment } from "@/hooks/payment/useFlutterwavePayment";
import useUserInfo from "@/hooks/user/useUserInfo";
import { useAppSelector } from "@/redux/hooks";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  amount: string;
}

interface PayWithCardProps {
  isVisible: boolean;
  onClose: () => void;
}

const CELL_COUNT = 6;
const { height } = Dimensions.get("window");

const PayWithCard = ({ isVisible, onClose }: PayWithCardProps) => {
  const router = useRouter();
  const { location } = useUserInfo();
  const { preAuthenticateCard } = useFlutterwavePayment();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [value, setValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean>();
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
    amount: "",
  });
  const { validatePayment } = useFlutterwavePayment();
  const { userdata } = useAppSelector((auth) => auth.auth);

  // Bottom sheet reference
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["90%"], []);

  // Effect to open/close the bottom sheet
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // Set currency based on user location
  useEffect(() => {
    if (location?.country) {
      const currencyMap: { [key: string]: string } = {
        Nigeria: "NGN",
        Ghana: "GHS",
        Kenya: "KES",
        Uganda: "UGX",
        Tanzania: "TZS",
        "United States": "USD",
        "United Kingdom": "GBP",
      };
      setCurrency(currencyMap[location.country] || "USD");
    }
  }, [location]);

  // Add state for card type
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    const sanitizedValue =
      field === "amount"
        ? value.replace(/[^0-9.]/g, "")
        : value.replace(/[^a-zA-Z0-9\s/]/g, "");

    if (field === "cardNumber") {
      const formattedValue = sanitizedValue
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
      setCardDetails((prev) => ({ ...prev, [field]: formattedValue }));
      detectCardType(formattedValue.replace(/\s/g, ""));
    } else if (field === "expiryDate") {
      const formatted = sanitizedValue
        .replace(/\D/g, "")
        .replace(/^(\d{2})/, "$1/")
        .substr(0, 5);
      setCardDetails((prev) => ({ ...prev, [field]: formatted }));
    } else {
      setCardDetails((prev) => ({ ...prev, [field]: sanitizedValue }));
    }
  };

  // Function to detect card type
  const detectCardType = (cardNumber: string) => {
    if (cardNumber.length < 2) {
      setCardType(null);
      return;
    }

    if (cardNumber.startsWith("4")) {
      setCardType("visa");
    } else if (
      (cardNumber.startsWith("5") &&
        ["1", "2", "3", "4", "5"].includes(cardNumber[1])) ||
      (cardNumber.startsWith("2") &&
        cardNumber.length >= 4 &&
        parseInt(cardNumber.substring(0, 4)) >= 2221 &&
        parseInt(cardNumber.substring(0, 4)) <= 2720)
    ) {
      setCardType("mastercard");
    } else {
      setCardType(null);
    }
  };

  // Add new states for OTP verification
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [flwRef, setFlwRef] = useState("");
  const [verifying, setVerifying] = useState(false);

  const ref = useBlurOnFulfill({ value: otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });

  const handleContinue = async () => {
    try {
      setLoading(true);

      // Validate all fields including amount
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv ||
        !cardDetails.cardHolderName ||
        !cardDetails.amount
      ) {
        Alert.alert("Validation Error", "Please fill in all fields");
        return;
      }

      // Validate amount is a valid number
      const amount = parseFloat(cardDetails.amount);
      if (isNaN(amount) || amount <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid amount");
        return;
      }

      // For now, just show OTP screen
      setShowOTP(true);
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An error occurred while validating your card"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setVerifying(true);

      const validationPayload = {
        otp: otpValue,
        flw_ref: flwRef,
        type: "card" as const,
      };

      const response = await validatePayment(validationPayload);

      if (response.status === "success") {
        router.push({
          pathname: "/payment/MintingSuccess",
          params: {
            name: "Payment Successful",
            transactionId: response.data?.id?.toString() || "",
          },
        });
        onClose();
      } else {
        Alert.alert("Error", response.message || "Payment verification failed");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An error occurred during verification"
      );
    } finally {
      setVerifying(false);
    }
  };

  const renderContent = () => {
    if (showOTP) {
      return (
        <View className="flex-1 px-6">
          <View className="flex-1">
            <View className="mt-6 mb-8">
              <Text className="text-[24px] font-PlusJakartaSansBold text-white">
                Authentication Required
              </Text>
              <Text className="text-[16px] font-PlusJakartaSansMedium text-[#787A80] mt-2">
                Please enter the verification code sent to your phone
              </Text>
            </View>

            <CodeField
              ref={ref}
              {...props}
              value={otpValue}
              onChangeText={setOtpValue}
              cellCount={CELL_COUNT}
              rootStyle={{
                marginTop: 20,
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={({ index, symbol, isFocused }) => (
                <Text
                  key={index}
                  style={[
                    styles.cell,
                    isFocused && styles.focusCell,
                    isCorrect === false &&
                      value.length === CELL_COUNT &&
                      styles.errorCell,
                    isCorrect === true &&
                      value.length === CELL_COUNT &&
                      styles.successCell,
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              )}
            />
          </View>

          <View className="mb-6">
            <AppButton.Primary
              color="#FF6D1B"
              text="Verify"
              onPress={handleVerify}
              disabled={otpValue.length !== CELL_COUNT}
              loading={verifying}
            />
          </View>
        </View>
      );
    }

    return (
      <View className="flex-1 px-6">
        <View className="flex-1">
          <View className="mt-6 mb-8">
            <Text className="text-[24px] font-PlusJakartaSansBold text-white">
              Enter Card Details
            </Text>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-[#787A80] mt-2">
              Please provide your card information below
            </Text>
          </View>

          <ChainPicker />

          <View className="gap-y-4 mt-[30px]">
            {/* Amount Field */}
            <FormField.TextField
              label={`Amount (${currency})`}
              placeholder="Enter amount"
              value={cardDetails.amount}
              onChangeText={(text) => handleInputChange("amount", text)}
              keyboardType="numeric"
            />

            {/* Card Number Field with Card Type Icon */}
            <View className="relative">
              <FormField.TextField
                label="Card Number"
                placeholder="•••• •••• •••• ••••"
                value={cardDetails.cardNumber}
                onChangeText={(text) => handleInputChange("cardNumber", text)}
                keyboardType="numeric"
                maxLength={19}
              />
              <View className="absolute right-3 top-[38px]">
                {cardType === "visa" ? (
                  <Image
                    source={require("@/assets/images/visa-logo.png")}
                    style={{ width: 24, height: 16, resizeMode: "cover" }}
                  />
                ) : cardType === "mastercard" ? (
                  <Image
                    source={require("@/assets/images/mastercard-logo.png")}
                    style={{ width: 24, height: 16, resizeMode: "contain" }}
                  />
                ) : null}
              </View>
            </View>

            <View className="flex-row gap-x-4">
              <View className="flex-1">
                <FormField.TextField
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChangeText={(text) => handleInputChange("expiryDate", text)}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View className="flex-1">
                <FormField.TextField
                  label="CVV"
                  placeholder="•••"
                  value={cardDetails.cvv}
                  onChangeText={(text) => handleInputChange("cvv", text)}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>

            <FormField.TextField
              label="Card Holder Name"
              placeholder="Enter name as shown on card"
              value={cardDetails.cardHolderName}
              onChangeText={(text) => handleInputChange("cardHolderName", text)}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View className="mb-6">
          <AppButton.Primary
            color="#FF6D1B"
            text="Continue"
            onPress={handleContinue}
            loading={loading}
          />

          <View className="mt-6 items-center">
            <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
              Protected by
            </Text>
            <View className="mt-2 flex-row items-center">
              <Text className="text-[12px] font-PlusJakartaSansRegular text-[#787A80]">
                PCI DSS Certified | TLS 1.3 Encryption
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      handleIndicatorStyle={{ backgroundColor: "#63656B" }}
      backgroundStyle={{ backgroundColor: "#111318" }}
    >
      {renderContent()}
    </BottomSheet>
  );
};

export default PayWithCard;

const styles = StyleSheet.create({
  codeFieldRoot: { marginTop: 32, marginHorizontal: 14 },
  cell: {
    width: 56,
    height: 72,
    lineHeight: 36,
    fontSize: 28,
    borderWidth: 2,
    borderColor: "#12141B",
    textAlign: "center",
    borderRadius: 10,
    color: "#FFFFFF",
    fontWeight: "400",
    paddingTop: 13,
  },
  focusCell: {
    borderColor: "#12141B",
  },
  errorCell: {
    borderColor: "#FF0000",
  },
  successCell: {
    borderColor: "#45F42E",
  },
  errorMessage: {
    color: "#FF0000",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});
