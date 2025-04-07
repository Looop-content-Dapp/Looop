import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AuthHeader from "@/components/AuthHeader";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/react-native";
import { AppButton } from "@/components/app-components/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Input } from "@/components/ui/input";

const schema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .refine((val) => val.length >= 12, {
      message: "Password must be at least 12 characters",
    })
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Password must contain at least one letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    }),
});

const ChoosePassword = () => {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [passwordView, setPasswordView] = useState(false);
  const [validationState, setValidationState] = useState({
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
  });

  const { control, watch } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const password = watch("password") || "";

  useEffect(() => {
    setValidationState({
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^a-zA-Z0-9]/.test(password),
      hasLength: password.length >= 12,
    });
  }, [password]);

  return (
    <View className="flex-1 pt-10 px-6 gap-12">
      <AuthHeader
        title="Secure your account"
        description="The safety of your account is important to us. Your Looop account acts as both an account and a wallet for storing your in-app funds. Create a password to secure it."
      />

      <View className="gap-y-4">
        <View className="flex-row items-center rounded-full pr-5">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="relative">
                <Input
                  label="Choose a Password"
                  description="Your password must be at least 12 characters long"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter your password"
                  placeholderTextColor="#787A80"
                  secureTextEntry={!passwordView}
                />
                <TouchableOpacity
                  onPress={() => setPasswordView(!passwordView)}
                  className="absolute right-4 top-[64px]"
                >
                  {passwordView ? (
                    <ViewOffIcon size={24} color="#787A80" />
                  ) : (
                    <ViewIcon size={24} color="#787A80" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View className="gap-6">
          <View className="mt-4">
            <ValidationItem
              isValid={validationState.hasLetter}
              text="At least one letter"
            />
            <ValidationItem
              isValid={validationState.hasNumber}
              text="At least one number"
            />
            <ValidationItem
              isValid={validationState.hasSpecial}
              text="One special character"
            />
            <ValidationItem
              isValid={validationState.hasLength}
              text="Must be at least 12 characters"
            />
          </View>

          <View className="bg-[#2A1708] p-[12px] flex-row items-start gap-[12px] max-w-full rounded-[12px] overflow-hidden">
            <View>
              <InformationCircleIcon
                size={24}
                color="#EC6519"
                variant="stroke"
              />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] text-[#EC6519] font-PlusJakartaSansRegular flex-shrink">
                Your password is encrypted and used to create a local backup of
                your private key to your device so you don’t lose access to your
                account. Think private keys as a pin to access your
                account/wallet
              </Text>
            </View>
          </View>
        </View>
      </View>
      <AppButton.Secondary
        text="Continue"
        color="#FF7A1B"
        onPress={() => {
          router.push({
            params: { email, password },
            pathname: "/(auth)/userDetail",
          });
        }}
        disabled={
          !validationState.hasLetter ||
          !validationState.hasNumber ||
          !validationState.hasSpecial ||
          !validationState.hasLength
        }
      />
    </View>
  );
};

const ValidationItem = ({
  isValid,
  text,
}: {
  isValid: boolean;
  text: string;
}) => (
  <View className="flex-row items-center mt-2">
    <CheckmarkCircle01Icon
      variant={isValid ? "solid" : "stroke"}
      size={24}
      color={isValid ? "green" : "gray"}
    />
    <Text className="ml-2 text-base text-gray-400">{text}</Text>
  </View>
);

export default ChoosePassword;
