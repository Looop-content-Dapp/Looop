import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useQuery } from "../../hooks/useQuery";
import PaymentBottomSheet from "../../components/Subscribe/PaymentBottomsheet";
import CommunitySectionList from "@/components/settingUp/CommunitySectionList";
import { useAppSelector } from "@/redux/hooks";
import { AppButton } from "@/components/app-components/button";

// Types and Interfaces
interface Genre {
  _id: string;
  name: string;
}

interface TribePass {
  collectibleName: string;
  collectibleDescription: string;
  collectibleImage: string;
  collectibleType?: string;
}

interface Community {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  memberCount: number;
  tribePass: TribePass;
  status: string;
  isJoined?: boolean;
}

interface Artist {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  genre: string;
  verified: boolean;
  bio: string;
  communities: Community[];
  communityCount: number;
}

const CommunityOnboarding = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interests, setInterests] = useState<Genre[]>([]);
  const [communities, setCommunities] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const { userdata } = useAppSelector((state) => state.auth);

  const { getGenres, getArtistCommunitiesByGenre, saveUserPreference } =
    useQuery();

  const benefit = [
    {
      text: "Get exclusive updates and announcements.",
    },
    {
      text: "Get sneak peeks and demos of unreleased music.",
    },
    {
      text: "Access exclusive content and perks just for Tribestars.",
    },
    {
      text: "Be part of a community on your terms and connect with other fans who share your passion.",
    },
  ];

  // Effect Hooks for data fetching
  useEffect(() => {
    if (currentStep === 1) {
      fetchInterests();
    } else if (currentStep === 2) {
      fetchArtistCommunities();
    }
  }, [currentStep]);

  // Data Fetching Functions
  const fetchInterests = async () => {
    try {
      setLoading(true);
      const data = await getGenres();
      setInterests(data.data);
    } catch (error) {
      console.error("Error fetching interests:", error);
      Alert.alert("Error", "Failed to load interests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistCommunities = async () => {
    try {
      setLoading(true);
      if (!userdata?._id) throw new Error("User ID not found");
      const response = await getArtistCommunitiesByGenre(
        userdata?._id as string
      );
      if (response.data) {
        if (response?.status === "success") {
          if (response?.data?.length > 0 && Array.isArray(response.data)) {
            setCommunities(response?.data ?? []);
          } else {
            setCommunities([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching artist communities:", error);
      Alert.alert("Error", "Failed to load communities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleJoinCommunity = (community: Community, artistId: string) => {
    setSelectedCommunity(community);
    setSelectedArtistId(artistId);
    setShowPaymentSheet(true);
  };

  const handlePaymentComplete = useCallback(async () => {
    try {
      // Update the local state to reflect the joined status
      setCommunities((prevArtists) =>
        prevArtists.map((artist) => ({
          ...artist,
          communities: artist.communities.map((community) =>
            community._id === selectedCommunity?._id
              ? {
                  ...community,
                  isJoined: true,
                  memberCount: community.memberCount + 1,
                }
              : community
          ),
        }))
      );

      // Close the payment sheet
      setShowPaymentSheet(false);
      setSelectedCommunity(null);
      setSelectedArtistId(null);
    } catch (error) {
      console.error("Error updating community status:", error);
      Alert.alert(
        "Error",
        "Failed to update community status. Please try again."
      );
    }
  }, [selectedCommunity]);
  const handleInterestSelection = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleContinueWithInterests = async () => {
    if (selectedInterests.length > 0 && userdata?._id) {
      try {
        // await saveUserPreference(userdata?._id, selectedInterests);
        setCurrentStep(2);
      } catch (error) {
        console.error("Error saving preferences:", error);
        Alert.alert(
          "Error",
          "Failed to save your preferences. Please try again."
        );
      }
    }
  };

  // Render Functions

  const renderSetup = () => (
    <ScrollView contentContainerStyle={styles.setupContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
          marginTop: 71,
        }}
      >
        <Image
          source={require("../../assets/images/musicNote.png")}
          style={{
            width: 106,
            height: 106,
            resizeMode: "cover",
            marginRight: -40,
          }}
        />
        <Image
          source={require("../../assets/images/userGroup.png")}
          style={{
            width: 106,
            height: 106,
            resizeMode: "cover",
            zIndex: 1,
          }}
        />
      </View>
      <View style={styles.setupTextContainer}>
        <Text className="text-[24px] text-[#f4f4f4] font-PlusJakartaSansBold">
          What&rsquo;s Tribes?
        </Text>
        <View></View>
        <Text className="text-[14px] font-PlusJakartaSansRegular text-[#D2D3D5]">
          Tribes are an exciting way to connect with your favorite artist or
          creator on a whole new level.
        </Text>
        <Text className="text-[14px] font-PlusJakartaSansRegular text-[#D2D3D5]">
          By joining a Tribe, you can:
        </Text>
        <View className="gap-y-[7px]">
          {benefit.map((text) => (
            <View className="bg-[#12141B]  flex-row items-center gap-2 rounded-lg p-[12px]">
              <CheckmarkCircle02Icon size={16} color="#D2D3D5" />
              <Text className="text-gray-300  font-PlusJakartaSansRegular text-base break-words">
                {text.text}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/(settingUp)/listenTo")}
        style={styles.continueButton}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderInterests = () => (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setCurrentStep(0)}
      >
        <ArrowLeft02Icon size={32} color="#fff" />
      </TouchableOpacity>
      <View style={styles.interestsHeader}>
        <Text style={styles.interestsTitle}>What are you interested in?</Text>
        <Text style={styles.interestsSubtitle}>
          Select your interests to help us find the right communities for you
        </Text>
      </View>
      <FlatList
        data={loading ? Array(22).fill({}) : interests}
        renderItem={({ item }) => {
          const selected = selectedInterests.includes(item?._id);
          return loading ? (
            <SkeletonInterest />
          ) : (
            <TouchableOpacity
              onPress={() => handleInterestSelection(item._id)}
              style={styles.interestItem}
            >
              <View
                style={[
                  styles.interestButton,
                  selected && styles.selectedInterest,
                ]}
              >
                <Text
                  style={[
                    styles.interestButtonText,
                    selected && styles.selectedInterestText,
                  ]}
                >
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        numColumns={3}
        keyExtractor={(item, index) => item?._id || index.toString()}
      />
      <TouchableOpacity
        onPress={handleContinueWithInterests}
        style={[
          styles.continueButton,
          { opacity: selectedInterests.length > 0 ? 1 : 0.5 },
        ]}
        disabled={selectedInterests.length === 0}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </>
  );

  // Skeleton Components
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

  return (
    <SafeAreaView style={styles.container}>
      {currentStep === 0 && renderSetup()}
      {currentStep === 1 && renderInterests()}
      {currentStep === 2 && (
        <>
          <View className="gap-y-8px]">
            <Text className="text-[24px] text-[#f4f4f4] font-PlusJakartaSansBold">
              Based on your selections
            </Text>
            <Text className="text-[14px] font-PlusJakartaSansRegular text-[#D2D3D5]">
              Alright! Let’s follow some artistes to start exploring their
              discographies
            </Text>
          </View>
          <CommunitySectionList
            sections={communities ? communities : []}
            onFollow={handleJoinCommunity}
            followingArtists={selectedCommunity ? [selectedCommunity] : []}
          />
        </>
      )}
      {showPaymentSheet && (
        <PaymentBottomSheet
          isVisible={showPaymentSheet}
          closeSheet={() => setShowPaymentSheet(false)}
          communityData={selectedCommunity}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default CommunityOnboarding;
