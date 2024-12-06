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
} from "@hugeicons/react-native";
import { useQuery } from "../../hooks/useQuery";
import { useRouter } from "expo-router";

const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
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

  const router = useRouter();
  const { checkUsername } = useQuery();

  const validateUsername = async (username) => {
    if (!username) {
      setShowMessage("");
      return;
    }
    setLoading(true);
    const payload = { username };
    try {
      const response = await checkUsername(payload);
      if (response?.data?.existingUser === null) {
        setShowMessage("username is available");
      } else {
        setShowMessage("username is not available");
      }
    } catch (error) {
      setShowMessage("Error checking username");
    } finally {
      setLoading(false);
    }
  };

  const debouncedValidateUsername = debounce(validateUsername, 500);

  useEffect(() => {
   if(_username.length > 5){
    debouncedValidateUsername(_username);
   }
  }, [_username]);

  const validatePassword = (input) => {
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

  const handlePasswordChange = (text) => {
    setPassword(text);
    validatePassword(text);
  };

  const handleAccount = async () => {
    try {
      if (
        password &&
        validation.hasLetter &&
        validation.hasNumber &&
        validation.hasSpecialChar &&
        validation.isLongEnough
      ) {
        router.navigate({
          pathname: "/(auth)/secureAccount",
          params: {
            secrets: password,
            name: _username,
          },
        });
      }
    } catch (error) {
      console.error(error);
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
              Secure your account
            </Text>
            <Text className="text-gray-400 text-base font-PlusJakartaSansRegular">
              The safety of your account is important to us. Your password will
              be used to secure your Looop account (wallet and private key). We
              do not retain access to your private keys. Learn more about
              private keys here.
            </Text>
          </View>

          <View className="gap-y-3">
            <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
              Choose a username
            </Text>
            <TextInput
              placeholderTextColor="#787A80"
              placeholder="Enter your username"
              className="h-16 text-sm font-PlusJakartaSansRegular text-Grey/06 px-8 bg-Grey/07 rounded-full"
              value={_username}
              onChangeText={setUsername}
            />
            {loading ? (
              <ActivityIndicator size="small" color="#FFA500" />
            ) : (
              showMessage.length !== 0 && (
                <View className="flex flex-row items-center gap-2">
                  <CheckmarkCircle02Icon
                    color={
                      showMessage === "username is available" ? "#22c55e" : "#ff0000"
                    }
                    size={18}
                    variant="solid"
                  />
                  <Text
                    className={`text-${
                      showMessage === "username is available" ? "green-500" : "red-500"
                    }`}
                  >
                    {showMessage}
                  </Text>
                </View>
              )
            )}
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
                    Your password is encrypted and used to create a local backup
                    of your private key to your device so you don’t lose access
                    to your account. Think of private keys as a pin to access
                    your account/wallet.
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
              showMessage != "username is available"
            }
            className={`${
              validation.hasLetter &&
              validation.hasNumber &&
              validation.hasSpecialChar &&
              validation.isLongEnough
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
