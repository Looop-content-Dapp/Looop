import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import useFileUpload, { FileType } from '../../../hooks/useFileUpload';
import { CollectibleFileType, getFileTypeFromUri } from '@/types/index';
import { FormField } from '@/components/app-components/formField';
import { Text } from 'react-native';

export interface FormData {
  tribeName: string;
  description: string;
  coverImage?: string;
  collectibleName: string;
  CollectibleDescription: string;
  collectibleMedia?: string;
  collectibleType: CollectibleFileType | "";
  communitySymbol: string;
}

interface TribeFormProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

const TribeForm: React.FC<TribeFormProps> = ({ formData, updateFormData }) => {
  const { pickFile } = useFileUpload();

  const handleCoverImagePick = async () => {
    const result = await pickFile(FileType.IMAGE);
    if (result?.file) {
      updateFormData('coverImage', result.file.uri);
    }
  };

  const handleCollectibleMediaPick = async () => {
    const result = await pickFile(FileType.IMAGE);
    if (result?.success && result?.file) {
      updateFormData('collectibleMedia', result.file.uri);
      const fileType = getFileTypeFromUri(result.file.uri);
      updateFormData("collectibleType", fileType);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      className="bg-gray-50"
    >
      <View className="gap-y-[32px] px-4 py-6">
        {/* Community Setup Section */}
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <Text className="text-2xl font-PlusJakartaSansBold text-gray-700 mb-6">
            Create Your Community
          </Text>
          <View className="space-y-6">
            <FormField.ImageUploadField
              value={formData.coverImage}
              onUpload={handleCoverImagePick}
              acceptedFormats="PNG, GIF, WEBP"
              maxSize="50MB"
              label="Community Banner"
              helperText="Add a banner image to represent your community"
              className="rounded-lg border-2 border-dashed border-gray-300"
            />

            <FormField.TextField
              label="Community Name"
              value={formData.tribeName}
              onChangeText={(value) => updateFormData('tribeName', value)}
              placeholder="Ex: Music Enthusiasts"
              required
              helperText="Choose a unique name for your community"
              className="bg-gray-50 rounded-lg"
            />

            <FormField.TextField
              label="Community Description"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
              numberOfLines={4}
              maxLength={150}
              required
              helperText="Tell others what your community is about"
              className="bg-gray-50 rounded-lg"
            />
          </View>
        </View>

        {/* Membership Details Section */}
        <View className="bg-white rounded-xl p-6 shadow-sm mt-4">
          <Text className="text-2xl font-PlusJakartaSansBold text-gray-700 mb-6">
            Membership Details
          </Text>
          <View className="space-y-6">
            <FormField.ImageUploadField
              value={formData.collectibleMedia}
              onUpload={handleCollectibleMediaPick}
              acceptedFormats="PNG, GIF, WEBP"
              maxSize="50MB"
              label="Membership Badge"
              helperText="Upload an image that represents membership"
              className="rounded-lg border-2 border-dashed border-gray-300"
            />

            <FormField.TextField
              label="Membership Title"
              value={formData.collectibleName}
              onChangeText={(value) => updateFormData('collectibleName', value)}
              placeholder="Ex: Premium Member"
              required
              helperText="Name for your membership badge"
              className="bg-gray-50 rounded-lg"
            />

            <FormField.TextField
              label="Community Code"
              value={formData.communitySymbol}
              onChangeText={(value) => updateFormData('communitySymbol', value)}
              placeholder="Ex: PMM"
              required
              helperText="A short unique code for your community (3-5 characters)"
              className="bg-gray-50 rounded-lg"
            />

            <FormField.TextField
              label="Membership Benefits"
              value={formData.CollectibleDescription}
              onChangeText={(value) => updateFormData('CollectibleDescription', value)}
              multiline
              numberOfLines={4}
              maxLength={150}
              helperText="Describe what members get access to"
              className="bg-gray-50 rounded-lg"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TribeForm;
