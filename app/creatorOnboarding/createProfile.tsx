import { View, Text, Image, SafeAreaView, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import CreatorForm from "@/components/CreatorOnboarding/creatorProfileFlow/CreatorForm";
import { AppButton } from "@/components/app-components/button";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";
import { countries } from "@/data/data";
import api from "@/config/apiConfig";
import { CreatorFormData } from "@/types/index";

type ProfileFlowState = "INTRO" | "CREATE_PROFILE";

const CreateProfile = () => {
  const [currentFlow, setCurrentFlow] = useState<ProfileFlowState>("INTRO");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreatorFormData>({
    stageName: "",
    email: "",
    bio: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    websiteUrl: "",
    socialAccounts: {
      twitter: "",
      instagram: "",
      tiktok: "",
    },
    profileImage: ""
  });

  const { pickFile, isLoading: isUploading } = useFileUpload();
  const { flow } = useLocalSearchParams();
  const navigation = useNavigation();
  const { back } = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: currentFlow === "CREATE_PROFILE",
      headerLeft: () => (
        <AppBackButton
          name="Set up creator profile"
          onBackPress={() => {
            if (currentFlow === "CREATE_PROFILE") {
              setCurrentFlow("INTRO");
            } else {
              back();
            }
          }}
        />
      ),
      headerRight: () => null,
    });
  }, [navigation, currentFlow]);

  const validateForm = () => {
    const requiredFields = {
      'Stage name': formData.stageName,
      'Email': formData.email,
      'Profile image': formData.profileImage,
      'Genres': selectedGenres.length,
      'Country': selectedCountry
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        Alert.alert("Required Field Missing", `${field} is required`);
        return false;
      }
    }

    return true;
  };

  const handleProfileImageUpload = async () => {
    try {
      if (isUploading) return;

      const result = await pickFile(FileType.IMAGE);

      if (result?.success && result.file) {
        setFormData(prev => ({
          ...prev,
          profileImage: result?.file?.uri
        }));
      } else if (result?.error) {
        Alert.alert("Upload Failed", result.error);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      Alert.alert(
        "Upload Error",
        "Failed to upload profile image. Please try again."
      );
    }
  };

  const handleCountrySelect = (countryValue: string) => {
    const selected = countries?.find((country) => country.value === countryValue);
    if (selected) {
      setSelectedCountry(countryValue);
      setCities(selected.cities || []);
      setSelectedCity("");
    } else {
      setSelectedCountry("");
      setCities([]);
      setSelectedCity("");
    }
  };

  const handleFormChange = (field: keyof CreatorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialAccountChange = (
    platform: keyof typeof formData.socialAccounts,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: {
        ...prev.socialAccounts,
        [platform]: value
      }
    }));
  };

  const handleSubmitArtistProfile = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formPayload = {
        artistname: formData.stageName,
        email: formData.email,
        profileImage: formData.profileImage,
        bio: formData.bio,
        genres: selectedGenres,
        city: selectedCity,
        country: selectedCountry,
        address1: formData.addressLine1,
        address2: formData.addressLine2,
        postalcode: formData.postalCode,
        websiteurl: formData.websiteUrl,
        twitter: formData.socialAccounts.twitter,
        tiktok: formData.socialAccounts.tiktok,
        instagram: formData.socialAccounts.instagram
      };

      const response = await api.post('/api/artist/createartist', formPayload);

      if (response.data.status === "success") {
        back();
      } else {
        throw new Error(response.data.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error("Error submitting artist profile:", error);
      Alert.alert(
        "Submission Error",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIntro = () => (
    <View>
      <Image
        source={require("../../assets/images/createProfile.png")}
        resizeMode="cover"
        style={{ width: "90%", alignSelf: "center", marginTop: "20%" }}
      />
      <View style={{ marginTop: "30%", alignSelf: "center", gap: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#FFFFFF" }}>
          Create your profile
        </Text>
        <Text style={{ fontSize: 16, color: "#D2D3D5" }}>
          Ready to create magic? Let's get you started by setting up your
          creator profile
        </Text>
      </View>
    </View>
  );

  const handleFlow = () => {
    switch (currentFlow) {
      case "INTRO":
        return renderIntro();
      case "CREATE_PROFILE":
        return (
          <CreatorForm
            formData={formData}
            selectedGenres={selectedGenres}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            cities={cities}
            isLoading={isUploading}
            onFormChange={handleFormChange}
            onGenresChange={setSelectedGenres}
            onCountrySelect={handleCountrySelect}
            onCitySelect={setSelectedCity}
            onProfileImageUpload={handleProfileImageUpload}
            onSocialAccountChange={handleSocialAccountChange}
          />
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    switch (currentFlow) {
      case "INTRO":
        setCurrentFlow("CREATE_PROFILE");
        break;
      case "CREATE_PROFILE":
        handleSubmitArtistProfile();
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#040405" }}>
      {handleFlow()}
      <View style={{ position: "absolute", bottom: 60, right: 24, left: 24 }}>
        <AppButton.Primary
          text={currentFlow === "CREATE_PROFILE" ? "Submit Profile" : "Continue"}
          color="#A187B5"
          loading={isSubmitting || isUploading}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateProfile;
