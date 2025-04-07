import { View, Text, Image, TouchableOpacity, ImageSourcePropType, Pressable, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AppButton } from "@/components/app-components/button";
import { router } from "expo-router";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthHeader from "@/components/AuthHeader";
import { InformationCircleIcon, ViewIcon, ViewOffIcon } from "@hugeicons/react-native";
import * as WebBrowser from "expo-web-browser";
import { useLogin } from "@/hooks/useLogin";
import { Input } from "@/components/ui/input";
import { useState } from "react";

import { useAppleAuth, useGoogleAuth } from "@/hooks/useSocialAuth";

// Complete WebBrowser auth session
WebBrowser.maybeCompleteAuthSession();

// Validation schema
const schema = z.object({
  email: z
    .string({ message: "Please enter a valid email address" })
    .email({ message: "Please enter a valid email address" })
    .nonempty({ message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .nonempty({ message: "Password is required" }),
});

// Define form data type from schema
type FormData = z.infer<typeof schema>;



// Props for SocialButton component
interface SocialButtonProps {
  onPress: () => void;
  imageSource: ImageSourcePropType;
  text: string;
  disabled?: boolean;
}


const SocialButton: React.FC<SocialButtonProps> = ({ onPress, imageSource, text, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    className={`flex-row items-center justify-center gap-x-4 ${
      disabled ? 'bg-gray-300' : 'bg-white'
    } px-4 py-2 rounded-full w-full`}
  >
    <Image source={imageSource} style={{ width: 40, height: 40 }} />
    <Text className="text-[#040405] font-PlusJakartaSansMedium text-[14px]">
      {text}
    </Text>
  </TouchableOpacity>
);

const Signin: React.FC = () => {
  const { mutate: login, isPending, isError, error } = useLogin();
  const { handleGoogleSignIn, loading: googleLoading } = useGoogleAuth();
  const { handleAppleSignIn, loading: appleLoading } = useAppleAuth();
  const [passwordView, setPasswordView] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  }: UseFormReturn<FormData> = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  // Email/Password Submit Handler
  const onSubmit = (data: FormData): void => {
    login(data, {
      onSuccess: () => router.navigate("/(musicTabs)"),
    });
  };

  return (
    <View className="flex-1">
      <View className="flex-1 px-6 gap-12">
        <View className="gap-y-[50px]">
          <AuthHeader
            title="Welcome to Looop"
            description="Sign in to your account to continue"
          />

          {isError && (
            <View className="flex-row items-center gap-x-2">
              <InformationCircleIcon size={20} color="#FF1B1B" />
              <Text className="text-[#FF1B1B] font-PlusJakartaSansRegular text-xs">
                {error?.response?.data.message || "Invalid email or password"}
              </Text>
            </View>
          )}

          <View className="gap-y-6">
            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email Address"
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
                  error={errors?.email?.message}
                />
              )}
            />

            {/* Password Input */}
            <Controller
    control={control}
    name="password"
    render={({ field: { onChange, onBlur, value } }) => (
      <View className="relative">
        <Input
          label="Password"
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          placeholder="Enter your password"
          placeholderTextColor="#787A80"
          secureTextEntry={!passwordView}
          keyboardAppearance="dark"
          error={errors?.password?.message}
        />
        <TouchableOpacity
          onPress={() => setPasswordView(!passwordView)}
          className="absolute right-4 top-[51px]"
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

          <AppButton.Secondary
            color="#FF7A1B"
            text="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
            Or continue with
          </Text>
        </View>

        {/* Social buttons remain the same */}
        <View className="flex-col gap-y-4">
          <SocialButton
            onPress={handleGoogleSignIn}
            imageSource={require("../../assets/images/google.png")}
            text="Sign in with Google"
            disabled={googleLoading}
          />
          <SocialButton
            onPress={handleAppleSignIn}
            imageSource={require("../../assets/images/apple.png")}
            text="Sign in with Apple"
            disabled={appleLoading}
          />
        </View>
        <Pressable onPress={() => router.navigate("/(auth)")} className="items-center mx-auto mt-[10%]">
            <Text className="text-[14px] font-PlusJakartaSansRegular text-[#f4f4f4]">
                Don't have an account?
                 <Text className="text-Orange/08 underline font-PlusJakartaSansBold"> Sign Up</Text>
            </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Signin;
