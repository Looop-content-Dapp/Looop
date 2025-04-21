import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useMemo } from "react";
import {
  CheckmarkCircle02Icon,
  ImageAdd02Icon,
  XVariableCircleIcon,
} from "@hugeicons/react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { countries } from "@/data/data";
import { CreatorFormData } from "@/types/index";
import { useGetGenre } from "@/hooks/useGenre";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useTwitterAuth from "@/hooks/useTwitterAuth";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Select } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";

const validationSchema = yup.object().shape({
  stageName: yup.string().required("Stage name is required"),
  bio: yup.string().required("Bio is required"),
  addressLine1: yup.string().required("Address is required"),
  addressLine2: yup.string(),
  postalCode: yup.string().required("Postal code is required"),
  websiteUrl: yup.string().url("Please enter a valid URL"),
  selectedGenres: yup.array().min(1, "Please select at least one genre"),
  selectedCountry: yup.string().required("Please select a country"),
  selectedCity: yup.string().when('selectedCountry', {
    is: (value: string) => Boolean(value),
    then: (schema) => schema.required('Please select a city'),
    otherwise: (schema) => schema
  }),
});

interface CreatorFormProps {
    formData: CreatorFormData;
    selectedGenres: string[];
    selectedCountry: string;
    selectedCity: string;
    cities: string[];
    isLoading: boolean;
    onFormChange: (field: keyof CreatorFormData, value: any) => void;
    onGenresChange: (genres: string[]) => void;
    onCountrySelect: (country: string) => void;
    onCitySelect: (city: string) => void;
    onProfileImageUpload: () => Promise<void>;
    onSocialAccountChange: (
      platform: "twitter" | "instagram" | "tiktok",
      value: string
    ) => void;
  }

type Genre = string;
interface SelectOption {
    label: string;
    value: string;
  }

  interface MultiSelectOption {
    label: string;
    value: string;
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
  const { data } = useGetGenre();
  const {
    isVerified,
    userData,
    loading,
    error,
    startVerification
  } = useTwitterAuth();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      stageName: formData.stageName,
      bio: formData.bio,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      postalCode: formData.postalCode,
      websiteUrl: formData.websiteUrl,
      selectedGenres,
      selectedCountry,
      selectedCity,
    }
  });

  error && console.error("Twitter verification error:", error);
  const genres = data?.data || [];

  const genreOptions = useMemo(() =>
    (genres || []).map(genre => ({
      label: String(genre.name),
      value: String(genre.name)
    })),
    [genres]
  );

  console.log("genres", genreOptions[0])
//   console.log("genre", genres)

  const countryOptions = useMemo(() =>
    countries.map(country => ({
      label: country.label,
      value: country.value
    })),
    [countries]
  );

  const cityOptions = useMemo(() =>
    cities.map(city => ({
      label: city,
      value: city
    })),
    [cities]
  );

  const social = [
    {
      id: 'twitter',
      title: "X (Formerly Twitter)",
      placeholder: "Enter your X username",
      icon: <FontAwesome6 name="x-twitter" size={18} color="#63656B" />,
      baseUrl: "https://twitter.com/"
    },
    {
      id: 'instagram',
      title: "Instagram",
      placeholder: "Enter your Instagram username",
      icon: <FontAwesome name="instagram" size={18} color="#63656B" />,
      baseUrl: "https://instagram.com/"
    },
    {
      id: 'tiktok',
      title: "TikTok",
      placeholder: "Enter your TikTok username",
      icon: <FontAwesome6 name="tiktok" size={18} color="#63656B" />,
      baseUrl: "https://tiktok.com/@"
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View className="my-[16px]">
        <ImageUpload
          label="Profile Image"
          value={formData.profileImage ? {
            uri: formData.profileImage,
            type: 'image',
            name: 'profile-image'
          } : null}
          onChange={onProfileImageUpload}
          description="PNG, GIF, WEBP. Max 50MB"
        />
      </View>

        <View style={{ gap: 16 }}>
          <Controller
            control={control}
            name="stageName"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Stage Name / Alias"
                placeholder="Enter fullname"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onFormChange("stageName", text);
                }}
                error={errors.stageName?.message}
              />
            )}
          />

<Controller
  control={control}
  name="selectedGenres"
  render={({ field: { onChange, value } }) => (
    <MultiSelect
      label="Select Genres"
      description="Search and add main genres you create songs in. Don't worry, you could always change your style later"
      options={genreOptions}
      value={value || []}
      onValueChange={(newValue) => {
        onChange(newValue);
        onGenresChange(newValue);
      }}
      error={errors.selectedGenres?.message}
    />
  )}
/>
        </View>
      </View>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Location and Biography</Text>
        <View style={{ gap: 16 }}>
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Bio"
                placeholder="Tell us about yourself"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onFormChange("bio", text);
                }}
                multiline
                numberOfLines={4}
                error={errors.bio?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="addressLine1"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Address Line 1"
                placeholder="Your house address"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onFormChange("addressLine1", text);
                }}
                error={errors.addressLine1?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="addressLine2"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Address Line 2 (Optional)"
                placeholder="Your house address"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onFormChange("addressLine2", text);
                }}
                error={errors.addressLine2?.message}
              />
            )}
          />

<Controller
  control={control}
  name="selectedCountry"
  render={({ field: { onChange, value } }) => (
    <Select
      label="Country"
      options={countryOptions}
      value={value || ''}
      onValueChange={(newValue) => {
        onChange(newValue);
        onCountrySelect(newValue);
      }}
      error={errors.selectedCountry?.message}
    />
  )}
/>

{cities.length > 0 && (
  <Controller
    control={control}
    name="selectedCity"
    render={({ field: { onChange, value } }) => (
      <Select
        label="City"
        options={cityOptions}
        value={value || ''}
        onValueChange={(newValue) => {
          onChange(newValue);
          onCitySelect(newValue);
        }}
        error={errors.selectedCity?.message}
      />
    )}
  />
)}

          <Controller
            control={control}
            name="postalCode"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Postal Code"
                placeholder="100100"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onFormChange("postalCode", text);
                }}
                error={errors.postalCode?.message}
              />
            )}
          />
        </View>
      </View>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Media & Links</Text>
        <View style={{ gap: 16 }}>
          <Controller
            control={control}
            name="websiteUrl"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Website URL"
                placeholder="www.artiste.com"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  onFormChange("websiteUrl", text);
                }}
                error={errors.websiteUrl?.message}
              />
            )}
          />
        </View>
      </View>

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Connect Social Accounts</Text>
        <View style={{ gap: 16 }}>
          {social.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {item.icon}
              <View style={{ flex: 1 }}>
                <Input
                  label={item.title}
                  placeholder={item.placeholder}
                  value={formData[`${item.id}Link`]?.replace(item.baseUrl, '') || ''}
                  onChangeText={(text) => {
                    const fullUrl = item.baseUrl + text;
                    onFormChange(`${item.id}Link`, fullUrl);
                    onSocialAccountChange(item.id as "twitter" | "instagram" | "tiktok", fullUrl);
                  }}
                />
              </View>
            </View>
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
    paddingBottom: 10,
    flexGrow: 1,
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
