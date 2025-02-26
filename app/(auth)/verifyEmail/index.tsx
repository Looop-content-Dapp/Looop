import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";

import Mail from "../../../assets/images/Mail.png";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSendEmailOTP } from "@/hooks/useVerifyEmail";
import { useVerifyEmailOtp } from "@/hooks/useVerifyEmailOtp";
import { InformationCircleIcon } from "@hugeicons/react-native";

const CELL_COUNT = 6;

const EnterCode = () => {
  const { mutate: resend, isPending } = useSendEmailOTP();
  const { mutate: verifyEmailOtp, isPending: isVerifying } =
    useVerifyEmailOtp();
  const [timer, setTimer] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleResend = () => {
    setError("");
    resend(
      { email },
      {
        onSuccess: () => {
          setTimer(60);
          setValue("");
        },
        onError: () => {
          setError("Failed to resend code. Please try again.");
        },
      }
    );
  };

  const handleVerify = (code: string) => {
    setError("");
    console.log({ email, otp: code });
    verifyEmailOtp(
      { email, otp: code },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setTimeout(() => {
            router.navigate({
              pathname: "/(auth)/choosePassword",
              params: { email },
            });
          }, 1000);
        },
        onError: (error) => {
          setError("Oops! Seems the code is incorrect.");
          setValue("");
          console.error(error);
        },
      }
    );
  };
  const handleCodeChange = (code: string) => {
    setValue(code);
    if (code.length === CELL_COUNT) {
      setTimeout(() => {
        handleVerify(code);
      }, 100);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const getCellStyle = (index: number, symbol: string, isFocused: boolean) => {
    return [
      styles.cell,
      isFocused && styles.focusCell,
      error && styles.errorCell,
      isVerifying && styles.verifyingCell,
      symbol && styles.filledCell,
      isSuccess && styles.successCell,
    ];
  };

  return (
    <View className="flex-col items-center justify-center gap-y-4 pt-8">
      {error && (
        <View className="flex-row items-center gap-x-2">
          <InformationCircleIcon size={20} color="#FF1B1B" />
          <Text className="text-[#FF1B1B] font-PlusJakartaSansRegular text-xs">
            {error}
          </Text>
        </View>
      )}
      <Image
        source={Mail as ImageSourcePropType}
        style={{
          width: 150,
          height: 150,
        }}
      />
      <View className="flex-col gap-y-1">
        <Text className="text-center text-[#D2D3D5] font-PlusJakartaSansRegular text-[16px]">
          Please enter the code we sent to
        </Text>
        <Text className="text-center text-[#787A80] font-PlusJakartaSansRegular text-[16px]">
          {email}
        </Text>
      </View>
      <Text
        onPress={() =>
          !isVerifying && router.navigate({ pathname: "/(auth)/verifyemail" })
        }
        className={`text-Orange/08 text-center text-[16px] font-PlusJakartaSansBold underline mt-[24px] ${
          isVerifying ? "opacity-50" : ""
        }`}
      >
        Change email
      </Text>

      <CodeField
        ref={ref}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        cellCount={CELL_COUNT}
        renderCell={({ index, symbol, isFocused }) => (
          <View key={index} style={styles.cellContainer}>
            <Text
              style={getCellStyle(index, symbol, isFocused)}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
            {isVerifying && index === CELL_COUNT - 1 && (
              <ActivityIndicator
                style={styles.verifyingIndicator}
                color="#FFA500"
              />
            )}
          </View>
        )}
        value={value}
        onChangeText={handleCodeChange}
        editable={!isVerifying}
        {...props}
      />

      <View className="flex-row items-center justify-center gap-x-2">
        <Text className="text-sm font-medium text-[#D2D3D5]">
          Didn't receive a code?
        </Text>
        {timer > 0 ? (
          <Text className="text-gray-500">Resend in {timer}s</Text>
        ) : isPending ? (
          <Text className="text-gray-500">Resending...</Text>
        ) : (
          <Pressable onPress={handleResend} disabled={isVerifying}>
            <Text
              className={`text-orange-600 active:text-orange-700 ${
                isVerifying ? "opacity-50" : ""
              }`}
            >
              Resend
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default EnterCode;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 32,
    marginHorizontal: 14,
    gap: 6,
    justifyContent: "center",
  },
  cellContainer: {
    position: "relative",
  },
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
    borderColor: "#FF1B1B",
  },
  verifyingCell: {
    borderColor: "#FFA500",
  },
  filledCell: {
    backgroundColor: "#1A1B1E",
  },
  verifyingIndicator: {
    position: "absolute",
    top: -15,
    right: -15,
  },
  errorMessage: {
    color: "#FF1B1B",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
  successCell: {
    borderColor: "#45F42E",
  },
});
