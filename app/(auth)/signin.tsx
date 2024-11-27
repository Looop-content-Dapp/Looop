import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";
import { useClerkAuthentication } from "../../hooks/useClerkAuthentication";

const signin = () => {
  const [emailAddress, setEmailAddress] = React.useState("");
  const {
    handleAppleSignUp,
    handleEmailSignUp,
    handleGoogleSignUp,
    handleEmailSignIn,
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
      <View className="items-center">
        <Image
          source={require("../../assets/images/logo-orange.png")}
          className="w-[72px] h-[32px]"
        />
      </View>

      <View className="gap-y-12 mt-6">
        <View className="gap-y-2 pt-6">
          <Text className="text-white text-2xl font-PlusJakartaSansBold">
            Welcome Back to Looop
          </Text>
          <Text className="text-gray-400 text-base font-PlusJakartaSansRegular">
            We’re excited to have you in the looop. Are you ready for an amazing
            experience? Let’s get you started
          </Text>
        </View>

        <View className="gap-y-3">
          <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
            What’s your Email?
          </Text>
          <TextInput
            placeholderTextColor="#787A80"
            placeholder="Email address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
          />
        </View>

        <TouchableOpacity
          onPress={() => handleEmailSignIn(emailAddress)}
          className="bg-orange-500 items-center py-4 rounded-full"
        >
          <Text className="text-lg font-PlusJakartaSansMedium text-white">
            Continue
          </Text>
        </TouchableOpacity>

        <Text className="mt-14 text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
          Or you can sign up with
        </Text>
      </View>

      <View className="mt-12 gap-y-4">
        <TouchableOpacity
          onPress={handleGoogleSignUp}
          className="bg-white py-4 rounded-full flex-row items-center justify-center"
        >
          <Image
            source={require("../../assets/images/google.png")}
            className="w-8 h-8"
          />
          <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
            Sign in with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAppleSignUp}
          className="bg-white py-4 rounded-full flex-row items-center justify-center"
        >
          <Image
            source={require("../../assets/images/apple.png")}
            className="w-8 h-8"
          />
          <Text className="ml-2 text-lg font-PlusJakartaSansMedium text-black">
            Sign in with Apple
          </Text>
        </TouchableOpacity>
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

export default signin;
