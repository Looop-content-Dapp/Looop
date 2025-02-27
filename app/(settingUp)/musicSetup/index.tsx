import React, { useEffect, useState, memo } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useQuery } from "../../../hooks/useQuery";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import ArtistSectionList from "@/components/settingUp/ArtistSectionList";
import { showToast } from "@/config/ShowMessage";
import { setUserData } from "@/redux/slices/auth";
import { AppButton } from "@/components/app-components/button";
import api from "@/config/apiConfig";
import store from "@/redux/store";

// Step Components
const Step0 = memo(() => (
  <View style={{ alignItems: "center", paddingBottom: 20 }}>
    <Image
      source={require("../../../assets/images/audioOrange.png")}
      style={{ width: 215, height: 215, marginTop: "20%" }}
    />
    <View style={{ gap: 16, alignItems: "center", width: "90%", marginTop: "10%" }}>
      <Text style={{ fontSize: 14, fontWeight: "bold", color: "#A0A0A0", textAlign: "center" }}>
        Learning your taste
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#f4f4f4", textAlign: "center" }}>
        Before we get you started, let’s discover your music taste to recommend amazing sounds.
      </Text>
    </View>
  </View>
));

const SkeletonGenre = memo(() => (
  <View style={{ width: "33%", padding: 3 }}>
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, duration: 1000 }}
      style={{ backgroundColor: "#2e2e2e", height: 48, borderRadius: 56 }}
    />
  </View>
));

const Step1 = memo(
    ({ genres, loading, selectedInterests, setSelectedInterests }: any) => (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 24, color: "#f4f4f4", fontWeight: "bold" }}>
            What are your favorite genres?
          </Text>
          <Text style={{ fontSize: 16, color: "#A0A0A0", marginTop: 8 }}>
            Select one or more genres to discover amazing sounds.
          </Text>
        </View>
        <FlatList
          data={loading ? Array(12).fill({}) : genres}
          renderItem={({ item }) =>
            loading ? (
              <SkeletonGenre />
            ) : (
              <TouchableOpacity
                onPress={() =>
                  setSelectedInterests((prev: any) =>
                    prev.includes(item._id) ? prev.filter((id: any) => id !== item._id) : [...prev, item._id]
                  )
                }
                style={{ width: "33%", padding: 3 }}
              >
                <View
                  style={{
                    borderWidth: 1, // Add border width for all states
                    borderColor: selectedInterests.includes(item._id) ? "#FF6D1B" : "#A0A0A0", // Orange when selected, gray when not
                    backgroundColor: selectedInterests.includes(item._id) ? "#FF6D1B" : "transparent", // Background only when selected
                    padding: 16,
                    borderRadius: 56,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: selectedInterests.includes(item._id) ? "#ffffff" : "#A0A0A0" }}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          }
          numColumns={3}
          keyExtractor={(item, index) => item?._id || index.toString()}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
          }}
        />
      </View>
    )
  );

const Step2 = memo(({ artistes, loading, onFollow }: any) => (
  <View style={{ flex: 1, padding: 24 }}>
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 24, color: "#f4f4f4", fontWeight: "bold" }}>
        Based on your selections
      </Text>
      <Text style={{ fontSize: 14, color: "#D2D3D5" }}>
        Follow some artists to explore their discographies!
      </Text>
    </View>
    <ArtistSectionList sections={artistes} onFollow={onFollow} loading={loading} />
  </View>
));

const MusicOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { getGenres, getArtistBasedOnGenre, saveUserPreference, getUserById } = useQuery();

  useEffect(() => {
    if (currentStep === 1) fetchGenres();
    if (currentStep === 2) fetchArtists();
  }, [currentStep]);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getGenres();
      setGenres(data.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      showToast("Failed to load genres. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchArtists = async () => {
    if (!userdata?._id) return;
    try {
      setLoading(true);
      const artistData = await getArtistBasedOnGenre(userdata._id);
      console.log(artistData, "artistData")
      setArtistes(artistData?.data?.length > 0 && Array.isArray(artistData.data) ? artistData.data : []);
    } catch (error) {
      console.error("Error fetching artists:", error);
      showToast("Failed to load artists. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowArtist = async (artistId: string) => {
    if (!userdata?._id) return showToast("Please log in to follow artists", "error");
    try {
      setArtistes((prev) =>
        prev.map((section) => ({
          ...section,
          artists: section.artists.map((artist: any) =>
            artist.id === artistId ? { ...artist, isFavourite: !artist.isFavourite } : artist
          ),
        }))
      );
      const response = await api.post("/api/user/createuserfaveartistbasedongenres", {
        userId: userdata._id,
        faveArtist: [artistId],
      });
      if (response?.data?.status !== "success") throw new Error(response?.data?.message);
    } catch (error) {
      console.error("Error following artist:", error);
      showToast("Failed to follow artist", "error");
      setArtistes((prev) =>
        prev.map((section) => ({
          ...section,
          artists: section.artists.map((artist: any) =>
            artist.id === artistId ? { ...artist, isFavourite: !artist.isFavourite } : artist
          ),
        }))
      );
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      if (selectedInterests.length === 0) return showToast("Please select at least one genre", "error");
      try {
        await saveUserPreference(userdata?._id, selectedInterests);
        setCurrentStep(2);
      } catch (error) {
        console.error("Error saving preferences:", error);
        showToast("Failed to save preferences. Please try again.", "error");
      }
    } else if (currentStep === 2) {
      try {
    //     const res = await getUserById(userdata._id);
    //    store.dispatch(setUserData(res.data));
        router.push("/(musicTabs)");
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Failed to proceed. Please try again.", "error");
      }
    }
  };

  const steps = [
    { component: <Step0 />, buttonText: "Get Started" },
    {
      component: (
        <Step1
          genres={genres}
          loading={loading}
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
        />
      ),
      buttonText: "Continue",
    },
    { component: <Step2 artistes={artistes} loading={loading} onFollow={handleFollowArtist} />, buttonText: "Finish" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {currentStep > 0 && (
        <TouchableOpacity style={{ padding: 24 }} onPress={() => setCurrentStep((prev) => prev - 1)}>
          <ArrowLeft02Icon size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {steps[currentStep].component}
      <AppButton.Secondary
        onPress={handleNext}
        text={steps[currentStep].buttonText}
        color="#FF6D1B"
        loading={loading}
        className="absolute bottom-6 left-6 right-6 z-10 py-[16px] rounded-[56px]"
      />
    </SafeAreaView>
  );
};

export default memo(MusicOnboarding);
