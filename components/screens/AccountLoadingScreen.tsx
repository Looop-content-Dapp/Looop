import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MotiView } from "moti";
import AnimatedLock from "../animated/AnimatedLock";

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

interface AccountLoadingScreenProps {
  isError?: boolean;
  errorMessage?: string;
}

const AccountLoadingScreen: React.FC<AccountLoadingScreenProps> = ({
  isError = false,
  errorMessage = ""
}) => {
  const [currentText, setCurrentText] = useState("");
  const [highlightedWords, setHighlightedWords] = useState<number[]>([]);

  useEffect(() => {
    const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
    setCurrentText(randomPhrase);

    // Start word-by-word animation
    const words = randomPhrase.split(' ');
    let currentWordIndex = 0;
    const textInterval = setInterval(() => {
      if (currentWordIndex < words.length) {
        setHighlightedWords(prev => [...prev, currentWordIndex]);
        currentWordIndex++;
      } else {
        clearInterval(textInterval);
      }
    }, 300);

    return () => clearInterval(textInterval);
  }, []);

  const renderAnimatedText = () => {
    return currentText.split(' ').map((word, index) => (
      <Text
        key={index}
        className={`text-[20px] font-PlusJakartaSansBold ${
          highlightedWords.includes(index) ? 'text-[#f4f4f4]' : 'text-gray-500'
        }`}
        style={{ marginRight: 8 }}
      >
        {word}
      </Text>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }} className="px-6">
      <View style={{ marginTop: 10 }} className="items-center">
        <AnimatedLock />
      </View>

      <View className="mt-[40px] px-4">
        {!isError ? (
          <MotiView className="items-start">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {renderAnimatedText()}
            </View>
          </MotiView>
        ) : (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            className="items-center"
          >
            <Text className="text-[20px] font-PlusJakartaSansBold text-red-500 text-center mt-2">
              Account Creation Failed
            </Text>
            <Text className="text-[16px] font-PlusJakartaSansMedium text-red-400 text-center mt-2">
              {errorMessage}
            </Text>
          </MotiView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AccountLoadingScreen;
