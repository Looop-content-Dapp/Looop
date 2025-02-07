import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { router } from "expo-router";
import { account } from "../../appWrite";
import { useClerkAuthentication } from "../../hooks/useClerkAuthentication";
import { ID } from "react-native-appwrite";
import { AppButton } from "@/components/app-components/button";

const CELL_COUNT = 6;

const EmailSignupFlow = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState("email"); // 'email' or 'verification'

  // Email step state
  const [emailAddress, setEmailAddress] = useState("");

  // Verification step state
  const [value, setValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean>();
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const { handleEmailSignUp, userId } =
    useClerkAuthentication();

  // Verification code field setup
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // Timer effect for resend cooldown
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

  // Handle initial email submission
  const handleEmailSubmit = async () => {
    if (!emailAddress || !emailAddress.includes("@")) {
      // Add proper email validation here
      return;
    }
    setIsLoading(true);
    try {
      // Create verification request with Appwrite
      await handleEmailSignUp(emailAddress);
      setIsLoading(false);
      setCurrentStep("verification");
    } catch (error: any) {
      setIsLoading(false);
      console.error("Failed to send verification email:", error.message);
      // Add proper error handling/display here
    }
  };

  // Handle verification code submission
  const handleVerification = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const session = await account.createSession(
        userId,
        value // The OTP code
      );
      console.log("session", session);

      if (session) {
        setIsCorrect(true);
        setTimeout(() => {
          router.replace("/(auth)/createPassword");
          Alert.alert("confirmed");
        }, 1000);
      } else {
        await account.deleteSession(session?.$id);
        setIsCorrect(false);
      }
    } catch (err) {
      await account.deleteSession(session?.$id);
      console.error("Verification failed:", err);
      setIsCorrect(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification code
  const handleResend = async () => {
    if (timer > 0) return;

    try {
      await account.createEmailToken(ID.unique(), emailAddress, true);
      setTimer(60);
    } catch (err) {
      console.error("Failed to resend verification code:", err);
    }
  };

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleVerification();
    }
  }, [value]);

  // Email Input Step
  const renderEmailStep = () => (
    <>
      <View className="items-center">
        <Image
          source={require("../../assets/images/logo-orange.png")}
          className="w-[72px] h-[32px]"
        />
      </View>

      <View className="gap-y-12 mt-6">
        <View className="gap-y-2 pt-6">
          <Text className="text-white text-[24px] font-PlusJakartaSansBold">
            Welcome to Looop
          </Text>
          <Text className="text-gray-400 text-[16px] font-PlusJakartaSansRegular">
            We're excited to have you in the looop. Are you ready for an amazing
            experience? Let's get you started
          </Text>
        </View>

        <View className="gap-y-3">
          <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
            What's your Email?
          </Text>
          <TextInput
            placeholderTextColor="#787A80"
            placeholder="Email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            inputMode="email"
            keyboardAppearance="dark"
            keyboardType="email-address"
            className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
          />
        </View>

        <AppButton.Primary
          color="#FF6D1B"
          text="Continue"
          loading={isLoading}
          onPress={handleEmailSubmit}
        />

        <Text className="mt-14 text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
          Or you can sign up with
        </Text>
      </View>

      <View className="mt-12 gap-y-4">
        <TouchableOpacity
          className="bg-white py-4 rounded-full flex-row items-center justify-center"
          onPress={() => Alert.alert('Google signon not available yet')}
        >
          <Image
            source={require("../../assets/images/google.png")}
            className="w-8 h-8"
          />
          <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
            Sign up with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white py-4 rounded-full flex-row items-center justify-center"
          onPress={() => Alert.alert('Apple signon not available yet')}
        >
          <Image
            source={require("../../assets/images/apple.png")}
            className="w-8 h-8"
          />
          <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
            Sign up with Apple
          </Text>
        </TouchableOpacity>
      </View>

         <View className="flex-row items-center justify-center gap-x-[4px] absolute bottom-12 left-0 right-0">
            <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[14px]">
             Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)/signin")}>
            <Text className="text-Orange/08 underline pl- font-PlusJakartaSansMedium text-[14px]">
             SignIn
            </Text>
            </TouchableOpacity>

          </View>
    </>
  );

  // Verification Step
  const renderVerificationStep = () => (
    <>
      <Pressable onPress={() => setCurrentStep("email")}>
        <ArrowLeft02Icon size={32} color="#fff" variant="solid" />
      </Pressable>
      <View className="items-center">
        <Image
          source={require("../../assets/images/Mail.png")}
          className="w-[183px] h-[183px]"
        />
      </View>
      <View className="items-center mt-[24px]">
        <Text className="text-[20px] text-Grey/04 font-PlusJakartaSansRegular">
          Please enter the code we sent to
        </Text>
        <Text className="text-[16px] text-Grey/06 font-PlusJakartaSansRegular">
          {emailAddress}
        </Text>
      </View>

      <Text
        onPress={() => setCurrentStep("email")}
        className="text-Orange/08 text-center text-[16px] font-PlusJakartaSansBold underline mt-[24px]"
      >
        Change email
      </Text>

      <View className="">
        <CodeField
          ref={ref}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
          testID="my-code-input"
          InputComponent={TextInput}
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
          {...props}
        />

        {isCorrect === false && value.length === CELL_COUNT && (
          <Text style={styles.errorMessage}>
            Incorrect code. Please try again.
          </Text>
        )}

        <View className="mt-[32px]">
          <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/04 text-center">
            Didn't receive a code?{" "}
            {timer > 0 ? (
              <Text className="text-Grey/06">Resend in {timer}s</Text>
            ) : (
              <Text onPress={handleResend} className="text-Orange/08">
                Resend
              </Text>
            )}
          </Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 24,
        maxHeight: "100%",
      }}
      className="flex-1 min-h-full px-6"
    >
      {currentStep === "email" ? renderEmailStep() : renderVerificationStep()}
    </SafeAreaView>
  );
};

export default EmailSignupFlow;

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
