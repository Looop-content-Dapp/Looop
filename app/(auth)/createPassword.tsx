import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import {
  CheckmarkCircle01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  ViewIcon,
  ViewOffIcon,
  XVariableCircleIcon,
} from "@hugeicons/react-native";
import { useQuery } from "../../hooks/useQuery";
import { useRouter } from "expo-router";
import { AxiosError } from 'axios';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CreatePassword = () => {
  const [_username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordView, setPasswordView] = useState(false);
  const [showMessage, setShowMessage] = useState("");
  const [validation, setValidation] = useState({
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });
  console.log(showMessage, "showMessage");

  const router = useRouter();
  const { checkUsername } = useQuery();

  const validateUsername = async (username: string) => {
    // Client-side validation first
    if (!username || username.length < 5) {
      setShowMessage(username.length > 0 ? "Username must be at least 5 characters" : "");
      return;
    }

    const validUsernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!validUsernameRegex.test(username)) {
      setShowMessage("Username can only contain letters, numbers, dots and underscores");
      return;
    }

    // Only proceed with API call if client-side validation passes
    setLoading(true);
    const payload = { username };

    try {
      const response = await checkUsername(payload);
      if (response?.data?.existingUser === null) {
        setShowMessage("✓ Username is available");
      } else {
        setShowMessage("Username is already taken");
      }
    } catch (error) {
        if ((error as AxiosError).response?.status === 429) {
            setShowMessage("Too many requests, please try again later");
          } else {
        setShowMessage("Error checking username availability");
      }
      console.error("Username check error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Increase debounce delay to 800ms
  const debouncedValidateUsername = debounce(validateUsername, 800);

  useEffect(() => {
    // Only trigger validation if username is at least 3 characters
    if (_username.length >= 5) {
      debouncedValidateUsername(_username);
    } else {
      setShowMessage(_username.length > 0 ? "Username must be at least 5 characters" : "");
    }
  }, [_username]);

  const validatePassword = (input: any) => {
    const hasLetter = /[a-zA-Z]/.test(input);
    const hasNumber = /[0-9]/.test(input);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(input);
    const isLongEnough = input.length >= 12;

    setValidation({
      hasLetter,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    });
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const handleAccount = () => {
    if (
      password &&
      validation.hasLetter &&
      validation.hasNumber &&
      validation.hasSpecialChar &&
      validation.isLongEnough &&
      showMessage === "✓ Username is available"
    ) {
      router.replace({
        pathname: "/(auth)/secureAccount",
        params: {
          secrets: password,
          name: _username,
        },
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 14,
      }}
    >
      <View className="items-center">
        <Image
          source={require("../../assets/images/logo-orange.png")}
          className="w-[72px] h-[32px]"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-y-6 mt-6">
          <View className="gap-y-2">
            <Text className="text-white text-2xl font-PlusJakartaSansBold">
              Create your account
            </Text>
            <Text className="text-gray-400 text-base font-PlusJakartaSansRegular">
              The security of your account is important to us. Your password will
              be used to protect your Looop account. We use industry-standard
              encryption to keep your information safe.
            </Text>
          </View>

          <View className="gap-y-3">
            <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
              Choose a username
            </Text>
            <View className="flex-row items-center bg-Grey/07 rounded-full pr-5">
              <TextInput
                placeholderTextColor="#787A80"
                placeholder="Enter your username"
                className="h-16 text-sm font-PlusJakartaSansRegular text-Grey/06 flex-1 px-8"
                value={_username}
                onChangeText={setUsername}
              />
              {loading ? (
                <ActivityIndicator size="small" color="#FFA500" />
              ) : (
                _username.length > 0 && (
                  showMessage === "✓ Username is available" ? (
                    <CheckmarkCircle02Icon
                      color="#22c55e"
                      size={18}
                      variant="solid"
                    />
                  ) : (
                    <XVariableCircleIcon
                      color="#ef4444"
                      size={18}
                      variant="solid"
                    />
                  )
                )
              )}
            </View>
          </View>

          <View className="gap-y-4">
            <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
              Choose a password
            </Text>
            <View className="flex-row items-center bg-Grey/07 rounded-full pr-5">
              <TextInput
                placeholderTextColor="#787A80"
                placeholder="Enter your password"
                secureTextEntry={!passwordView}
                className="h-16 text-sm font-PlusJakartaSansRegular text-Grey/06 flex-1 px-8"
                value={password}
                onChangeText={handlePasswordChange}
              />
              <TouchableOpacity onPress={() => setPasswordView(!passwordView)}>
                {passwordView ? (
                  <ViewIcon size={24} color="#fff" variant="solid" />
                ) : (
                  <ViewOffIcon size={24} color="#fff" variant="solid" />
                )}
              </TouchableOpacity>
            </View>

            <View className="gap-6">
              <View className="mt-4">
                <View className="flex-row items-center">
                  {validation.hasLetter ? (
                    <CheckmarkCircle01Icon
                      variant="solid"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <CheckmarkCircle01Icon
                      variant="stroke"
                      size={24}
                      color="gray"
                    />
                  )}
                  <Text className="ml-2 text-base text-gray-400">
                    At least one letter
                  </Text>
                </View>

                <View className="flex-row items-center mt-2">
                  {validation.hasNumber ? (
                    <CheckmarkCircle01Icon
                      variant="solid"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <CheckmarkCircle01Icon
                      variant="stroke"
                      size={24}
                      color="gray"
                    />
                  )}
                  <Text className="ml-2 text-base text-gray-400">
                    At least one number
                  </Text>
                </View>

                <View className="flex-row items-center mt-2">
                  {validation.hasSpecialChar ? (
                    <CheckmarkCircle01Icon
                      variant="solid"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <CheckmarkCircle01Icon
                      variant="stroke"
                      size={24}
                      color="gray"
                    />
                  )}
                  <Text className="ml-2 text-base text-gray-400">
                    One special character
                  </Text>
                </View>

                <View className="flex-row items-center mt-2">
                  {validation.isLongEnough ? (
                    <CheckmarkCircle01Icon
                      variant="solid"
                      size={24}
                      color="green"
                    />
                  ) : (
                    <CheckmarkCircle01Icon
                      variant="stroke"
                      size={24}
                      color="gray"
                    />
                  )}
                  <Text className="ml-2 text-base text-gray-400">
                    Must be at least 12 characters
                  </Text>
                </View>
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
                    Your password is securely encrypted and stored locally on your device.
                    This helps protect your account and ensures only you can access it.
                    Think of it as your personal digital key.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAccount}
            disabled={
              !validation.hasLetter ||
              !validation.hasNumber ||
              !validation.hasSpecialChar ||
              !validation.isLongEnough ||
              showMessage !== "✓ Username is available"
            }
            className={`${
              validation.hasLetter &&
              validation.hasNumber &&
              validation.hasSpecialChar &&
              validation.isLongEnough &&
              showMessage === "✓ Username is available"
                ? "bg-orange-500"
                : "bg-gray-500"
            } items-center py-4 rounded-full`}
          >
            <Text className="text-lg font-PlusJakartaSansMedium text-white">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePassword;
