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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyEmail } from "@/hooks/useVerifyEmail";


const schema = z.object({
  email: z.string({
    message: "Please enter a valid email address",
  }).email({
    message: "Please enter a valid email address",
  }).nonempty({
    message: "Email is required",
  }),
});
const Signin = () => {
  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  const { control, handleSubmit, formState: { errors }, } = useForm({
    resolver: zodResolver(schema),
  });


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

          <View className="gap-y-20">
            <View className="gap-y-2 pt-6">
              <Text className="text-white text-[24px] font-PlusJakartaSansBold">
                Welcome to Looop
              </Text>
              <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansRegular">
                We&rsquo;re excited to have you in the looop. Are you ready for an amazing experience? Let&rsquo;s get you started!
              </Text>
            </View>

            <View className="gap-y-3">
              <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
                What&rsquo;s your Email?
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{
                      backgroundColor: "#1E1E1E",
                      color: "#D2D3D5",
                      borderRadius: 10,
                      padding: 10,
                    }}
                    className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Email Address"
                    placeholderTextColor="#787A80"
                    keyboardType="email-address"
                    inputMode="email"
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    returnKeyType="next"
                  />
                )}
                name="email"
                defaultValue=""
              />
              {errors?.email && (
                <Text className="text-red-500 text-sm font-PlusJakartaSansRegular"
                >{errors.email.message}</Text>
              )}


            </View>

            <AppButton.Secondary
              color="#FF7A1B"
              text="Continue"
              onPress={handleSubmit((data) => {
                verifyEmail(data, {
                  onSuccess: () => {
                    Alert.alert("Success", "Email sent successfully");
                  },
                  onError: (error) => {
                    Alert.alert("Error", error.message);
                  },
                });
              })}
              loading={isPending}

            />

            <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
              Or you can sign in with
            </Text>
          </View>


          <View className="flex-col gap-y-4">
            <TouchableOpacity onPress={() => router.navigate("/(auth)/signin")}
              className="flex-row items-center justify-center gap-x-4 bg-white px-4 py-2 rounded-full w-full">

              <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[14px]">
              Sign in with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.navigate("/(auth)/signin")}
              className="flex-row items-center justify-center gap-x-4 bg-white px-4 py-2 rounded-full w-full">
              <Image
                source={require("../../assets/images/apple.png")}
                style={{ width: 40, height: 40 }}
              />
              <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[14px]">
                Sign in with Apple
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-col gap-y-4">
            <Text
              className="text-center text-[#787A80] font-PlusJakartaSansRegular text-xs uppercase ">
              Powered by
            </Text>
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/xion.png")}
                className="w-10 h-6"
              />
              <Text className="text-[#787A80] font-PlusJakartaSansRegular text-xs uppercase">
                Xion
              </Text>
            </View>
          </View>

        </View>
      </SafeAreaView>
    </>
  );
};

export default Signin;
