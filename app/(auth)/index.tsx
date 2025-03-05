import { View, Text, Image, TouchableOpacity, ImageSourcePropType, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import { AppButton } from "@/components/app-components/button";
import { router } from "expo-router";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendEmailOTP } from "@/hooks/useVerifyEmail";
import AuthHeader from "@/components/AuthHeader";
import { InformationCircleIcon } from "@hugeicons/react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState, useCallback } from "react";
import { AuthRequest, AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import { Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";

// Complete WebBrowser auth session
WebBrowser.maybeCompleteAuthSession();

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
}

// Social Button Component
const SocialButton: React.FC<SocialButtonProps> = ({ onPress, imageSource, text }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-center gap-x-4 bg-white px-4 py-2 rounded-full w-full"
  >
    <Image source={imageSource} style={{ width: 40, height: 40 }} />
    <Text className="text-[#040405] font-PlusJakartaSansMedium text-[14px]">
      {text}
    </Text>
  </TouchableOpacity>
);

const EmailSignUp: React.FC = () => {
  const { mutate: sendOtpEmail, isPending, isError, error } = useSendEmailOTP() as {
    mutate: (data: FormData, options: { onSuccess: () => void }) => void;
    isPending: boolean;
    isError: boolean;
    error: MutationError | null;
  };
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Google Auth Setup with correct typing
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "776440951072-v1ncd4jb1o8arac8f541p0ghrv24v4ro.apps.googleusercontent.com",
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  }) as [
    AuthRequest | null,
    AuthSessionResult | null,
    (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>
  ];
  console.log("response", response)

  const {
    control,
    handleSubmit,
    formState: { errors },
  }: UseFormReturn<FormData> = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  // Handle social sign-in with proper typing
  const { authenticateUser, isPending: authPending } = useAuth();

  // Update handleSocialSignIn
  const handleSocialSignIn = useCallback(async (provider: "google" | "apple", token: string, email: string) => {
    setAuthLoading(true);
    try {
      authenticateUser({
        channel: provider,
        email,
        token,
      });
    } catch (err: unknown) {
      console.error(`${provider} sign-in error:`, err);
    } finally {
      setAuthLoading(false);
    }
  }, [authenticateUser]);

  // Google Auth Response Handler
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log('auth', authentication, authentication?.accessToken)
      if (authentication?.accessToken) {
        // Fetch Google user info to get email
        fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        })
          .then(response => response.json())
          .then(userInfo => {
            console.log(userInfo.email)
            handleSocialSignIn("google", authentication?.idToken, userInfo.email);
          })
          .catch(error => {
            console.error('Error fetching Google user info:', error);
          });
      }
    }
  }, [response, handleSocialSignIn]);

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

  // Apple Sign In Handler
const handleAppleSignIn = async (): Promise<void> => {
  try {
    setAuthLoading(true);
    // Check if Apple Authentication is available
    if (!AppleAuthentication.isAvailableAsync()) {
      console.error("Apple Sign-In is not available on this device.");
      return;
    }

    // Request user information including full name and email
    const credential =
      await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const credentialState = await AppleAuthentication.getCredentialStateAsync(
        credential.user
      );

    console.log("credential", credential)
    console.log("credentialState", credentialState)

    const userEmail = credential.email || `${credential.user}@privaterelay.appleid.com`;

    if (credential.identityToken) {
      handleSocialSignIn(
        "apple",
        credential.identityToken,
        userEmail
      );
    } else {
      console.error("No identity token received from Apple Sign-In");
    }
  } catch (e: unknown) {
    const error = e as { code?: string; message?: string };
    if (error.code !== "ERR_CANCELED") {
      console.error("Apple Sign In Error Details:", {
        code: error.code,
        message: error.message,
        stack: (e as Error).stack,
      });
    }
  } finally {
    setAuthLoading(false);
  }
};

  return (
    <View className="flex-1">
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
                {error?.response?.data.message || "Failed to send email. Please try again."}
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
            onPress={() => promptAsync()}
            imageSource={require("../../assets/images/google.png")}
            text="Sign in with Google"
          />
          <SocialButton
            onPress={handleAppleSignIn}
            imageSource={require("../../assets/images/apple.png")}
            text="Sign in with Apple"
          />
        </View>

        <Pressable onPress={() => router.navigate("/(auth)/signin")} className="items-center mx-auto">
            <Text className="text-[14px] font-PlusJakartaSansRegular text-[#f4f4f4]">
                Already have an account?
                 <Text className="text-Orange/08 underline font-PlusJakartaSansBold">  Log In</Text>
            </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EmailSignUp;
