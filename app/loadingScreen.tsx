import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedLogoFill from '../components/animated/AnimatedLogoFill'; // Assuming this is the logo animation component
import { ArrowLeft02Icon } from '@hugeicons/react-native';
import { router } from 'expo-router';

const LoadingScreen = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Array of words and their respective colors
  const words = [
    { text: 'Songs', color: '#FF6F61' },
    { text: 'Playlist', color: '#4CAF50' },
    { text: 'Albums', color: '#2196F3' },
  ];

  const slideAnim = useRef(new Animated.Value(50)).current; // Start position for sliding

  useEffect(() => {
    if (!animationDone) {
      // Animate the word sliding in
      const slideIn = () => {
        Animated.timing(slideAnim, {
          toValue: 0, // Slide to final position
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          // Move to next word after sliding animation is complete
          if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex((prevIndex) => prevIndex + 1);
            slideAnim.setValue(50); // Reset for next word
          } else {
            setAnimationDone(true); // Stop the animation after all words have been shown
          }
        });
      };

      slideIn(); // Trigger sliding in animation
    } else {
      // Once the text animation is done, show the final message after a short delay
      setTimeout(() => {
        setShowFinalMessage(true);
      }, 1000);
    }
  }, [currentWordIndex, animationDone, slideAnim, words.length]);

  const handleContinue = () => {
    // Handle the navigation when the "Continue" button is pressed
    router.push('/(musicTabs)');
  };

  return (
    <SafeAreaView className="flex-1 min-h-full">
      <TouchableOpacity onPress={() => router.back()} className="p-4">
        <ArrowLeft02Icon size={32} color="#fff" />
      </TouchableOpacity>

      <View className="items-center mt-[112px]">
        <AnimatedLogoFill />

        {/* Text Animation Section */}
        {!showFinalMessage ? (
          <View className="flex-row mt-4 justify-center items-center overflow-hidden h-10">
            <Text className="text-2xl font-bold text-white mr-2">Recommending</Text>
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
            Alright, you’re all set!
          </Text>
        )}

        {/* Show "Continue" button when final message appears */}
        {showFinalMessage && (
          <TouchableOpacity
            onPress={handleContinue}
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
