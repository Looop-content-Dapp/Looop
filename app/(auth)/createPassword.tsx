import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";
import {
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/react-native";
import { useQuery } from "../../hooks/useQuery";
import { useRouter } from "expo-router";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername]= useState("")
  const [passwordView, setPasswordView] = useState(false);
  const [validation, setValidation] = useState({
    hasLetter: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });
  const router = useRouter();
  const { checkUsername} = useQuery()

  // Function to validate the password
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


  const handleUsername = async() => {
    const res =  await checkUsername(username)
        console.log("check", res)
 }

 useEffect(() => {
    handleUsername()
 }, [username])


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
            name: username
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
        maxHeight: "100%",
      }}
    >
      <View className="items-center">
        <Image
          source={require("../../assets/images/logo-orange.png")}
          className="w-[72px] h-[32px]"
        />
      </View>

      <View className="gap-y-12 mt-6">
        <View className="gap-y-2 pt-6">
          <Text className="text-white text-2xl font-PlusJakartaSansBold">
            Secure your account
          </Text>
          <Text className="text-gray-400 text-base font-PlusJakartaSansRegular">
            The safety of your account is important to us. Your password will be
            used to secure your Looop account (wallet and private key). We do
            not retain access to your private keys. Learn more about private
            keys here.
          </Text>
        </View>


          <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
            Choose a username
          </Text>
          <View className="flex-row items-center bg-Grey/07 rounded-full pr-5">
            <TextInput
              placeholderTextColor="#787A80"
              placeholder="Enter your password"
              className="h-16 text-sm font-PlusJakartaSansRegular text-Grey/06 flex-1 px-8"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View className="gap-y-3">
          <Text className="text-lg text-gray-200 font-PlusJakartaSansBold">
            Choose a password
          </Text>
          <View className="flex-row items-center bg-Grey/07 rounded-full pr-5">
            <TextInput
              placeholderTextColor="#787A80"
              placeholder="Enter your password"
              secureTextEntry={passwordView}
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

          {/* Password requirements */}
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
          <View className="bg-[#2A1708] p-[12px] flex-row items-start gap-[12px] min-w-[382px] max-w-full rounded-[12px] overflow-hidden">
            <InformationCircleIcon size={24} color="#EC6519" variant="stroke" />
            <Text className="text-[14px] text-[#EC6519] font-PlusJakartaSansRegular flex-shrink">
              Your password is encrypted and used to create a local backup of
              your private key to your device so you don’t lose access to your
              account. Think of private keys as a pin to access your
              account/wallet.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAccount}
          disabled={
            !validation.hasLetter ||
            !validation.hasNumber ||
            !validation.hasSpecialChar ||
            !validation.isLongEnough
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
    </SafeAreaView>
  );
};

export default CreatePassword;
