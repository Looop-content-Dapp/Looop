import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CheckmarkCircle02Icon, ImageAdd02Icon, XVariableCircleIcon } from "@hugeicons/react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { countries, genres } from "@/data/data";
import { FormField } from "@/components/app-components/formField copy";
import { CreatorFormData } from "@/types/index";
import api from "@/config/apiConfig";

const social = [
  {
    title: "X (Formerly Twitter)",
    socialIcon: <FontAwesome6 name="x-twitter" size={18} color="#FFFFFF" />,
  },
  {
    title: "Instagram",
    socialIcon: <FontAwesome name="instagram" size={18} color="#ffffff" />,
  },
  {
    title: "TikTok",
    socialIcon: <FontAwesome6 name="tiktok" size={18} color="#ffffff" />,
  },
];

type MultiSelectOption = {
  label: string;
  value: string;
};

interface CreatorFormProps {
    formData: {
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
    };
    selectedGenres: string[];
    selectedCountry: string;
    selectedCity: string;
    cities: string[];
    isLoading: boolean;
    onFormChange: (field: keyof CreatorFormData, value: any) => void
    onGenresChange: (genres: string[]) => void;
    onCountrySelect: (country: string) => void;
    onCitySelect: (city: string) => void;
    onProfileImageUpload: () => Promise<void>;
    onSocialAccountChange: (platform: "twitter" | "instagram" | "tiktok", value: string) => void
    // continue : () => Promise<any>
  }

const CreatorForm = ({
    formData,
    selectedGenres,
    selectedCountry,
    selectedCity,
    cities,
    isLoading,
    onFormChange,
    onGenresChange,
    onCountrySelect,
    onCitySelect,
    onProfileImageUpload,
    onSocialAccountChange,
}: CreatorFormProps) => {
    const [isValidating, setIsValidating] = useState(false);
    const [validationStatus, setValidationStatus] = useState(null);
    const [type, setType] = useState("");
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();

    const verifyField = async (fieldType: string, value: string) => {
        if (!value) {
            setValidationStatus(null);
            return;
        }

        setIsValidating(true);

        try {
            const payload = fieldType === 'email'
                ? { email: value, name: '' }
                : { email: '', name: value };
            const response = await fetch("https://looop-backend-vu20.onrender.com/api/artist/verify-artist-email", {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log(data);
            setValidationStatus(data?.exists);
        } catch (error) {
            console.log(`error verifying artist ${fieldType}`, error);
        } finally {
            setIsValidating(false);
        }
    };

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        if (type === 'email' && formData.email) {
            const newTimeout = setTimeout(() => verifyField('email', formData.email), 500);
            setDebounceTimeout(newTimeout);
        } else if (type === 'name' && formData.stageName) {
            const newTimeout = setTimeout(() => verifyField('name', formData.stageName), 500);
            setDebounceTimeout(newTimeout);
        }

        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [formData.email, formData.stageName, type]);

    const getStatusIcon = () => {
        if (isValidating) {
            return <ActivityIndicator size="small" color="#787A80" />;
        }
        if (validationStatus === false) {
            return <CheckmarkCircle02Icon size={18} variant="solid" color="#32BD76" />;
        }
        if (validationStatus === true) {
            return <XVariableCircleIcon size={18} color="red" variant="solid"/>;
        }
        return null;
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Basic Information Section */}
      <View style={{}}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        {/* Profile Image Upload */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <TouchableOpacity
            style={styles.imageUpload}
            onPress={onProfileImageUpload}
          >
            {formData.profileImage ? (
              <Image
                source={{ uri: formData.profileImage || formData.profileImage}}
               className="h-[183px] w-[183px] rounded-full"
              />
            ) : (
              <ImageAdd02Icon size={40} color="#787A80" />
            )}
          </TouchableOpacity>
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <Text style={styles.uploadTitle}>Upload Profile Image</Text>
            <Text style={styles.uploadSubtitle}>PNG, GIF, WEBP. Max 50MB</Text>
          </View>
        </View>

        {/* Basic Fields */}
        <View style={{ gap: 16 }}>
        <View className="relative w-full">
                        <FormField.TextField
                            label="Stage Name / Alias"
                            placeholder="Enter fullname"
                            value={formData.stageName}
                            onChangeText={(text) => {
                                onFormChange("stageName", text);
                                setType("name");
                                // Reset validation status when switching fields
                                setValidationStatus(null);
                            }}
                        />
                        {type === 'name' && (
                            <View className="absolute right-3 top-14 -translate-y-1/2">
                                {getStatusIcon()}
                            </View>
                        )}
                    </View>

                    <View className="relative w-full">
                        <FormField.TextField
                            label="Business email address"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChangeText={(text) => {
                                onFormChange("email", text);
                                setType("email");
                                // Reset validation status when switching fields
                                setValidationStatus(null);
                            }}
                        />
                        {type === 'email' && (
                            <View className="absolute right-3 top-14 -translate-y-1/2">
                                {getStatusIcon()}
                            </View>
                        )}
                    </View>


          <FormField.MultiSelectField
          description="Search and add main genres you create songs in. Don’t worry, you could always change your style later"
            label="Select Genres"
            placeholder="Try “HipHop” or “Afrobeats”"
            values={selectedGenres}
            onSelect={onGenresChange}
            options={genres}
          />
        </View>
      </View>

      {/* Location and Biography Section */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Location and Biography</Text>
        <View style={{ gap: 16 }}>
          <FormField.TextField
            label="Bio"
            placeholder="Tell us about yourself"
            value={formData.bio}
            onChangeText={(text) => onFormChange("bio", text)}
            multiline={true}
            numberOfLines={4}
          />
          <FormField.TextField
            label="Address Line 1"
            placeholder="Your house address"
            value={formData.addressLine1}
            onChangeText={(text) => onFormChange("addressLine1", text)}
          />
          <FormField.TextField
            label="Address Line 2 (Optional)"
            placeholder="Your house address"
            value={formData.addressLine2}
            onChangeText={(text) => onFormChange("addressLine2", text)}
          />
          <FormField.PickerField
            label="Country"
            placeholder="Select a country"
            value={selectedCountry}
            onSelect={onCountrySelect}
            options={countries}
          />
          {cities.length > 0 && (
            <FormField.PickerField
              label="City"
              placeholder="Select a city"
              value={selectedCity}
              onSelect={onCitySelect}
              options={cities.map((city) => ({ label: city, value: city }))}
            />
          )}
          <FormField.TextField
            label="Postal Code"
            placeholder="100100"
            value={formData.postalCode}
            onChangeText={(text) => onFormChange("postalCode", text)}
          />
        </View>
      </View>

      {/* Media & Links Section */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Media & Links</Text>
        <View style={{ gap: 16 }}>
          <FormField.TextField
            label="Website URL"
            placeholder="www.artiste.com"
            value={formData.websiteUrl}
            onChangeText={(text) => onFormChange("websiteUrl", text)}
          />
        </View>
      </View>

      {/* Social Accounts Section */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Connect Social Accounts</Text>
        <View style={styles.socialContainer}>
          {social.map((item) => (
            <TouchableOpacity key={item.title} style={styles.socialButton}>
              {item.socialIcon}
              <Text style={styles.socialText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
    flexGrow: 1,
    backgroundColor: "#0A0B0F",
  },
  sectionTitle: {
    fontSize: 20,
    color: "#A5A6AA",
    fontFamily: "PlusJakartaSans-Bold",
    marginBottom: 20,
  },
  imageUpload: {
    width: 183,
    height: 183,
    backgroundColor: "#12141B",
    borderRadius: 183 / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E1F25",
    borderStyle: "dashed",
  },
  uploadTitle: {
    fontSize: 20,
    color: "#F4F4F4",
    fontFamily: "PlusJakartaSans-Medium",
  },
  uploadSubtitle: {
    fontSize: 16,
    color: "#787A80",
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 4,
  },
  socialContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  socialButton: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
    gap: 8,
    backgroundColor: "#12141B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E1F25",
  },
  socialText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#A5A6AA",
  },
});

export default CreatorForm;
