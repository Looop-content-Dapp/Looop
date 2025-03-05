import { View, Text, Image, TouchableOpacity, ImageSourcePropType, Pressable, Alert } from "react-native";
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
import api from "@/config/apiConfig";
import { AuthRequest, AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import { useLogin } from "@/hooks/useLogin";

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

const Signin: React.FC = () => {
  const { mutate: login, isPending, isError, error } = useLogin() as {
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

  const {
    control,
    handleSubmit,
    formState: { errors },
  }: UseFormReturn<FormData> = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  // Handle social sign-in with proper typing
  const handleSocialSignIn = useCallback(async (provider: "google" | "apple", token: string, email: string) => {
    setAuthLoading(true);
    try {
      const payload = {
        "channel": provider, // google or apple
        "email": email,
        "token": token
    }
      const response = await api.post("/api/user/oauth", payload)
      console.log("response from auth", response.data)
    if(response.status === 200) {
        router.navigate("/home");
    }else{
    Alert.alert("Error", "An error occurred during sign-in. Please try again later.");
    }
    } catch (err: unknown) {
      console.error(`${provider} sign-in error:`, err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Google Auth Response Handler
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        // Fetch Google user info to get email
        fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        })
          .then(response => response.json())
          .then(userInfo => {
            handleSocialSignIn("google", authentication.accessToken, userInfo.email);
          })
          .catch(error => {
            console.error('Error fetching Google user info:', error);
          });
      }
    }
  }, [response, handleSocialSignIn]);

  // Email/Password Submit Handler
  const onSubmit = (data: FormData): void => {
    login(data, {
      onSuccess: () => router.navigate("/home"),
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
      const credential: AppleAuthentication.AppleAuthenticationCredential =
        await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
      if (credential.identityToken && credential.email) {
        handleSocialSignIn("apple", credential.identityToken, credential.email);
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
            <View className="gap-y-3">
              <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
                Email Address
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

            {/* Password Input */}
            <View className="gap-y-3">
              <Text className="text-[16px] text-gray-200 font-PlusJakartaSansBold">
                Password
              </Text>
              <Controller
                control={control}
                name="password"
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
                    placeholder="Enter your password"
                    placeholderTextColor="#787A80"
                    secureTextEntry
                    keyboardAppearance="dark"
                  />
                )}
              />
              {errors?.password && (
                <Text className="text-red-500 text-sm font-PlusJakartaSansRegular">
                  {errors.password.message}
                </Text>
              )}
            </View>
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
        <Pressable onPress={() => router.navigate("/(auth)")} className="items-center mx-auto">
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
