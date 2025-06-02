import { View, Text, ImageBackground, StyleSheet, Share } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Link05Icon } from "@hugeicons/react-native";
import * as Contacts from "expo-contacts";
import * as Sharing from 'expo-sharing';
import { useAppSelector } from "@/redux/hooks";
import api from "@/config/apiConfig";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const Friends = () => {
  const [contacts, setContacts] = useState([]);
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userdata } = useAppSelector((auth) => auth.auth);

  const handleFetchReferral = async () => {
    if (!userdata?._id) return;
    try {
      setIsLoading(true);
      const response = await api.get(`/api/referral/${userdata?._id}`);
      setReferralData(response.data.data);
    } catch (error) {
      console.error('Error fetching referral:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const message = `Join me on Looop! Use my referral code: ${referralData?.code}\n\nDownload the app here: [Your App Store Link]`;
      const result = await Share.share(
        {
          message: message,
          title: 'Share Looop with friends',
        },
      );
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  useEffect(() => {
    handleFetchReferral();
  }, [userdata?._id]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  const SkeletonLoader = () => {
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withRepeat(
          withSequence(
            withTiming(0.5, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          true
        ),
      };
    });

    return (
      <View className="items-center">
        <Animated.View
          style={[
            { width: wp("90%") },
            animatedStyle
          ]}
          className="h-[160px] rounded-[24px] overflow-hidden"
        >
          <LinearGradient
            colors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            className="w-full h-full"
          />
        </Animated.View>
      </View>
    );
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <View className="items-center">
      <ImageBackground
        source={require("@/assets/images/friends.png")}
        style={{ width: wp("90%") }}
        className="h-[160px] rounded-[24px] pt-[40px] pl-[20px] overflow-hidden"
      >
        <View className="">
          <Text className="text-[20px] font-PlusJakartaSansBold text-Grey/07 leading-[30px]">
            Looop is fun-er with friends
          </Text>
          <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07 leading-[30px]">
            Invite friends and unlock future rewards!
          </Text>
        </View>
        <View className="absolute right-6 bottom-4">
          <TouchableOpacity onPress={handleShare} className="item bg-[#fff] px-[16px] py-[12px] flex-row items-center rounded-[24px] gap-x-[8px]">
            <Link05Icon size={16} color="#0A0B0F" variant="stroke" />
            <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07">
              Invite friends
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Friends;
