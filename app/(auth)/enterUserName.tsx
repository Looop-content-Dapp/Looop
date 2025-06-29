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
import { useNotification } from '@/context/NotificationContext';


type FormData = {
  username: string;
  name: string;
  referralCode?: string;
  bio: string;
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
  bio: z
    .string({
      message: "Bio is required",
    })
    .nonempty({ message: "Bio is required" })
});
const EnterUserName = () => {
  const { showNotification } = useNotification();
  const { mutate: createUser, isPending, error, isError } = useCreateUser();
  const { email, password, dob, gender, oauthProvider, walletAddress } = useLocalSearchParams<{
    email: string;
    password: string;
    dob: string;
    gender: string;
    oauthProvider?: "google" | "apple" | "xion" | "argent";
    walletAddress: string
  }>();
  const router = useRouter();
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
        email: email || "",
        password: password ? password : "",
        age: calculateAge(dob).toLocaleString(),
        fullname: data.name,
        username: data.username,
        gender,
        referralCode: data.referralCode,
        oauthprovider: oauthProvider,
        walletAddress: walletAddress,
        bio: data.bio || ""
      },
      {
        onSuccess: () => {
            showNotification({
              type: 'success',
              title: 'Success',
              message: 'Account created successfully!',
              position: 'top'
            });
            router.navigate({
              pathname: "/(settingUp)",
              params: { email: email || "", password, ...data },
            });
          },
          onError: (error: any) => {
            console.error("User creation failed:", error?.response?.data.message);
            setErrorMessage(error.message);
            showNotification({
              type: 'error',
              title: 'Account Creation Failed',
              message: error?.response?.data.message || "Failed to create account. Please try again later.",
              position: 'top'
            });
          },
      }
    );
  } catch (error: any) {
    console.error("Submission error:", error.message);
      showNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        position: 'top'
      });
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

        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Bio"
              description="Tell us a bit about yourself"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your bio"
              placeholderTextColor="#787A80"
              keyboardAppearance="dark"
              autoCapitalize="sentences"
              autoCorrect={true}
              returnKeyType="done"
              multiline={true}
              numberOfLines={3}
              error={errors.bio?.message}
            />
          )}
        />
      </View>

      <View className="gap-y-4 mt-4">
        <Text className="text-[14px] text-gray-400 font-PlusJakartaSansRegular text-center">
          By tapping create account, you agree to our{" "}
          <Text
            className="text-[#FF7A1B] text-[14px] font-PlusJakartaSansBold"
            // href="https://looopmusic.com/policy"
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            className="text-[#FF7A1B] text-[14px] font-PlusJakartaSansBold"
            // href="https://looopmusic.com/policy"
          >
            Privacy Policy
          </Text>
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
