import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import AuthHeader from "@/components/AuthHeader";
import { AppButton } from "@/components/app-components/button";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useCreateUser } from "@/hooks/useCreateUser";
import { calculateAge } from "@/utils/calculateAge";
import { InformationCircleIcon } from '@hugeicons/react-native';
import { useCheckUsername } from "@/hooks/useCheckUsername";
import { debounce } from "lodash";
import AccountLoadingScreen from "@/components/screens/AccountLoadingScreen";
import { CheckmarkCircle02Icon, XVariableCircleIcon } from '@hugeicons/react-native';
import { Input } from "@/components/ui/input";
import { ScrollView } from "react-native";


type FormData = {
  username: string;
  name: string;
  referralCode?: string;
};
const schema = z.object({
  username: z
    .string({
      message: "Username is required",
    })
    .nonempty({ message: "Username is required" }),
  name: z
    .string({
      message: "Name is required",
    })
    .nonempty({ message: "Name is required" }),
  referralCode: z.string().optional(),
});
const EnterUserName = () => {
  const { mutate: createUser, isPending, error, isError } = useCreateUser();
  const { email, password, dob, gender, oauthProvider } = useLocalSearchParams<{
    email: string;
    password: string;
    dob: string;
    gender: string;
    oauthProvider?: "google" | "apple";
  }>();
  const router = useRouter();
  console.log("useremail", oauthProvider);
  // Add watch to useForm destructuring
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate: checkUsername, data } = useCheckUsername();
  console.log("username", data)
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [isChecking, setIsChecking] = useState(false);
  const [errormessage, setErrorMessage] = useState("")

  // Add debounced username check
  const debouncedCheckUsername = React.useCallback(
    debounce((username: string) => {
      if (username) {
        setIsChecking(true);
        checkUsername(
          { username },
          {
            onSuccess: (response) => {
              if (response.data.existingUser) {
                setUsernameError("Username already taken");
              } else {
                setUsernameError("");
              }
              setIsChecking(false);
            },
            onError: () => {
              setIsChecking(false);
            }
          }
        );
      }
    }, 500),
    []
  );

const onSubmit = (data: FormData) => {
  try {
    if (usernameError) {
      return;
    }

    createUser(
      {
        email,
        password: password ? password : "",
        age: calculateAge(dob).toLocaleString(),
        fullname: data.name,
        username: data.username,
        gender,
        referralCode: data.referralCode,
        oauthprovider: oauthProvider
      },
      {
        onSuccess: () => {
          router.navigate({
            pathname: "/(settingUp)",
            params: { email, password, ...data },
          });
        },
        onError: (error) => {
          console.error("User creation failed:", error.message);
          setErrorMessage(error.message)
          Alert.alert(
            "Error",
            "Failed to create account. Please try again later."
          );
        },
      }
    );
  } catch (error) {
    console.error("Submission error:", error);
    Alert.alert(
      "Error",
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};

if(isPending){
    return (
        <AccountLoadingScreen isError={isError} errorMessage={errormessage}  />
    )
}


  return (
    <ScrollView className="flex-1">
    <View className="flex-1 px-6 pb-32 gap-12">
      <AuthHeader
        title="Tell Us About Yourself"
        description="Just a few more details to personalize your experience!"
      />

      {isError && (
        <View className="flex-row items-center gap-x-2 mt-4">
          <InformationCircleIcon size={20} color="#FF1B1B" />
          <Text className="text-[#FF1B1B] font-PlusJakartaSansRegular text-xs">
            {
              // @ts-ignore
              error?.response?.data.message || "Failed to send email. Please try again."
            }
          </Text>
        </View>
      )}

      <View className="gap-y-6">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="What's your name?"
              description="This is the name that will be displayed on your profile"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Name"
              placeholderTextColor="#787A80"
              keyboardAppearance="dark"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="relative">
              <Input
                label="Pick your username"
                description="We'll use this to create your meta account"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  if (text) {
                    setIsChecking(true);
                    debouncedCheckUsername(text);
                  } else {
                    setUsernameError("");
                    setIsChecking(false);
                  }
                }}
                value={value}
                placeholder="Username"
                placeholderTextColor="#787A80"
                keyboardAppearance="dark"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                error={errors.username?.message || usernameError}
              />
              {watch('username') && (
                <View className="absolute right-4 top-[73px]">
                  {isChecking ? (
                    <ActivityIndicator size={24} color="#787A80" />
                  ) : usernameError ? (
                    <XVariableCircleIcon size={24} color="#FF1B1B" />
                  ) : (
                    <CheckmarkCircle02Icon size={24} color="#4CAF50" />
                  )}
                </View>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="referralCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Referral Code (optional)"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter referral code"
              placeholderTextColor="#787A80"
              keyboardAppearance="dark"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          )}
        />
      </View>

      <View className="gap-y-4 mt-4">
        <Text className="text-[14px] text-gray-400 font-PlusJakartaSansRegular text-center">
          By tapping create account, you agree to our{" "}
          <Link
            className="text-[#FF7A1B] text-[14px] font-PlusJakartaSansBold"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="text-[#FF7A1B] text-[14px] font-PlusJakartaSansBold"
            href="/privacy"
          >
            Privacy Policy
          </Link>
        </Text>
      </View>

      <View className="absolute bottom-8 left-6 right-6">
        <AppButton.Secondary
          text="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          color="#FF7A1B"
        />
      </View>
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttomButtonContainer: {
    position: "absolute",
    bottom: hp("2%"),
    left: 0,
    right: 0,
    padding: 20,
  },
});
export default EnterUserName;
