import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { MotiView } from "moti";
import { router, Stack } from "expo-router";
import { useQuery } from "../../../hooks/useQuery";
import { useAppSelector } from "@/redux/hooks";
import ArtistSectionList from "@/components/settingUp/ArtistSectionList";
import api from "@/config/apiConfig";
import { showToast } from "@/config/ShowMessage";
import { setUserData } from "@/redux/slices/auth";
import { useAppDispatch } from "@/redux/hooks";
import store from "@/redux/store";
import { AppButton } from "@/components/app-components/button";
import { useNavigation } from "@react-navigation/native";
import { color } from "react-native-elements/dist/helpers";




const MusicOnboarding = () => {
  
  const navigation = useNavigation();
  
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
      setGenres(data.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
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
      } else {
        showToast("Please select at least one genre", "error");
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

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}>
            <Image
              source={require("../../../assets/images/audioOrange.png")}
              style={{ width: 215, height: 215, marginTop: "20%" }}
            />
            <View style={{ gap: 16, alignItems: "center", width: "90%", marginTop: "10%" }}>
              
                <Text className="text-sm font-PlusJakartaSansBold text-Grey/06 text-center">
                  Learning your taste
                </Text>
              
              <Text className="text-[16px] font-PlusJakartaSansBold text-[#f4f4f4] text-center">
              Before we get you started listening to all your favorite artistes, we want to get a feel for your music taste so we can recommend you amazing sounds.
              </Text>
            </View>
          </ScrollView>
        );
      case 1:
        return (
          <View style={{ flex: 1 }}>
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
                    style={{ width: "33%", padding: 3 }}
                  >
                    <View
                      style={{
                        
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
          </View>
        );
      case 2:
        return (
          <View style={{ flex: 1, padding: 24 }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 24, color: "#f4f4f4", fontWeight: "bold" }}>
                Based on your selections
              </Text>
              <Text style={{ fontSize: 14, color: "#D2D3D5" }}>
                Alright! Let's follow some artistes to start exploring their discographies
              </Text>
            </View>
            <ArtistSectionList
              sections={artistes}
              onFollow={handleFollowArtist}
              loading={loading}
            />
          </View>
        );
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Get Started";
      case 1 || 2:
        return "Continue";
      default:
        return "Next";
    }
  };

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
      {currentStep > 0 && (
        <TouchableOpacity
          style={{ padding: 24 }}
          onPress={() => setCurrentStep(prev => prev - 1)}
        >
          <ArrowLeft02Icon size={32} color="#fff" />
        </TouchableOpacity>
      )}
      {renderContent()}
      <AppButton.Secondary
         onPress={handleNext} text={`${getButtonText()}`} color="#FF6D1B" loading={false} 
         className="absolute bottom-6 left-6 right-6 z-10 py-[16px] rounded-[56px]"
      />
    </SafeAreaView>
    
  );
};

export default MusicOnboarding;
