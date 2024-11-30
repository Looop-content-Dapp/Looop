import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { useClerkAuthentication } from "../../hooks/useClerkAuthentication";
import { ViewIcon, ViewOffIcon } from "@hugeicons/react-native";
import { AppButton } from "@/components/app-components/button";
import { StatusBar } from "expo-status-bar";

const signin = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = useState("");
  const [passwordView, setPasswordView] = useState(false);

  const {
    handleAppleSignUp,
    handleEmailSignUp,
    handleGoogleSignUp,
    handleEmailSignIn,
    loading,
  } = useClerkAuthentication();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 24,
        maxHeight: "100%",
      }}
      className="flex-1 min-h-full px-6"
    >
      <StatusBar translucent={true} style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View className="items-center">
          <Image
            source={require("../../assets/images/logo-orange.png")}
            className="w-[72px] h-[32px]"
          />
        </View>

        <View className="gap-y-10">
          <View className="gap-y-2 pt-6">
            <Text className="text-white text-2xl font-PlusJakartaSansBold">
              Welcome back!
            </Text>
            <Text className="text-[#D2D3D5] text-[16px]font-PlusJakartaSansRegular">
              Dive right in and continue exploring
            </Text>
          </View>

          <View className="gap-y-3">
            <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
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

            <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
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
              <TouchableOpacity onPress={() => setPasswordView(!passwordView)}>
                {passwordView ? (
                  <ViewIcon size={24} color="#787A80" variant="solid" />
                ) : (
                  <ViewOffIcon size={24} color="#787A80" variant="solid" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <AppButton.Primary
            text="Continue"
            loading={loading}
            disabled={loading}
            onPress={() => handleEmailSignIn(emailAddress, password)}
          />

          <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
            Or you can sign in with
          </Text>
        </View>

        <View className="gap-y-4 flex flex-row gap-x-4">
          <TouchableOpacity className="bg-white flex-1 py-4 rounded-full flex-row items-center justify-center">
            <Image
              source={require("../../assets/images/google.png")}
              className="w-8 h-8"
            />
            <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
              Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white flex-1 py-4 rounded-full flex-row items-center justify-center">
            <Image
              source={require("../../assets/images/apple.png")}
              className="w-8 h-8"
            />
            <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
              Apple
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-center gap-x-[2px]">
          <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[16px]">
            Powered by
          </Text>
          <Image source={require("../../assets/images/starknet.png")} />
          <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[16px]">
            Starknet
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signin;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 25,
    gap: 40,
  },
});
