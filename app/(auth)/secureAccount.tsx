import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon, CheckmarkBadge01Icon } from "@hugeicons/react-native";
import { useNavigation } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import AnimatedLock from "../../components/animated/AnimatedLock";
import { useQuery } from "../../hooks/useQuery";
import { MotiView } from "moti";
import { account } from "../../appWrite";
import { setUserData } from "@/redux/slices/auth";
import { useAppDispatch } from "@/redux/hooks";

const SecureAccount = () => {
  const { secrets, name } = useLocalSearchParams();
  const { createAccount, storeUserId, deleteUserId } = useQuery();
  const navigation = useNavigation();

  const steps = [
    "Creating wallet",
    "Encrypting password",
    "Generating private key",
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [showFinalStep, setShowFinalStep] = useState(false);
  const [creationFailed, setCreationFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();


  useEffect(() => {
    const handleCreateAccount = async () => {
      const user = await account.get();
      try {
        // Start animation steps
        for (let i = 0; i < steps.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setCurrentStep((prev) => prev + 1);
        }

        if (!user.email) {
          throw new Error("Email address not found");
        }

        if (!secrets) {
          throw new Error("Secrets not provided");
        }

        // Call createAccount endpoint
        const accountRes = await createAccount(user.email, secrets as string, name as string);

        console.log("Account creation response:", accountRes);

        // Proceed only if account creation is successful
        if (
          accountRes &&
          accountRes.data &&
          accountRes.data.user &&
          accountRes.data.user._id
        ) {
          await deleteUserId();
          await storeUserId(accountRes.data.user._id);
          setShowFinalStep(true); // Show "Wallet Created" message
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error creating account:", error);
        setCreationFailed(true);
        setErrorMessage(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }
    };

    if (secrets && name) {
      handleCreateAccount();
    } else {
      setCreationFailed(true);
      setErrorMessage("Missing required information");
    }
  }, [secrets]);

  const handleBackPress = () => {
    setCurrentStep(0);
    setCreationFailed(false);
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%", paddingHorizontal: 24 }}>
      {creationFailed && (
        <TouchableOpacity onPress={handleBackPress} className="mt-[10px]">
          <ArrowLeft02Icon size={32} color="#FFFFFF" variant="stroke" />
        </TouchableOpacity>
      )}
      <View style={{ marginTop: 157 }} className="items-center ">
        <AnimatedLock />
      </View>

      <Text className="text-[24px] font-PlusJakartaSansBold text-Grey/04 text-center mt-[40px]">
        Securing your account
      </Text>

      <View className="mt-[31px]">
        {!showFinalStep &&
          !creationFailed &&
          steps.map((step, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{
                opacity: index <= currentStep ? 1 : 0,
                translateY: 0,
              }}
              transition={{ type: "timing", duration: 500 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <CheckmarkBadge01Icon
                size={20}
                variant="solid"
                color={index <= currentStep ? "#57E09A" : "#B0B0B0"}
              />
              <Text
                className={`text-[20px] font-PlusJakartaSansBold text-center ${
                  index <= currentStep ? "text-Grey/06" : "text-Grey/04"
                } ml-2`}
              >
                {step}
              </Text>
            </MotiView>
          ))}

        {showFinalStep && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <CheckmarkBadge01Icon size={20} variant="solid" color="#57E09A" />
            <Text className="text-[20px] font-PlusJakartaSansBold text-Grey/06 text-center ml-2">
              Wallet Created
            </Text>
          </MotiView>
        )}

        {creationFailed && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckmarkBadge01Icon size={20} variant="solid" color="#FF4D4D" />
              <Text className="text-[20px] font-PlusJakartaSansBold text-center text-red-500 ml-2">
                Wallet Creation Failed
              </Text>
            </View>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-center text-red-400 mt-2">
              {errorMessage}
            </Text>
          </MotiView>
        )}
      </View>

      {showFinalStep && (
        <TouchableOpacity
          onPress={() => router.push("/(settingUp)")}
          className="bg-orange-500 items-center py-4 rounded-full mt-[126px]"
        >
          <Text className="text-lg font-PlusJakartaSansMedium text-white">
            Continue
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default SecureAccount;
