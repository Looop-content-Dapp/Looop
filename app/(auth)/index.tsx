import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AppButton } from "@/components/app-components/button";
import { router } from "expo-router";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendEmailOTP } from "@/hooks/useVerifyEmail";
import AuthHeader from "@/components/AuthHeader";
import { InformationCircleIcon } from "@hugeicons/react-native";
import * as WebBrowser from "expo-web-browser";
import { Pressable } from "react-native";
import { useGoogleAuth, useAppleAuth } from "@/hooks/useSocialAuth";
import {
    useAbstraxionAccount,
    useAbstraxionSigningClient,
  } from "@burnt-labs/abstraxion-react-native";
import { useEffect } from 'react';

// Validation schema
const schema = z.object({
  email: z
    .string({ message: "Please enter a valid email address" })
    .email({ message: "Please enter a valid email address" })
    .nonempty({ message: "Email is required" }),
});

// Define form data type from schema
type FormData = z.infer<typeof schema>;

// Define mutation error type (adjust based on your API response)
interface MutationError {
  response?: {
    data: {
      message: string;
    };
  };
}

// Props for SocialButton component
interface SocialButtonProps {
  onPress: () => void;
  imageSource: ImageSourcePropType;
  text: string;
  loading?: boolean;
}

// Social Button Component
const SocialButton: React.FC<SocialButtonProps> = ({
  onPress,
  imageSource,
  text,
  loading,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    className="flex-row items-center justify-center bg-white px-4 py-2 rounded-full w-full"
    style={{ minHeight: 56 }} // Add consistent height
  >
    {loading ? (
      <ActivityIndicator size="small" color="#040405" />
    ) : (
      <>
        <Image source={imageSource} style={{ width: 40, height: 40 }} />
        <Text className="text-[#040405] font-PlusJakartaSansMedium text-[14px] ml-4">
          {text}
        </Text>
      </>
    )}
  </TouchableOpacity>
);

const EmailSignUp: React.FC = () => {
  const {
    mutate: sendOtpEmail,
    isPending,
    isError,
    error,
  } = useSendEmailOTP() as {
    mutate: (data: FormData, options: { onSuccess: () => void }) => void;
    isPending: boolean;
    isError: boolean;
    error: MutationError | null;
  };
  const { handleGoogleSignIn, loading: googleLoading, isAuthenticating } = useGoogleAuth();
  const { handleAppleSignIn, loading: appleLoading, isAuthenticating:isAppleAuthenticating } = useAppleAuth();
  const {
    data: account,
    logout,
    login,
    isConnected,
    isConnecting,
  } = useAbstraxionAccount();
  console.log(login, "login")
  const { client, signArb } = useAbstraxionSigningClient();
  console.log(account)

  const {
    control,
    handleSubmit,
    formState: { errors },
  }: UseFormReturn<FormData> = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  // Email Submit Handler
  const onSubmit = (data: FormData): void => {
    sendOtpEmail(data, {
      onSuccess: () =>
        router.navigate({
          pathname: "/(auth)/verifyEmail",
          params: { email: data.email },
        }),
    });
  };

  const handleLogin = async() => {
    try {
        console.log('User is connected and logged in', isConnected, isConnecting)
        console.log('Attempting to login with Xion...');
        await login()
        console.log('Xion login successful');

    } catch (error: any) {
        console.error('Xion login error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause
        });

        // Optionally alert the user
        Alert.alert(
            'Login Error',
            'Failed to sign in with Xion. Please try again.'
        );
    }
  }

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 px-6 gap-12">
        <View className="gap-y-20">
          <AuthHeader
            title="Welcome to Looop"
            description="We’re excited to have you in the looop. Are you ready for an amazing experience? Let’s get you started!"
          />

          {isError && (
            <View className="flex-row items-center gap-x-2">
              <InformationCircleIcon size={20} color="#FF1B1B" />
              <Text className="text-[#FF1B1B] font-PlusJakartaSansRegular text-xs">
                {error?.response?.data.message ||
                  "Failed to send email. Please try again."}
              </Text>
            </View>
          )}

          <View className="gap-y-3">
            <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
              What’s your Email?
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={{
                    backgroundColor: "#1E1E1E",
                    color: "#D2D3D5",
                    borderRadius: 10,
                    padding: 10,
                  }}
                  className="h-16 text-sm font-PlusJakartaSansRegular rounded-full px-8"
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
            />
            {errors?.email && (
              <Text className="text-red-500 text-sm font-PlusJakartaSansRegular">
                {errors.email.message}
              </Text>
            )}
          </View>

          <AppButton.Secondary
            color="#FF7A1B"
            text="Continue"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
          />

          <Text className="mt-[10px] text-center text-gray-400 font-PlusJakartaSansRegular text-sm">
            Or you can sign in with
          </Text>
        </View>

        <View className="flex-col gap-y-4">
          <SocialButton
            onPress={handleGoogleSignIn}
            imageSource={require("../../assets/images/google.png")}
            text="Sign in with Google"
            loading={googleLoading || isAuthenticating}
          />
          <SocialButton
            onPress={handleAppleSignIn}
            imageSource={require("../../assets/images/apple.png")}
            text="Sign in with Apple"
            loading={appleLoading || isAppleAuthenticating}
          />
        
        </View>

        <Pressable
          onPress={() => router.navigate("/(auth)/signin")}
          className="items-center mx-auto mt-[10%]"
        >
          <Text className="text-[14px] font-PlusJakartaSansRegular text-[#f4f4f4]">
            Already have an account?
            <Text className="text-Orange/08 underline font-PlusJakartaSansBold">
              {" "}
              Log In
            </Text>
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EmailSignUp;
