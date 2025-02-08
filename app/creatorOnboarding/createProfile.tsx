import { View, Text, Image, SafeAreaView, Alert, ScrollView, useWindowDimensions, Platform } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import CreatorForm from "@/components/CreatorOnboarding/creatorProfileFlow/CreatorForm";
import { AppButton } from "@/components/app-components/button";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";
import { countries } from "@/data/data";
import api from "@/config/apiConfig";
import { CreatorFormData } from "@/types/index";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setArtistId, setClaimId } from "@/redux/slices/auth";
import { useSocialAuth } from '@/hooks/useSocialAuth';

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

  const { width, height } = useWindowDimensions();

  const { pickFile, isLoading: isUploading } = useFileUpload();
  const navigation = useNavigation();
  const { back } = useRouter();
  const dispatch = useAppDispatch()
  const { userdata } = useAppSelector((state) => state.auth);
  const { connectTwitter, connectInstagram, connectTikTok, isAuthenticating } = useSocialAuth();

  const handleSocialConnect = async (platform: 'twitter' | 'instagram' | 'tiktok') => {
    try {
      let result;
      switch (platform) {
        case 'twitter':
          result = await connectTwitter();
          break;
        case 'instagram':
          result = await connectInstagram();
          break;
        case 'tiktok':
          result = await connectTikTok();
          break;
      }

      if (result.profileUrl) {
        handleSocialAccountChange(platform, result.profileUrl);
        Alert.alert('Success', `Successfully connected ${platform}`);
      } else if (result.error) {
        Alert.alert('Connection Failed', result.error);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to connect ${platform}. Please try again.`);
    }
  };

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
      // Construct form payload with social media handles from form data
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
        twitter: formData.socialAccounts.twitter || "https://x.com/looop_music",
        tiktok: formData.socialAccounts.tiktok || "https://x.com/looop_music", 
        instagram: formData.socialAccounts.instagram || "https://x.com/looop_music",
        id: userdata?._id
      };

      // Make API request to create artist profile
      const { data } = await api.post('/api/artist/createartist', formPayload);

      if (data.status === "success") {
        const { artist, claimresult } = data.data;
        
        // Update redux store with new artist and claim IDs
        dispatch(setArtistId(artist?._id));
        dispatch(setClaimId(claimresult?.data?.id));
        
        // Show success message and navigate back
        Alert.alert("Success", claimresult?.message);
        back();
      } else {
        throw new Error(data.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error("Error submitting artist profile:", error);
      
      // Show user-friendly error message
      Alert.alert(
        "Profile Creation Failed",
        error instanceof Error 
          ? error.message
          : "Unable to create profile. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIntro = () => (
    <ScrollView 
      contentContainerStyle={{ 
        flexGrow: 1,
        paddingBottom: 100 // Space for the bottom button
      }}
    >
      <View style={{ 
        flex: 1,
        paddingHorizontal: width * 0.05 // 5% padding on each side
      }}>
        <Image
          source={require("../../assets/images/createProfile.png")}
          resizeMode="contain"
          style={{ 
            width: width * 0.9, // 90% of screen width
            height: height * 0.4, // 40% of screen height
            alignSelf: "center",
            marginTop: height * 0.05 // 5% of screen height
          }}
        />
        <View style={{ 
          marginTop: height * 0.05,
          alignSelf: "center",
          gap: 12,
          paddingHorizontal: 20
        }}>
          <Text style={{ 
            fontSize: Math.min(28, width * 0.07), // Responsive font size
            fontWeight: "bold",
            color: "#FFFFFF",
            textAlign: "center"
          }}>
            Create your profile
          </Text>
          <Text style={{ 
            fontSize: Math.min(16, width * 0.04), // Responsive font size
            color: "#D2D3D5",
            textAlign: "center"
          }}>
            Ready to create magic? Let's get you started by setting up your
            creator profile
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const handleFlow = () => {
    switch (currentFlow) {
      case "INTRO":
        return renderIntro();
      case "CREATE_PROFILE":
        return (
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: 100 // Space for the bottom button
            }}
          >
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
              onSocialConnect={handleSocialConnect}
             isAuthenticating={isAuthenticating}
            />
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentFlow === "INTRO") {
      setCurrentFlow("CREATE_PROFILE");
    } else {
      handleSubmitArtistProfile();
    }
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: "#040405"
    }}>
      {handleFlow()}
      <View style={{ 
        position: "absolute",
        bottom: height * 0.02, // 2% from bottom
        right: width * 0.06, // 6% from right
        left: width * 0.06, // 6% from left
        paddingBottom: Platform.OS === 'ios' ? 20 : 0 // Extra padding for iOS
      }}>
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
