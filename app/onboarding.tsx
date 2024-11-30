import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  logowhite,
  onboard1,
  onboard2,
  onboard3,
  onboard4,
  vector1,
  vector2,
  vector3,
} from "../assets/images/images";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { router } from "expo-router";
import { useAppDispatch } from "@/redux/hooks";
import { updateOnBoarded } from "@/redux/slices/miscelleaneous";

export default function OnBoardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#FF6D1B");
  const [backgrounImage, setBackgroundImage] = useState<any | undefined>(
    vector1
  );
  const dispatch = useAppDispatch();
  const [onBoardImage, setOnboardImage] = useState<any | undefined>(onboard1);
  const [title, setTitle] = useState<string | undefined>(
    "The community app for all the real music lovers"
  );
  const [desc, setDesc] = useState<string | undefined>(
    "Discover amazing music and people and connect with them"
  );
  const [active, setActive] = useState<string | undefined>("#FF8A49");
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const onBoardingSteps = [
    {
      title: "The community app for all the real music lovers",
      description: "Discover amazing music and people and connect with them",
      image: onboard1,
      backgroundColor: "#FF6D1B",
      Vector: vector1,
      activeColor: "#FF8A49",
    },
    {
      title: "The cool way to listen to music",
      description:
        "Enjoy amazing music from across the world with your friends and meet new people vibing on your frequency",
      image: onboard2,
      backgroundColor: "#2DD881",
      Vector: vector2,
      activeColor: "#57E09A",
    },
    {
      title: "Connect with your favorite artistes and discover new talent",
      description:
        "Connect with your faves and discover thousands of new talents across the globe",
      image: onboard3,
      backgroundColor: "#8D4FB4",
      Vector: vector3,
      activeColor: "#A187B5",
    },
    {
      title: "Experience music like you never have before",
      description: "",
      image: onboard4,
      backgroundColor: "#040405",
      Vector: null,
      activeColor: "#333",
    },
  ];

  const animateTransition = (nextStep: number) => {
    // Fade out current content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update content
      setCurrentStep(nextStep);
      slideAnim.setValue(50);

      // Fade in new content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  useEffect(() => {
    const step = onBoardingSteps[currentStep];
    setBackgroundColor(step.backgroundColor);
    setBackgroundImage(step.Vector);
    setOnboardImage(step.image);
    setTitle(step.title);
    setDesc(step.description);
    setActive(step.activeColor);
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep < onBoardingSteps.length - 1) {
      animateTransition(currentStep + 1);
    }
  };

  const completeOnboarding = () => {
    dispatch(updateOnBoarded());
    router.navigate("/(auth)/");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: backgroundColor }]}
    >
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View className="items-center flex-1 w-full">
        <Image
          source={logowhite}
          resizeMode="cover"
          className="w-[72.20px] h-[32px] my-[20px]"
        />

        <Animated.View
          className="flex-1 w-full"
          style={{
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {currentStep !== 3 && (
            <Image
              source={backgrounImage}
              className=" "
              resizeMode="cover"
              style={{ height: hp("25%"), width: wp("100%") }}
            />
          )}

          <Image
            source={onBoardImage}
            className={`${
              currentStep === 3
                ? "rounded-[30px]  mx-auto  mt-[10px]"
                : "absolute -top-0  flex-shrink"
            }`}
            style={{
              width: currentStep === 3 ? wp("95%") : wp("100%"),
              height: currentStep === 3 ? hp("39%") : hp("45%"),
            }}
            resizeMode={currentStep === 3 ? "cover" : undefined}
          />

          <View style={{ width: wp("90%") }} className="mx-auto">
            <Text
              className={`${
                currentStep === 3
                  ? "text-center md:text-[28px] pt-[24px] w-full"
                  : "mt-[45%]"
              } leading-[30px] text-[24px] font-PlusJakartaSansBold text-[#fff] font-bold`}
            >
              {title}
            </Text>
            <Text className="font-PlusJakartaSans-Light text-[16px] text-[#FBFEFC]">
              {desc}
            </Text>
          </View>

          <View className="flex-row justify-center mt-12">
            {onBoardingSteps.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 72,
                  height: 6,
                  borderRadius: 3,
                  marginHorizontal: 4,
                  backgroundColor: index <= currentStep ? "white" : active,
                }}
              />
            ))}
          </View>
        </Animated.View>

        {currentStep === 3 ? (
          <View className="w-[85%] relative -top-14 gap-6 mb-1">
            <TouchableOpacity
              onPress={() => completeOnboarding()}
              className="bg-white items-center justify-center py-[16px] rounded-[56px] w-full"
            >
              <Text
                className="font-normal font-PlusJakartaSans-Bold  text-center px-4"
                style={{ color: backgroundColor }}
              >
                Create Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => completeOnboarding()}
              className="bg-[#12141B] items-center justify-center py-[16px] rounded-[56px] w-full"
            >
              <Text className="font-normal font-PlusJakartaSans-Bold text-center text-[#787A80] px-4">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{ width: wp("95%") }}
            onPress={handleNextStep}
            className="bg-white items-center px-[158px] py-[16px] mb-12 rounded-[24px]"
          >
            <Text
              className="font-normal font-PlusJakartaSans-Bold"
              style={{ color: backgroundColor }}
            >
              Next
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: hp("100%"),
  },
});
