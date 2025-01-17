import { View, Text, Image, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import CreatorForm from "@/components/CreatorOnboarding/creatorProfileFlow/CreatorForm";
import { AppButton } from "@/components/app-components/button";
import { CloudinaryConfig, FileType, UploadedFile, useFileUpload } from "@/hooks/useFileUpload";
import { countries } from "@/data/data";
import api from "@/config/apiConfig";

export interface CreatorFormData {
    stageName: string;
    email: string;
    bio: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    websiteUrl: string;
    socialAccounts: {
      twitter: string;
      instagram: string;
      tiktok: string;
    };
    profileImage?: string;
  }

type ProfileFlowState = "INTRO" | "CREATE_PROFILE";

const CreateProfile = () => {
  const [currentFlow, setCurrentFlow] = useState<ProfileFlowState>("INTRO");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
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
    }
  });

  const config: CloudinaryConfig = {
    cloudName: process.env.EXPO_CLOUD_NAME || 'dx8jul61w',
    uploadPreset: 'Looop_preset',
    apiKey: process.env.EXPO_API_KEY || '594679211891341',
    apiSecret: process.env.EXPO_API_SECRET || 'your-api-secret',
    folder: 'optional-folder-name' // optional
  };

  const { files, isLoading, error, pickFile,  } = useFileUpload(config);
  const { flow } = useLocalSearchParams()
  const navigation = useNavigation();
  const { back, push } = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: currentFlow === "CREATE_PROFILE",
      headerLeft: () => (
        <AppBackButton
          name="Set up creator profile"
          onBackPress={() => {
            if (flow === "NOT_SUBMITTED") {
              setCurrentFlow("INTRO");
            } else if(flow === "pending") {
              back();
            }
          }}
        />
      ),
      headerRight: () => null,
    });
  }, [navigation, currentFlow]);

  const handleProfileImageUpload = async () => {
    try {
      const result = await pickFile(FileType.IMAGE);
      console.log(result)
      if (result?.success && result.file?.cloudinary) {
        setFormData(prev => ({
          ...prev,
          profileImage: result?.file?.cloudinary?.secure_url
        }));
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
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

  const handleSocialAccountChange = (platform: keyof typeof formData.socialAccounts, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialAccounts: {
        ...prev.socialAccounts,
        [platform]: value
      }
    }));
  };


  const handleSubmitArtistProfiile = async() => {
    const params = {
        "artistname": formData.stageName,
        "email": formData.email,
        "profileImage": formData.profileImage, // frontend is Datto return the secure url of images uploaded
        "bio": formData.bio,
        "genres": selectedGenres,
        "city": selectedCity,
        "country": selectedCountry,
        "address1": formData.addressLine1,
        "address2": formData.addressLine2, // Optional
        "postalcode": formData.postalCode,
        "websiteurl": formData.websiteUrl, // frontend is to return the url of webpages or app profile
        "twitter":  formData.socialAccounts.twitter, // frontend is to return the url of webpages or app profile
        "tiktok": formData.socialAccounts.tiktok, // frontend is to return the url of webpages or app profile
        "instagram": formData.socialAccounts.instagram // frontend is to return the url of webpages or app profile
    }
    try {
    // if(!formData.stageName || formData.email || selectedGenres)return null
      const response = await api.post('/api/artist/createartist', {params})
      return response.data
    } catch (error) {
      console.log("error submitting artist", error)
    }
  }
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
        return <CreatorForm
            formData={formData}
            selectedGenres={selectedGenres}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            cities={cities}
            isLoading={isLoading}
            onFormChange={handleFormChange}
            onGenresChange={setSelectedGenres}
            onCountrySelect={handleCountrySelect}
            onCitySelect={setSelectedCity}
            onProfileImageUpload={handleProfileImageUpload}
            onSocialAccountChange={handleSocialAccountChange}
            continue={handleSubmitArtistProfiile}
         />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    // switch (currentFlow) {
    //   case "INTRO":
    //     setCurrentFlow("CREATE_PROFILE");
    //     break;
    //   case "CREATE_PROFILE":
    //     push("/creatorOnboarding/ContractSigning");
    //     break;
    // }
    if(flow == "NOT_SUBMITTED"){
        setCurrentFlow("CREATE_PROFILE");
    }else if(currentFlow === "CREATE_PROFILE"){
        back()
    }else if(flow === "approved"){
        push("/creatorOnboarding/ContractSigning");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#040405" }}>
      {handleFlow()}
      <View style={{ position: "absolute", bottom: 60, right: 24, left: 24 }}>
        <AppButton.Primary
          text="Continue"
          color="#A187B5"
          loading={false}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateProfile;
