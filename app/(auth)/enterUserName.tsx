import { View, Text, TextInput, Alert, StyleSheet } from "react-native";
import React from "react";
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
  const { email, password, dob, gender } = useLocalSearchParams<{
    email: string;
    password: string;
    dob: string;
    gender: string;
  }>();
  const router = useRouter();
  console.log("useremail", email);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { mutate: checkUsername } = useCheckUsername();
  const [usernameError, setUsernameError] = React.useState<string>("");

  // Add debounced username check
  const debouncedCheckUsername = React.useCallback(
    debounce((username: string) => {
      if (username) {
        checkUsername(
          { username },
          {
            onSuccess: (response) => {
              if (response.data.existingUser) {
                setUsernameError("Username already taken");
              } else {
                setUsernameError("");
              }
            },
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
        password,
        age: calculateAge(dob).toLocaleString(),
        fullname: data.name,
        username: data.username,
        gender,
        referralCode: data.referralCode,
      },
      {
        onSuccess: () => {
          router.navigate({
            pathname: "/(settingUp)",
            params: { email, password, ...data },
          });
        },
        onError: (error) => {
          console.error("User creation failed:", error);
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


  return (
    <View className="flex-1 px-6 gap-12">
      <AuthHeader
        title="Tell Us About Yourself"
        description="Just a few more details to personalize your experience!"
      />
       {isError && (
          <View className="flex-row items-center gap-x-2">
            <InformationCircleIcon size={20} color="#FF1B1B" />
            <Text className="text-[#FF1B1B] font-PlusJakartaSansRegular text-xs"
            >{
                // @ts-ignore
                error?.response?.data.message || "Failed to send email. Please try again."
              }</Text>
          </View>
        )}

      <View className="gap-y-3">
        <View className="gap-y-1">
          <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
            What&rsquo;s your name?
          </Text>
          <Text className="text-[12px] text-gray-400 font-PlusJakartaSansRegular">
            This is the name that will be displayed on your profile
          </Text>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Name"
              className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-[12px]">
            {errors.name.message}
          </Text>
        )}
      </View>
      <View className="gap-y-3">
        <View className="gap-y-1">
          <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
            Pick your username
          </Text>
          <Text className="text-[12px] text-gray-400 font-PlusJakartaSansRegular">
            We&rsquo;ll use this to create your meta account
          </Text>
        </View>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                debouncedCheckUsername(text);
              }}
              value={value}
              placeholder="Username"
              className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
            />
          )}
        />
        {(errors.username || usernameError) && (
          <Text className="text-red-500 text-[12px]">
            {errors.username?.message || usernameError}
          </Text>
        )}
      </View>
      <View className="gap-y-3">
        <Text className="text-[14px] text-gray-200 font-PlusJakartaSansBold">
          Referral Code (optional)
        </Text>
        <Controller
          control={control}
          name="referralCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter referral code"
              className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
            />
          )}
        />
      </View>
      <View className="gap-y-4">
        <Text className="text-[12px] text-gray-400 font-PlusJakartaSansRegular">
          By tapping create account, you agree to our{" "}
          <Link
            className="text-[#FF7A1B] text-[12px] font-PlusJakartaSansRegular"
            href="/terms"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            className="text-[#FF7A1B] text-[12px] font-PlusJakartaSansRegular"
            href="/privacy"
          >
            Privacy Policy
          </Link>
        </Text>
      </View>
      <View style={styles.buttomButtonContainer}>
        <AppButton.Secondary
          text="Create Account"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          color="#FF7A1B"
        />
      </View>
    </View>
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
