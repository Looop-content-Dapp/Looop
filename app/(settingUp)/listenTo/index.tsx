import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import {
  ArrowRight02Icon,
  HeadphonesIcon,
  UserGroupIcon,
  ArrowLeft02Icon,
} from "@hugeicons/react-native";
import { AppButton } from "@/components/app-components/button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useGetGenre } from "@/hooks/useGenre";
import { MotiView } from "moti";
import MusicCategoryGrid from "./MusicGrid";
import type { Genre } from "@/hooks/useGenre";



const WhatDoYouListenTo = () => {
  const { data, isLoading } = useGetGenre();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigation = useNavigation();
  const router = useRouter();

  const handleGenreSelection = (genreName: string) => {
    // @ts-expect-error: Type 'string' is not assignable to type 'SetStateAction<string[]>'.
    setSelectedGenres((prev: string[]) => {
      if (prev.includes(genreName)) {
        return prev.filter((name) => name !== genreName);
      } else {
        return [...prev, genreName];
      }
    });
  };
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-[16px] text-center text-[#f4f4f4] leading-[30px] font-PlusJakartaSansBold">
          What do you listen to?
        </Text>
      ),
      headerBackTitleVisible: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft02Icon size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 items-center justify-center">
      <MusicCategoryGrid data={data?.data as Genre[]} isLoading={isLoading}
        selectedGenres={selectedGenres} 
        onSelectGenre={handleGenreSelection}
      />
      <View style={styles.buttonContinueButtonContinue}>
      <AppButton.Secondary
          text={selectedGenres.length > 0 ? `Continue (${selectedGenres.length})` : "Continue"}
          color="#FF7A1B"
          disabled={selectedGenres.length === 0}
          onPress={() => {
            router.navigate("/(settingUp)/listenTo/selection");
          }}
        />
      </View>
    </View>
  );
};

export default WhatDoYouListenTo;

const SkeletonInterest = () => (
    <View style={styles.skeletonInterestContainer}>
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={styles.skeletonInterest}
      />
    </View>
  );
const styles = StyleSheet.create({
  buttonContinueButtonContinue: {
    position: "absolute",
    bottom: hp("5%"),
    width: wp("100%"),
    backgroundColor: "#000",
    zIndex: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#040405",
  },
  setupContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  setupImage: {
    width: 215,
    height: 215,
    marginTop: "20%",
  },
  setupTextContainer: {
    gap: 16,
    alignItems: "flex-start",
    width: "90%",
    marginTop: "10%",
  },
  setupBadge: {
    padding: 8,
    borderWidth: 2,
    borderColor: "#A0A0A0",
    borderRadius: 24,
  },
  setupBadgeText: {
    fontSize: 28,
    color: "#ffffff",
    fontFamily: "PlusJakartaSansMedium",
  },
  setupDescription: {
    fontSize: 16,
    color: "#D2D3D5",
    textAlign: "left",
    fontFamily: "PlusJakartaSansRegular",
  },
  continueButton: {
    backgroundColor: "#FF7A1B",
    width: "90%",
    alignItems: "center",
    padding: 16,
    marginTop: "20%",
    borderRadius: 56,
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "PlusJakartaSansMedium",
  },
  backButton: {
    padding: 16,
  },
  interestsHeader: {
    padding: 24,
  },
  interestsTitle: {
    fontSize: 24,
    color: "#f4f4f4",
    fontFamily: "PlusJakartaSansBold",
  },
  interestsSubtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 8,
    fontFamily: "PlusJakartaSansRegular",
  },
  interestItem: {
    width: "33%",
    padding: 3,
  },
  interestButton: {
    borderWidth: 1,
    borderColor: "#A0A0A0",
    padding: 16,
    borderRadius: 56,
    alignItems: "center",
  },
  selectedInterest: {
    borderColor: "#FF6D1B",
    backgroundColor: "#FF6D1B",
  },
  interestButtonText: {
    color: "#A0A0A0",
    fontFamily: "PlusJakartaSansRegular",
  },
  selectedInterestText: {
    color: "#ffffff",
  },
  artistSection: {
    padding: 16,
  },
  artistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  artistImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  artistInfo: {
    marginLeft: 12,
    flex: 1,
  },
  artistNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  artistName: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "PlusJakartaSansBold",
  },
  verifiedBadge: {
    marginLeft: 8,
    backgroundColor: "#FF6D1B",
    padding: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "PlusJakartaSansMedium",
  },
  communityCount: {
    color: "#A0A0A0",
    fontSize: 14,
    fontFamily: "PlusJakartaSansRegular",
  },
  communityCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
  },
  communityHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  communityImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  communityInfo: {
    marginLeft: 16,
    flex: 1,
  },
  communityName: {
    fontSize: 20,
    color: "#ffffff",
    fontFamily: "PlusJakartaSansBold",
  },
  memberCount: {
    fontSize: 14,
    color: "#A0A0A0",
    fontFamily: "PlusJakartaSansRegular",
  },
  communityDescription: {
    fontSize: 14,
    color: "#787A80",
    marginVertical: 12,
    fontFamily: "PlusJakartaSansRegular",
  },
  joinButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF6D1B",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  joinButtonText: {
    color: "#FF6D1B",
    fontSize: 14,
    fontFamily: "PlusJakartaSansBold",
  },
  joinedButton: {
    backgroundColor: "#1A472A",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  joinedButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontFamily: "PlusJakartaSansBold",
  },
  joiningButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
  communitiesHeader: {
    padding: 24,
  },
  communitiesTitle: {
    fontSize: 24,
    color: "#f4f4f4",
    fontFamily: "PlusJakartaSansBold",
  },
  communitiesSubtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 4,
    fontFamily: "PlusJakartaSansRegular",
  },
  homeButton: {
    backgroundColor: "#FF6D1B",
    padding: 16,
    borderRadius: 56,
    margin: 16,
    alignItems: "center",
  },
  // Skeleton Styles
  skeletonInterestContainer: {
    width: "33%",
    padding: 3,
  },
  skeletonInterest: {
    backgroundColor: "#2e2e2e",
    height: 48,
    borderRadius: 56,
  },
  skeletonCommunityContainer: {
    width: "100%",
    padding: 10,
  },
  skeletonCommunityCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2e2e2e",
  },
  skeletonInfo: {
    marginLeft: 16,
    flex: 1,
  },
  skeletonTitle: {
    height: 20,
    width: "60%",
    backgroundColor: "#2e2e2e",
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    height: 14,
    width: "40%",
    backgroundColor: "#2e2e2e",
    borderRadius: 4,
  },
  skeletonDescription: {
    height: 40,
    width: "100%",
    backgroundColor: "#2e2e2e",
    borderRadius: 4,
    marginTop: 16,
  },
  skeletonButton: {
    height: 32,
    width: "80%",
    backgroundColor: "#2e2e2e",
    borderRadius: 16,
    marginTop: 16,
  },
});
