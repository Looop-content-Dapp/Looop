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

const MusicOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedInterests, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artistes, setArtistes] = useState([]);
  const [followingArtists, setFollowingArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth)
  console.log(userdata?._id , "userdata")

  const {
    getGenres,
    getArtistBasedOnGenre,
    followArtist,
    fetchFollowingArtists,
    saveUserPreference,
    userID,
  } = useQuery();
  console.log(artistes)

  useEffect(() => {
    if (currentStep === 1) {
      fetchGenres();
    } else if (currentStep === 2) {
      fetchArtists();
    }
  }, []);


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



  const handleContinueWithInterests = async () => {
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
  };

  const fetchArtists = async () => {
    if (!userdata?._id) return;
    try {
      setLoading(true);
      const artistData = await getArtistBasedOnGenre(userdata?._id as string);
      if(artistData.data){
        setArtistes(artistData.data || []);
      }
    //   const followedArtistsResponse = await fetchFollowingArtists(userdata?._id);
    //   setFollowingArtists(followedArtistsResponse?.data?.artists || []);
    } catch (error) {
      console.error("Error fetching artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowArtist = async (artistId: string) => {
    try {
      if (!userdata?._id) return;
      await followArtist(userID, artistId);
      setFollowingArtists(prev =>
        prev.includes(artistId)
          ? prev.filter(id => id !== artistId)
          : [...prev, artistId]
      );
    } catch (error) {
      console.error(`Error following artist: ${error}`);
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
        renderItem={({ item }) => {
          const selected = selectedInterests.includes(item?._id);
          return loading ? (
            <SkeletonGenre />
          ) : (
            <TouchableOpacity
              onPress={() => {
                setSelectedGenres((prev: any) =>
                  prev.includes(item._id)
                    ? prev.filter((id) => id !== item._id)
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
            gap: 8
        }}
      />
      <TouchableOpacity
        onPress={handleContinueWithInterests}
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
        <ArtistSectionList
        sections={artistes}
        onFollow={handleFollowArtist}
        followingArtists={followingArtists}
      />
      )}
    </SafeAreaView>
  );
};

export default MusicOnboarding;
