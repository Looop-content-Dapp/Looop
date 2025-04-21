import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React from "react";
  import { useRouter } from "expo-router";
  import { useAppSelector } from "@/redux/hooks";
  import { AppBackButton } from "@/components/app-components/back-btn";
  import { SafeAreaView } from "react-native";
  import { useForm, Controller } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import { useNotification } from '@/context/NotificationContext';
  import { ImageUpload } from "@/components/ui/image-upload";
  import { Select } from "@/components/ui/select";
  import { Input } from "@/components/ui/input";
  import { MultiSelect } from "@/components/ui/multi-select";
  import { RadioGroup } from "@/components/ui/radio-group";
  import { countries, languages, genres } from "@/data/data";
  import { useUpdateProfile } from "@/hooks/useUpdateProfile";

  const profileSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    fullname: yup.string().optional(),
    age: yup.string().optional(),
    gender: yup.string().oneOf(['male', 'female'] as const).optional(),
    bio: yup.string().nullable().default(null),
    tel: yup.string().nullable().default(null),
    profileImage: yup.string().nullable().default(null),
    location: yup.object({
      country: yup.string().nullable().default(null),
      state: yup.string().nullable().default(null),
      city: yup.string().nullable().default(null),
    }).default({
      country: null,
      state: null,
      city: null
    }),
    socialLinks: yup.object({
      website: yup.string().nullable().default(null),
      twitter: yup.string().nullable().default(null),
      instagram: yup.string().nullable().default(null),
      facebook: yup.string().nullable().default(null),
    }).default({
      website: null,
      twitter: null,
      instagram: null,
      facebook: null
    }),
    preferences: yup.object({
      favoriteGenres: yup.array().of(yup.string()).default([]),
      language: yup.string().default('en'),
      notifications: yup.object({
        email: yup.boolean().default(false),
        push: yup.boolean().default(false),
      }).default({
        email: false,
        push: false
      }),
      currency: yup.string().oneOf(['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR'] as const).default('USD'),
      chain: yup.string().oneOf(['XION', 'STARKNET'] as const).default('XION'),
      theme: yup.string().oneOf(['light', 'dark', 'system'] as const).default('system'),
      displayMode: yup.string().oneOf(['compact', 'comfortable'] as const).default('comfortable'),
    }).default({
      favoriteGenres: [],
      language: 'en',
      notifications: {
        email: false,
        push: false
      },
      currency: 'USD',
      chain: 'XION',
      theme: 'system',
      displayMode: 'comfortable'
    })
  });

  type ProfileFormData = yup.InferType<typeof profileSchema>;

  const EditProfile = () => {
    const { showNotification } = useNotification();
    const router = useRouter();
    const { userdata } = useAppSelector((state) => state.auth);
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

    // Update the defaultValues in useForm
    const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
      resolver: yupResolver(profileSchema),
      defaultValues: {
        username: userdata?.username ?? "",
        email: userdata?.email ?? "",
        fullname: userdata?.fullname ?? "",
        bio: userdata?.bio ?? null,
        tel: userdata?.tel?.toString() ?? null,
        profileImage: userdata?.profileImage ?? null,
        location: {
          country: userdata?.location?.country ?? null,
          state: userdata?.location?.state ?? null,
          city: userdata?.location?.city ?? null,
        },
        socialLinks: {
          website: userdata?.socialLinks?.website ?? null,
          twitter: userdata?.socialLinks?.twitter ?? null,
          instagram: userdata?.socialLinks?.instagram ?? null,
          facebook: userdata?.socialLinks?.facebook ?? null,
        },
        preferences: {
          language: userdata?.preferences?.language ?? "en",
          favoriteGenres: userdata?.preferences?.favoriteGenres?.filter((genre): genre is string => genre !== undefined) ?? [],
          notifications: {
            email: userdata?.preferences?.notifications?.email ?? false,
            push: userdata?.preferences?.notifications?.push ?? false,
          },
          currency: userdata?.preferences?.currency ?? "USD",
          chain: userdata?.preferences?.chain ?? "XION",
          theme: userdata?.preferences?.theme ?? "system",
          displayMode: userdata?.preferences?.displayMode ?? "comfortable",
        },
      },
    });

    // Update the onSubmit function to ensure data is properly typed
    const onSubmit = async (data: ProfileFormData) => {
      try {
        const formattedData = {
          ...data,
          preferences: {
            ...data.preferences,
            favoriteGenres: data.preferences.favoriteGenres.filter((genre): genre is string => genre !== undefined),
          },
        };

        await updateProfile(
          {
            userId: userdata?._id || "",
            data: formattedData,
          },
          {
            onSuccess: () => {
              showNotification({
                type: 'success',
                title: 'Success',
                message: 'Profile updated successfully',
                position: 'top'
              });
              router.back();
            },
            onError: (error: any) => {
             console.error('Update Error:', error);
              showNotification({
                type: 'error',
                title: 'Update Failed',
                message: error.message || 'Failed to update profile',
                position: 'top'
              });
            },
          }
        );
      } catch (error) {
        showNotification({
          type: 'error',
          title: 'Error',
          message: 'An unexpected error occurred',
          position: 'top'
        });
      }
    };

    return (
      <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-[#040405]">
        <AppBackButton name="Edit Profile" onBackPress={() => router.back()} />
        <ScrollView contentContainerStyle={styles.container}>
          {/* Basic Information Section */}
          <View>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Controller
              control={control}
              name="profileImage"
              render={({ field: { onChange, value } }) => (
                <ImageUpload
                  label="Profile Photo"
                  description="Upload your profile picture"
                  value={value}
                  onChange={onChange}
                  error={errors.profileImage?.message}
                  type="rounded"
                  maxSize="50MB"
                  acceptedFormats="PNG, GIF, WEBP"
                />
              )}
            />

            <View style={{ gap: 16, marginTop: 20 }}>
              <Controller
                control={control}
                name="username"
                render={({ field: { value } }) => (
                  <Input
                    label="Username"
                    value={value}
                    editable={false}
                    error={errors.username?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { value } }) => (
                  <Input
                    label="Email"
                    value={value}
                    editable={false}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="fullname"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    error={errors.fullname?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Bio"
                    placeholder="Tell us about yourself"
                    value={value}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    error={errors.bio?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="tel"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Phone Number"
                    placeholder="+1234567890"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    error={errors.tel?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Location Section */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={{ gap: 16 }}>
              <Controller
                control={control}
                name="location.country"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Country"
                    options={countries.map(country => ({
                      label: country.label,
                      value: country.value
                    }))}
                    value={value}
                    onValueChange={onChange}
                    error={errors.location?.country?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="location.state"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="State/Province"
                    placeholder="Enter state/province"
                    value={value}
                    onChangeText={onChange}
                    error={errors.location?.state?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="location.city"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="City"
                    placeholder="Enter your city"
                    value={value}
                    onChangeText={onChange}
                    error={errors.location?.city?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={{ gap: 16 }}>
              <Controller
                control={control}
                name="preferences.language"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Language"
                    options={languages}
                    value={value}
                    onValueChange={onChange}
                    error={errors.preferences?.language?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="preferences.favoriteGenres"
                render={({ field: { onChange, value } }) => (
                  <MultiSelect
                    label="Favorite Genres"
                    options={genres}
                    value={value}
                    onValueChange={onChange}
                    error={errors.preferences?.favoriteGenres?.message}
                  />
                )}
              />
            </View>
          </View>

          {/* Social Links Section */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Social Links</Text>
            <View style={{ gap: 16 }}>
              <Controller
                control={control}
                name="socialLinks.website"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Website"
                    placeholder="https://your-website.com"
                    value={value}
                    onChangeText={onChange}
                    error={errors.socialLinks?.website?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="socialLinks.twitter"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Twitter"
                    placeholder="@username"
                    value={value}
                    onChangeText={onChange}
                    error={errors.socialLinks?.twitter?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="socialLinks.instagram"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Instagram"
                    placeholder="@username"
                    value={value}
                    onChangeText={onChange}
                    error={errors.socialLinks?.instagram?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="socialLinks.facebook"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Facebook"
                    placeholder="username"
                    value={value}
                    onChangeText={onChange}
                    error={errors.socialLinks?.facebook?.message}
                  />
                )}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isUpdating}
            style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
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
    footer: {
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: "#1E1F25",
      backgroundColor: "#040405",
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
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
  });

  export default EditProfile;
