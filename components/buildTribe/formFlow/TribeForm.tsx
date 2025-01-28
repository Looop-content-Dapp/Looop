import React, { useState } from 'react';
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
    >
      <View className='gap-y-[32px]'>
        {/* Basic Information Section */}
        <View className='p-[10px] gap-y-[42px]'>
        <Text className='text-[24px] font-PlusJakartaSansBold text-[#A5A6AA]'>Basic Community Info</Text>
        <View>
        <FormField.ImageUploadField
          value={formData.coverImage}
          onUpload={handleCoverImagePick}
          acceptedFormats="PNG, GIF, WEBP"
          maxSize="50MB"
        />

        <FormField.TextField
          label="What do you want to call your Tribe?"
          value={formData.tribeName}
          onChangeText={(value) => updateFormData('tribeName', value)}
          placeholder="Ex: Rema Ravers"
          required
        />

        <FormField.TextField
          label="Add a short description of your Tribe"
          value={formData.description}
          onChangeText={(value) => updateFormData('description', value)}
          multiline
          numberOfLines={4}
          maxLength={150}
          required
        />
        </View>
        </View>
     

      <View className='p-[10px] gap-y-[42px]'>
        <Text className='text-[24px] font-PlusJakartaSansBold text-[#A5A6AA]'>Collectible Info</Text>
         {/* Membership Section */}
         <View>
        <FormField.ImageUploadField
          value={formData.collectibleMedia}
          onUpload={handleCollectibleMediaPick}
          acceptedFormats="PNG, GIF, WEBP"
          maxSize="50MB"
        />

        <FormField.TextField
          label="Collectible name"
          value={formData.collectibleName}
          onChangeText={(value: any) => updateFormData('collectibleName', value)}
          placeholder="Ex: Rema Ravers Pass"
          required
        />

        <FormField.TextField
          label="Token Symbol"
          value={formData.communitySymbol}
          onChangeText={(value: any) => updateFormData('communitySymbol', value)}
          placeholder="Ex: REV"
          required
        />

        <FormField.TextField
          label="Description (Optional)"
          value={formData.CollectibleDescription}
          onChangeText={(value: any) => updateFormData('CollectibleDescription', value)}
          multiline
          numberOfLines={4}
          maxLength={150}
        />
         </View>
       
        </View>


      </View>
    </ScrollView>
  );
};

export default TribeForm;
