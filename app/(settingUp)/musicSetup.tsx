import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { MotiView } from "moti";
import { router } from "expo-router";
import { useQuery } from "../../hooks/useQuery";
import { useAppSelector } from "@/redux/hooks";
import ArtistSectionList from "@/components/settingUp/ArtistSectionList";
import api from "@/config/apiConfig";
import { showToast } from "@/config/ShowMessage";
import { setUserData } from "@/redux/slices/auth";
import { useAppDispatch } from "@/redux/hooks";
import store from "@/redux/store";

const MusicOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artistes, setArtistes] = useState<any[]>([]);
  const [followingArtists, setFollowingArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const {
    getGenres,
    getArtistBasedOnGenre,
    fetchFollowingArtists,
    saveUserPreference,
    getUserById
  } = useQuery();

  useEffect(() => {
    if (currentStep === 1) {
      fetchGenres();
    } else if (currentStep === 2) {
      fetchArtists();
    }
  }, [currentStep]);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getGenres();
      console.log(data.data, "genres");
      setGenres(data.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (selectedInterests.length > 0 && userdata?._id) {
        try {
          await saveUserPreference(userdata?._id, selectedInterests);
          setCurrentStep(2);
        } catch (error) {
          console.error("Error saving preferences:", error);
          Alert.alert(
            "Error",
            "Failed to save your preferences. Please try again."
          );
        }
      }
    } else if (currentStep === 2) {
      if (userdata) {
        const res: SignInResponse = await getUserById(userdata._id);
        dispatch(setUserData(res.data));
      }
      router.push("/(musicTabs)");
    }
  };

  const fetchArtists = async () => {
    if (!userdata?._id) return;
    try {
      setLoading(true);
      const artistData = await getArtistBasedOnGenre(userdata?._id as string);
      if (artistData.data) {
        if (artistData?.status === "success") {
          if (artistData?.data?.length > 0 && Array.isArray(artistData.data)) {
            console.log("artist", artistData?.data)
            setArtistes(artistData?.data ?? []);
          } else {
            setArtistes([]);
          }
        }
      }
      const followedArtistsResponse = await fetchFollowingArtists(userdata?._id);
      setFollowingArtists(followedArtistsResponse?.data?.artists || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

const handleFollowArtist = async (artistId: string) => {
  try {
    if (!userdata?._id) {
      showToast("Please login to follow artists", "error");
      return;
    }

    setArtistes(prevArtists => 
      prevArtists.map(section => ({
        ...section,
        artists: section.artists.map(artist => 
          artist.id === artistId 
            ? { ...artist, isFavourite: !artist.isFavourite }
            : artist
        )
      }))
    );

    const payload = {
      userId: userdata._id,
      faveArtist: [artistId]
    };

    const response = await api.post("/api/user/createuserfaveartistbasedongenres", payload);

    if (response?.data?.status !== "success") {
      setArtistes(prevArtists => 
        prevArtists.map(section => ({
          ...section,
          artists: section.artists.map(artist => 
            artist.id === artistId 
              ? { ...artist, isFavourite: !artist.isFavourite }
              : artist
          )
        }))
      );
      const errorMessage = response?.data?.message || "Failed to follow artist";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error following artist:", error);
    showToast("Failed to follow artist", "error");
  }
};

  const renderSetup = () => (
    <ScrollView
      contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
    >
      <Image
        source={require("../../assets/images/audioOrange.png")}
        style={{ width: 215, height: 215, marginTop: "20%" }}
      />
      <View
        style={{
          gap: 16,
          alignItems: "center",
          width: "90%",
          marginTop: "10%",
        }}
      >
        <View
          style={{
            padding: 8,
            borderWidth: 2,
            borderColor: "#A0A0A0",
            borderRadius: 24,
          }}
        >
          <Text style={{ fontSize: 16, color: "#808080", fontWeight: "bold" }}>
            Learning your taste
          </Text>
        </View>
        <Text style={{ fontSize: 24, color: "#f4f4f4", textAlign: "center" }}>
          Before we get you started listening to all your favorite artistes, we
          want to get a feel for your music taste so we can recommend you
          amazing sounds.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => setCurrentStep(1)}
        style={{
          backgroundColor: "#FF6D1B",
          width: "90%",
          alignItems: "center",
          padding: 16,
          marginTop: "20%",
          borderRadius: 56,
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 16 }}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderGenres = () => (
    <>
      <TouchableOpacity
        style={{ padding: 24 }}
        onPress={() => setCurrentStep(0)}
      >
        <ArrowLeft02Icon size={32} color="#fff" />
      </TouchableOpacity>
      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 24, color: "#f4f4f4", fontWeight: "bold" }}>
          What are your favorite genres?
        </Text>
        <Text style={{ fontSize: 16, color: "#A0A0A0", marginTop: 8 }}>
          Select one or more genres and we'll help you discover amazing sounds
        </Text>
      </View>
      <FlatList
        data={loading ? Array(22).fill({}) : genres}
        renderItem={({ item }: {item: any}) => {
          const selected = selectedInterests.includes(item?._id as never);
          return loading ? (
            <SkeletonGenre />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setSelectedGenres((prev: any) =>
                  prev.includes(item._id)
                    ? prev.filter((id: any) => id !== item._id)
                    : [...prev, item._id]
                );
              }}
              style={{
                width: "33%",
                padding: 3,
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: selected ? "#FF6D1B" : "#A0A0A0",
                  backgroundColor: selected ? "#FF6D1B" : "transparent",
                  padding: 16,
                  borderRadius: 56,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: selected ? "#ffffff" : "#A0A0A0" }}>
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        numColumns={3}
        keyExtractor={(item, index) => item?._id || index.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
      />
      <TouchableOpacity
        onPress={handleNext}
        style={{
          backgroundColor: "#FF6D1B",
          width: "90%",
          alignSelf: "center",
          padding: 16,
          borderRadius: 56,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#ffffff", fontSize: 16 }}>Continue</Text>
      </TouchableOpacity>
    </>
  );

  const SkeletonGenre = () => (
    <View style={{ width: "33%", padding: 3 }}>
      <MotiView
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ loop: true, duration: 1000 }}
        style={{
          backgroundColor: "#2e2e2e",
          height: 48,
          borderRadius: 56,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {currentStep === 0 && renderSetup()}
      {currentStep === 1 && renderGenres()}
      {currentStep === 2 && (
      <View className="p-[24px]">
        <View className="gap-y-8px]">
            <Text className="text-[24px] text-[#f4f4f4] font-PlusJakartaSansBold">Based on your selections</Text>
            <Text className="text-[14px] font-PlusJakartaSansRegular text-[#D2D3D5]">Alright! Let's follow some artistes to start exploring their discographies</Text>
        </View>
        <ArtistSectionList
          sections={artistes ? artistes : []}
          onFollow={handleFollowArtist}
          loading={loading}
        />
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: "#FF6D1B",
            width: "90%",
            alignSelf: "center",
            padding: 16,
            borderRadius: 56,
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#ffffff", fontSize: 16 }}>Finish</Text>
        </TouchableOpacity>
      </View>
      )}
    </SafeAreaView>
  );
};

export default MusicOnboarding;
