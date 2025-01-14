import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ImageAdd02Icon } from "@hugeicons/react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { countries, genres } from "@/data/data";
import { FormField } from "@/components/app-components/formField copy";

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

const CreatorForm = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
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
  });

  const handleCountrySelect = (countryValue: string) => {
    const selected = countries.find((country) => country.value === countryValue);
    if (selected) {
      setSelectedCountry(countryValue); // Store the value instead of label
      setCities(selected.cities || []); // Handle case where cities may be undefined
      setSelectedCity(""); // Reset selected city when country changes
    } else {
      // Handle invalid country selection
      setSelectedCountry("");
      setCities([]);
      setSelectedCity("");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Basic Information Section */}
      <View style={{}}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        {/* Profile Image Upload */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <TouchableOpacity style={styles.imageUpload}>
            <ImageAdd02Icon size={40} color="#787A80" />
          </TouchableOpacity>
          <View style={{ marginTop: 12, alignItems: "center" }}>
            <Text style={styles.uploadTitle}>Upload Profile Image</Text>
            <Text style={styles.uploadSubtitle}>PNG, GIF, WEBP. Max 50MB</Text>
          </View>
        </View>

        {/* Basic Fields */}
        <View style={{ gap: 16 }}>
          <FormField.TextField
            label="Stage Name / Alias"
            placeholder="Enter fullname"
            value={formData.stageName}
            onChangeText={(text) =>
              setFormData({ ...formData, stageName: text })
            }
          />
          <FormField.TextField
            label="Business email address"
            placeholder="example@email.com"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <FormField.MultiSelectField
          description="Search and add main genres you create songs in. Don’t worry, you could always change your style later"
            label="Select Genres"
            placeholder="Try “HipHop” or “Afrobeats”"
            values={selectedGenres}
            onSelect={(values) => setSelectedGenres(values)}
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
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            multiline={true}
            numberOfLines={4}
          />
          <FormField.TextField
            label="Address Line 1"
            placeholder="Your house address"
            value={formData.addressLine1}
            onChangeText={(text) =>
              setFormData({ ...formData, addressLine1: text })
            }
          />
          <FormField.TextField
            label="Address Line 2 (Optional)"
            placeholder="Your house address"
            value={formData.addressLine2}
            onChangeText={(text) =>
              setFormData({ ...formData, addressLine2: text })
            }
          />
          <FormField.PickerField
            label="Country"
            placeholder="Select a country"
            value={selectedCountry}
            onSelect={handleCountrySelect}
            options={countries}
          />
          {cities.length > 0 && (
            <FormField.PickerField
              label="City"
              placeholder="Select a city"
              value={selectedCity}
              onSelect={(city) => setSelectedCity(city)}
              options={cities.map((city) => ({ label: city, value: city }))}
            />
          )}
          <FormField.TextField
            label="Postal Code"
            placeholder="100100"
            value={formData.postalCode}
            onChangeText={(text) =>
              setFormData({ ...formData, postalCode: text })
            }
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
            onChangeText={(text) =>
              setFormData({ ...formData, websiteUrl: text })
            }
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
