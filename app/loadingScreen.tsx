import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLogoFill from '../components/animated/AnimatedLogoFill';
import { ArrowLeft02Icon } from '@hugeicons/react-native';
import { router } from 'expo-router';

interface Word {
  text: string;
  color: string;
}

interface LoadingScreenProps {
  words?: Word[];
  prefixText?: string;
  finalMessage?: string;
  showBackButton?: boolean;
  onContinue?: () => void;
  customLogo?: React.ReactNode;
  animationDuration?: number;
  delayBeforeFinal?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  words = [
    { text: 'Songs', color: '#FF6F61' },
    { text: 'Playlist', color: '#4CAF50' },
    { text: 'Albums', color: '#2196F3' },
  ],
  prefixText = "Recommending",
  finalMessage = "Alright, you're all set!",
  showBackButton = true,
  onContinue = () => router.push('/(musicTabs)'),
  customLogo,
  animationDuration = 800,
  delayBeforeFinal = 1000,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!animationDone) {
      const slideIn = () => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(() => {
          if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
            slideAnim.setValue(50);
          } else {
            setAnimationDone(true);
          }
        });
      };

      slideIn();
    } else {
      setTimeout(() => {
        setShowFinalMessage(true);
      }, delayBeforeFinal);
    }
  }, [currentWordIndex, animationDone, slideAnim, words.length, animationDuration, delayBeforeFinal]);

  return (
    <SafeAreaView className="flex-1 min-h-full">
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()} className="p-4">
          <ArrowLeft02Icon size={32} color="#fff" />
        </TouchableOpacity>
      )}

      <View className="items-center mt-[112px]">
        {customLogo || <AnimatedLogoFill />}

        {!showFinalMessage ? (
          <View className="flex-row mt-4 justify-center items-center overflow-hidden h-10">
            <Text className="text-2xl font-bold text-white mr-2">{prefixText}</Text>
            <Animated.View
              style={{ transform: [{ translateY: slideAnim }] }}
              className="h-10 justify-start"
            >
              <Text className="text-2xl font-bold" style={{ color: words[currentWordIndex].color }}>
                {words[currentWordIndex].text}
              </Text>
            </Animated.View>
          </View>
        ) : (
          <Text className="text-2xl font-bold text-white mt-8">
            {finalMessage}
          </Text>
        )}

        {showFinalMessage && (
          <TouchableOpacity
            onPress={onContinue}
            className="mt-[50%] bg-Orange/08 w-[90%] items-center py-[16px] rounded-[56px]"
          >
            <Text className="text-white text-lg">Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen;
