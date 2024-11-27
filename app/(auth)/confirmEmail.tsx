import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { useNavigation } from "@react-navigation/native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { account } from "../../appWrite";
import { useClerkAuthentication } from "../../hooks/useClerkAuthentication";

const CELL_COUNT = 6;

const confirmEmail = () => {
  const [value, setValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean>(); // Track whether OTP is correct (null = not yet checked)
  const [timer, setTimer] = useState(60); // Timer for resend
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const { userId } = useClerkAuthentication();

  const { signUp, setActive, isLoaded } = useSignUp(); // Clerk hooks

  // Effect to handle the timer countdown
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [timer]);

  const onPressVerify = async () => {
    if (!isLoaded) return; // Make sure the Clerk session is loaded

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: value, // Use the value from the input
      });

      const session = await account.updateVerification(userId, value);

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId }); // Set the session as active
        router.replace("/(auth)/createPassword"); // Redirect to the home page after successful verification
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        setIsCorrect(false); // Mark OTP as incorrect
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setIsCorrect(false); // Handle error and show incorrect OTP message
    }
  };

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      onPressVerify(); // Automatically verify OTP when all cells are filled
    }
  }, [value]);

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      <Pressable onPress={() => router.back()}>
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
        <Text className="text-[20px] text-Grey/06 font-PlusJakartaSansRegular">
          phee@gmail.com
        </Text>
      </View>

      <Text className="text-Orange/08 text-center text-[16px] font-PlusJakartaSansBold underline mt-[24px]">
        Change email
      </Text>

      {/** confirmation code */}
      <View className="">
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          // Correct the autoComplete prop with supported values
          autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
          testID="my-code-input"
          InputComponent={TextInput} // Or Text depending on what you want
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                isCorrect === false &&
                  value.length === CELL_COUNT &&
                  styles.errorCell, // Apply error style if incorrect
                isCorrect === true &&
                  value.length === CELL_COUNT &&
                  styles.successCell, // Apply success style if correct
              ]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />

        {isCorrect === false && value.length === CELL_COUNT && (
          <Text style={styles.errorMessage}>
            Incorrect code. Please try again.
          </Text>
        )}

        {/* Resend section with timer */}
        <Text className="text-[14px] mt-[32px] font-PlusJakartaSansMedium text-Grey/04 text-center">
          Didn’t receive a code?{" "}
          {timer > 0 ? (
            <Text className="text-Grey/06">Resend in {timer}s</Text>
          ) : (
            <Text className="text-Orange/08">Resend</Text>
          )}
        </Text>
      </View>
      <View className="flex-row items-center justify-center gap-x-[2px] absolute bottom-12 left-0 right-0">
        <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[16px]">
          Powered by
        </Text>
        <Image source={require("../../assets/images/starknet.png")} />
        <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[16px]">
          Starknet
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default confirmEmail;

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
    borderColor: "#FF0000", // Red border for incorrect OTP
  },
  successCell: {
    borderColor: "#45F42E", // Green border for correct OTP
  },
  errorMessage: {
    color: "#FF0000",
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
  },
});
