import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { AppBackButton } from "@/components/app-components/back-btn";
import { SafeAreaView } from "react-native";
import { ImageAdd02Icon } from "@hugeicons/react-native";
import { FormField } from "@/components/app-components/formField";
import { countries } from "@/data/data";
import useFileUpload, { FileType } from "@/hooks/useFileUpload";
import { useUpdateProfile, profileSchema, ProfileFormData } from "@/hooks/useUpdateProfile";
import { z } from "zod";

interface SignInUserData {
  _id: string;
  username: string;
  fullName?: string;
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  dateOfBirth?: string;
  favoriteGenres?: string[];
  websiteUrl?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
}

const EditProfile = () => {
  const router = useRouter();
  const { userdata } = useAppSelector((state) => state.auth);
  const { pickFile, isLoading: isUploading } = useFileUpload();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile(); // Changed isLoading to isPending

  // Ensure userdata exists before proceeding
  if (!userdata?._id) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-[#040405]">
        <AppBackButton name="Edit Profile" onBackPress={() => router.back()} />
        <View style={styles.container}>
          <Text style={styles.errorText}>User data not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Update the initial state
  const [profileData, setProfileData] = useState<ProfileFormData>(() => ({
    username: userdata.username,
    email: userdata.email,
    fullname: userdata.fullname ?? "",
    age: userdata.age ?? "",
    gender: userdata.gender ?? undefined,
    profileImage: userdata.profileImage ?? null,
    bio: userdata.bio ?? null,
    tel: userdata.tel?.toString() ?? null, // Convert to string if exists
    location: {
      country: userdata.location?.country ?? null,
      state: userdata.location?.state ?? null,
      city: userdata.location?.city ?? null
    },
    socialLinks: {
      instagram: userdata.socialLinks?.instagram ?? null,
      twitter: userdata.socialLinks?.twitter ?? null,
      facebook: userdata.socialLinks?.facebook ?? null,
      website: userdata.socialLinks?.website ?? null
    },
    preferences: {
      favoriteGenres: userdata.preferences?.favoriteGenres ?? [],
      language: userdata.preferences?.language ?? "en",
      notifications: {
        email: userdata.preferences?.notifications?.email ?? false,
        push: userdata.preferences?.notifications?.push ?? false
      }
    }
  }));

  const validateField = (field: keyof ProfileFormData, value: any) => {
    try {
      const schema = z.object({ [field]: profileSchema.shape[field] });
      schema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.errors[0].message
        }));
        return false;
      }
      return false;
    }
  };

  const handleFormChange = (field: keyof ProfileFormData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };

  // Add after useFileUpload hook initialization and before the userdata check
const handleImagePick = async () => {
    try {
      const result = await pickFile(FileType.IMAGE);
      if (result?.success && result.file) {
        handleFormChange("profileImage", result.file.uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    try {
      profileSchema.parse(profileData);

      updateProfile(
        {
          userId: userdata._id, // Now we know userdata._id exists
          data: profileData
        },
        {
          onSuccess: () => {
            Alert.alert("Success", "Profile updated successfully");
            router.back();
          },
          onError: (error: any) => {
            if (error.message) {
              try {
                const parsedErrors = JSON.parse(error.message);
                const errorObj: { [key: string]: string } = {};
                parsedErrors.forEach((err: { path: string; message: string }) => {
                  errorObj[err.path] = err.message;
                });
                setErrors(errorObj);
              } catch {
                Alert.alert("Error", "Failed to update profile");
              }
            } else {
              Alert.alert("Error", "Failed to update profile");
            }
          },
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorObj: { [key: string]: string } = {};
        error.errors.forEach(err => {
          errorObj[err.path.join('.')] = err.message;
        });
        setErrors(errorObj);
      }
    }
  };

  // Update the form fields to show errors
  const renderTextField = (
    label: string,
    field: keyof ProfileFormData,
    placeholder: string,
    options: any = {}
  ) => (
    <View>
      <FormField.TextField
        label={label}
        placeholder={placeholder}
        value={profileData[field] as string}
        onChangeText={(text) => handleFormChange(field, text)}
        error={errors[field]}
        {...options}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  const handleSocialLinkChange = (platform: keyof typeof profileData.socialLinks, value: string) => {
    const updatedSocialLinks = {
      ...profileData.socialLinks,
      [platform]: value,
    };
    handleFormChange('socialLinks', updatedSocialLinks);
  };

  // Update social links rendering
  return (
    <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-[#040405]">
      <AppBackButton name="Edit Profile" onBackPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Basic Information Section */}
        <View>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          {/* Profile Image Section - remains unchanged */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <TouchableOpacity
              style={styles.imageUpload}
              onPress={handleImagePick}
            >
              {profileData.profileImage ? (
                <Image
                  source={{ uri: profileData.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <ImageAdd02Icon size={40} color="#787A80" />
              )}
              {isUploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#FF6D1B" />
                </View>
              )}
            </TouchableOpacity>
            <View style={{ marginTop: 12, alignItems: "center" }}>
              <Text style={styles.uploadTitle}>Change Profile Photo</Text>
              <Text style={styles.uploadSubtitle}>PNG, GIF, WEBP. Max 50MB</Text>
            </View>
          </View>

          <View style={{ gap: 16 }}>
            {/* Username - remains unchanged */}
            <View>
              <FormField.TextField
                label="Username"
                placeholder="Enter username"
                value={profileData.username}
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
            </View>

            {/* Email */}
            <FormField.TextField
              label="Email"
              placeholder="Enter email"
              value={profileData.email}
              editable={false}
              style={[styles.input, styles.disabledInput]}
            />

            {/* Full Name */}
            {renderTextField("Full Name", "fullname", "Enter your full name")}

            {/* Age */}
            <View>
       <FormField.TextField
        label="Age"
        placeholder="Enter age"
        value={profileData.age}
        editable={false}
      style={[styles.input, styles.disabledInput]}
    />
  </View>

            {/* Gender */}
            <View>
              <FormField.TextField
                label="Gender"
                placeholder="Select gender"
                value={profileData.gender}
                editable={false}
                style={[styles.input, styles.disabledInput]}
              />
            </View>

            {/* Bio */}
            {renderTextField("Bio", "bio", "Tell us about yourself", {
              multiline: true,
              numberOfLines: 4,
              textAlignVertical: "top",
              style: [styles.input, { minHeight: 120 }],
            })}

            {/* Phone Number */}
            {renderTextField("Phone Number", "tel", "+1234567890", {
              keyboardType: "phone-pad",
              style: styles.input,
            })}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={{ gap: 16 }}>
            <FormField.PickerField
              label="Country"
              placeholder="Select your country"
              value={profileData.location.country ?? ""}
              onSelect={(value) => handleFormChange("location", { ...profileData.location, country: value })}
              options={countries}
            />

            <FormField.TextField
              label="State/Province"
              placeholder="Enter state/province"
              value={profileData.location.state ?? ""}
              onChangeText={(text) => handleFormChange("location", { ...profileData.location, state: text })}
            />

            <FormField.TextField
              label="City"
              placeholder="Enter your city"
              value={profileData.location.city ?? ""}
              onChangeText={(text) => handleFormChange("location", { ...profileData.location, city: text })}
            />
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={{ gap: 16 }}>
            <FormField.PickerField
              label="Language"
              placeholder="Select language"
              value={profileData.preferences.language}
              onSelect={(value) => handleFormChange("preferences", {
                ...profileData.preferences,
                language: value
              })}
              options={[
                { label: "English", value: "en" },
                { label: "Spanish", value: "es" },
                // Add more languages as needed
              ]}
            />

            {/* Add more preference fields as needed */}
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <View style={{ gap: 16 }}>
            <FormField.TextField
              label="Website"
              placeholder="Your website URL"
              value={profileData.socialLinks.website ?? ""}
              onChangeText={(text) => handleSocialLinkChange("website", text)}
            />

            <FormField.TextField
              label="Twitter"
              placeholder="@username"
              value={profileData.socialLinks.twitter ?? ""}
              onChangeText={(text) => handleSocialLinkChange("twitter", text)}
            />

            <FormField.TextField
              label="Instagram"
              placeholder="@username"
              value={profileData.socialLinks.instagram ?? ""}
              onChangeText={(text) => handleSocialLinkChange("instagram", text)}
            />

            <FormField.TextField
              label="Facebook"
              placeholder="Profile URL"
              value={profileData.socialLinks.facebook ?? ""}
              onChangeText={(text) => handleSocialLinkChange("facebook", text)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer - remains unchanged */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isUpdating || isUploading}
          style={[styles.saveButton, (isUpdating || isUploading) && styles.saveButtonDisabled]}
        >
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
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
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 183 / 2,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
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
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#1E1F25",
    backgroundColor: "#040405",
  },
  saveButton: {
    backgroundColor: "#FF6D1B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#FF6D1B50",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Bold",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 4,
  },
  input: {
    backgroundColor: "transparent",
    borderRadius: 12,
    padding: 16,
    color: "#F4F4F4",
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    borderColor: "#63656B",
    borderWidth: 0.3,
    borderStyle: "solid",
  },
  disabledInput: {
    backgroundColor: "#0A0A0A",
    opacity: 0.7,
    color: "#787A80",
  },
  helperText: {
    fontSize: 12,
    color: "#787A80",
    fontFamily: "PlusJakartaSans-Regular",
    marginTop: 4,
    marginLeft: 4,
  },
});

export default EditProfile;
