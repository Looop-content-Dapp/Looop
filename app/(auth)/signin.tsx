import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useClerkAuthentication } from "../../hooks/useClerkAuthentication";
import { ViewIcon, ViewOffIcon } from "@hugeicons/react-native";
import { AppButton } from "@/components/app-components/button";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Formik, useFormik } from "formik";
import { signinSchema } from "@/schema/auth.schema";
import { account } from "@/appWrite";
import { setClaimId, setUserData } from "@/redux/slices/auth";
import store from "@/redux/store";
import { showToast } from "@/config/ShowMessage";
import api from "@/config/apiConfig";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { ID } from "react-native-appwrite";

const CELL_COUNT = 6;

const Signin = () => {
  const [passwordView, setPasswordView] = useState(true);
  const [value, setValue] = useState("");
  const { handleEmailSignIn, loading, session } = useClerkAuthentication();
  const [currentStep, setCurrentStep] = useState("email");
  const [timer, setTimer] = useState(60);
  const initialState = { emailAddress: "", password: "" };
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [isCorrect, setIsCorrect] = useState<boolean>();
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const formik = useFormik({
    initialValues: initialState,
    validationSchema: signinSchema,
    onSubmit: async (values) => {
      try {
        await handleEmailSignIn(values.emailAddress, values.password);
        setCurrentStep("verification"); // Move to verification step after sending email
      } catch (error) {
        showToast("Failed to send verification code", "error");
      }
    },
  });

  const handleVerifyOTP = async (value: string) => {
    try {
      if (session) {
        const accountToken = await account.createSession(
          session?.userId,
          value // The OTP code
        );

        if (accountToken) {
          const response = await api.post(`/api/user/signin`, {
            email: formik.values.emailAddress,
            password: formik.values.password,
          });

          store.dispatch(setUserData(response.data.data));
          store.dispatch(setClaimId(response.data.data.artistClaim));
          showToast("Successfully signed in", "success");
          router.push("/(musicTabs)/(home)");
        }
      } else {
        showToast("Invalid verification code", "error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      showToast("Failed to verify code", "error");
    }
  };

  const handleResend = async () => {
    console.log(formik.values.emailAddress, "shshsh");
    if (timer > 0) return;

    try {
      await account.createEmailToken(
        ID.unique(),
        initialState.emailAddress,
        true
      );
      setTimer(60);
    } catch (err) {
      console.error("Failed to resend verification code:", err);
    }
  };

  useEffect(() => {
    if (value.length === CELL_COUNT) {
      handleVerifyOTP(value);
    }
  }, [value, session]);

  const renderVerificationStep = () => (
    <>
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
          {formik.values.emailAddress}
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
            {/* {timer > 0 ? (
              <Text className="text-Grey/06">Resend in {timer}s</Text>
            ) : ( */}
            <Text onPress={handleResend} className="text-Orange/08">
              Resend
            </Text>
            {/* )} */}
          </Text>
        </View>
      </View>
    </>
  );

  const renderOriginalScreen = () => (
    <>
      <View className="flex-1 px-6 gap-12">
        <>
          <View className="items-center">
            <Image
              source={require("../../assets/images/logo-orange.png")}
              className="w-[72px] h-[32px]"
            />
          </View>

          <View className="gap-y-10">
            <View className="gap-y-2 pt-6">
              <Text className="text-white text-[24px] font-PlusJakartaSansBold">
                Welcome back!
              </Text>
              <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansRegular">
                Dive right in and continue exploring
              </Text>
            </View>

            <View className="gap-y-6">
              <View className="gap-4">
                <Text className="text-[16px] text-gray-200 flex flex-row items-center font-PlusJakartaSansBold">
                  Email
                  {formik.errors.emailAddress &&
                    formik.touched.emailAddress && (
                      <Text className="text-Orange/08 text-md">*</Text>
                    )}
                </Text>

                <TextInput
                  placeholderTextColor="#787A80"
                  placeholder="Email address"
                  value={formik.values.emailAddress}
                  onChangeText={formik.handleChange("emailAddress")}
                  className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                  inputMode="email"
                  keyboardAppearance="dark"
                  keyboardType="email-address"
                />
              </View>

              <View className="gap-4">
                <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
                  Password
                  {formik.errors.password && formik.touched.password && (
                    <Text className="text-Orange/08 text-md">*</Text>
                  )}
                </Text>
                <View className="flex-row items-center bg-Grey/07 overflow-hidden rounded-full pr-5">
                  <TextInput
                    secureTextEntry={passwordView}
                    placeholderTextColor="#787A80"
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChangeText={formik.handleChange("password")}
                    className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 flex-1 px-8"
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordView(!passwordView)}
                  >
                    {passwordView ? (
                      <ViewIcon size={24} color="#787A80" variant="solid" />
                    ) : (
                      <ViewOffIcon size={24} color="#787A80" variant="solid" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <AppButton.Primary
              color="#FF6D1B"
              text="Continue"
              loading={loading}
              disabled={loading}
              onPress={() => formik.handleSubmit()}
            />

            <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
              Or you can sign in with
            </Text>
          </View>

          <View className="gap-y-4 flex flex-row gap-x-4">
            <TouchableOpacity
              className="bg-white flex-1 py-4 rounded-full flex-row items-center justify-center"
              onPress={() => Alert.alert("Google signon not available yet")}
            >
              <Image
                source={require("../../assets/images/google.png")}
                className="w-8 h-8"
              />
              <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white flex-1 py-4 rounded-full flex-row items-center justify-center"
              onPress={() => Alert.alert("Apple signon not available yet")}
            >
              <Image
                source={require("../../assets/images/apple.png")}
                className="w-8 h-8"
              />
              <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
                Apple
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-center gap-x-[4px] absolute bottom-12 left-0 right-0">
            <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[14px]">
              Dont have an account?
            </Text>
            <TouchableOpacity onPress={() => router.navigate("/(auth)/")}>
              <Text className="text-Orange/08 underline pl- font-PlusJakartaSansMedium text-[14px]">
                SignUp
              </Text>
            </TouchableOpacity>
          </View>
        </>
      </View>
    </>
  );

  return (
    <>
      <StatusBar translucent={true} backgroundColor="#040405" style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#040405",
        }}
      >
        {currentStep === "email"
          ? renderOriginalScreen()
          : renderVerificationStep()}
      </SafeAreaView>
    </>
  );
};

export default Signin;

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
