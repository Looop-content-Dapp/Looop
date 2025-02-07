import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useClerkAuthentication } from "../../hooks/useClerkAuthentication";
import { ViewIcon, ViewOffIcon } from "@hugeicons/react-native";
import { AppButton } from "@/components/app-components/button";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

const Signin = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = useState("");
  const [passwordView, setPasswordView] = useState(true);

  const {
    handleEmailSignIn,
    loading,
  } = useClerkAuthentication();
  return (
    <>
      <StatusBar translucent={true} backgroundColor="#040405" style="light" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#040405",
        }}
      >
        <View className="flex-1 px-6 gap-12">
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

            <View className="gap-y-3">
              <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
                Email
              </Text>
              <TextInput
                placeholderTextColor="#787A80"
                placeholder="Email address"
                value={emailAddress}
                onChangeText={setEmailAddress}
                className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                inputMode="email"
                keyboardAppearance="dark"
                keyboardType="email-address"
              />

              <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
                Password
              </Text>
              <View className="flex-row items-center bg-Grey/07 overflow-hidden rounded-full pr-5">
                <TextInput
                  secureTextEntry={passwordView}
                  placeholderTextColor="#787A80"
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
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

            <AppButton.Primary
            color="#FF6D1B"
              text="Continue"
              loading={loading}
              disabled={loading}
              onPress={() => handleEmailSignIn(emailAddress, password)}
            />

            {/* <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
              Or you can sign in with
            </Text> */}
          </View>

          <View className="gap-y-4 flex flex-row gap-x-4">
            <TouchableOpacity
              className="bg-white flex-1 py-4 rounded-full flex-row items-center justify-center"
              onPress={() => Alert.alert('Google signon not available yet')}
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
              onPress={() => Alert.alert('Apple signon not available yet')}
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
        </View>
      </SafeAreaView>
    </>
  );
};

export default Signin;
