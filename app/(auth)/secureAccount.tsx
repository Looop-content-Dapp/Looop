import { View, Text, TouchableOpacity } from "react-native";
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
import store from "@/redux/store";

const loadingPhrases = [
  "Your Meta Account seamlessly bridges you into a world of music, community, and creative tribes, connecting your passions like never before.",
  "Dive into the rhythm of Looop, where meta accounts empower you to join a community of music lovers and creators collaborating in harmony.",
  "Unlock a universe of sound and connection — Looop brings tribes together through innovative tools and shared passion for music.",
  "From your Meta Account to your favorite tracks, Looop is where vibrant communities meet limitless creative expression.",
  "Join a global tribe united by the power of music and community, amplified by the simplicity of your Meta Account.",
  "Experience a new kind of connection — Looop combines meta accounts, music, and thriving communities to fuel your creative journey.",
  "In Looop, music is more than sound; it's a force that connects communities, empowers creators, and builds lasting tribes.",
  "Create, connect, and grow with Looop — a platform that blends music, meta accounts, and meaningful community interactions.",
  "Your journey starts here: meta accounts, music streaming, and artist communities come together to create something extraordinary.",
  "Empower your creative side with Looop — a hub for tribes to thrive, music to inspire, and communities to flourish."
];

const SecureAccount = () => {
  const { secrets, name } = useLocalSearchParams();
  const { createAccount } = useQuery();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const [showFinalStep, setShowFinalStep] = useState(false);
  const [creationFailed, setCreationFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);

  useEffect(() => {
    const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
    setCurrentText(randomPhrase);
  }, []);

  useEffect(() => {
    const handleCreateAccount = async () => {
      const user = await account.get();
      try {
        if (!user.email) {
          throw new Error("Email address not found");
        }

        if (!secrets) {
          throw new Error("Secrets not provided");
        }

        // Start word-by-word animation
        const words = currentText.split(' ');
        let currentWordIndex = 0;
        const textInterval = setInterval(() => {
          if (currentWordIndex < words.length) {
            setHighlightedWords(prev => [...prev, currentWordIndex]);
            currentWordIndex++;
          } else {
            clearInterval(textInterval);
          }
        }, 300);

        const accountRes = await createAccount(user.email, secrets as string, name as string);

        if (
          accountRes &&
          accountRes.data &&
          accountRes.data.user &&
          accountRes.data.user._id
        ) {
          store.dispatch(setUserData(accountRes.data.user));
          setShowFinalStep(true);
          setCreationFailed(false); // Reset failure state when successful
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error creating account:", error);
        if (!showFinalStep) { // Only show error if not already successful
          setCreationFailed(true);
          setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
        }
      }
    };

    if (secrets && name) {
      handleCreateAccount();
    } else {
      if (!showFinalStep) { // Only show error if not already successful
        setCreationFailed(true);
        setErrorMessage("Missing required information");
      }
    }
  }, [secrets, name, currentText]);

  const handleBackPress = () => {
    setCreationFailed(false);
    navigation.goBack();
  };

  const renderAnimatedText = () => {
    return currentText.split(' ').map((word, index) => (
      <Text
        key={index}
        className={`text-[24px] font-PlusJakartaSansBold ${
          highlightedWords.includes(index) || showFinalStep ? 'text-[#f4f4f4]' : 'text-gray-500'
        }`}
        style={{ marginRight: 8 }}
      >
        {word}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%", paddingHorizontal: 24 }}>
      {creationFailed && !showFinalStep && (
        <TouchableOpacity onPress={handleBackPress} className="mt-[10px]">
          <ArrowLeft02Icon size={32} color="#FFFFFF" variant="stroke" />
        </TouchableOpacity>
      )}
      
      <View style={{ marginTop: 157 }} className="items-center">
        <AnimatedLock />
      </View>

      <View className="mt-[40px] px-4">
        {!showFinalStep && !creationFailed && (
          <MotiView className="items-start ">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',  }}>
              {renderAnimatedText()}
            </View>
          </MotiView>
        )}

        {showFinalStep && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            className="items-center"
          >
            <CheckmarkBadge01Icon size={20} variant="solid" color="#57E09A" />
            <Text className="text-[16px] font-PlusJakartaSansBold text-Grey/06 text-center mt-2">
             Time to explore awesome Sounds
            </Text>
          </MotiView>
        )}

        {creationFailed && !showFinalStep && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            className="items-center"
          >
            <CheckmarkBadge01Icon size={20} variant="solid" color="#FF4D4D" />
            <Text className="text-[20px] font-PlusJakartaSansBold text-red-500 text-center mt-2">
              Account Creation Failed
            </Text>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-red-400 text-center mt-2">
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
