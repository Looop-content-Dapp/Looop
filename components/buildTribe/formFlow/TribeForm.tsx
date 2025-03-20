import React, { useState } from 'react';
import { View, ScrollView, TextInput, Text } from 'react-native';
import useFileUpload, { FileType } from '../../../hooks/useFileUpload';
import { CollectibleFileType, getFileTypeFromUri } from '@/types/index';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { ImageAdd01Icon, ImageAdd02Icon } from '@hugeicons/react-native';

const formSchema = z.object({
  tribeName: z.string().min(1, 'Community name is required'),
  description: z.string()
    .min(1, 'Description is required')
    .max(250, 'Description cannot exceed 250 characters'),
  coverImage: z.string().min(1, 'Cover image is required'),
  collectibleName: z.string().min(1, 'Membership title is required'),
  CollectibleDescription: z.string()
    .min(1, 'Benefits description is required')
    .max(250, 'Benefits description cannot exceed 250 characters'),
  collectibleMedia: z.string().min(1, 'Membership badge is required'),
  collectibleType: z.string(),
  communitySymbol: z.string()
    .min(3, 'Community code must be at least 3 characters')
    .max(5, 'Community code cannot exceed 5 characters')
});

type FormData = z.infer<typeof formSchema>;

interface TribeFormProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  currentStep: string;
  STEPS: {
    BASIC: string;
    MEMBERSHIP: string;
    PREVIEW: string;
    SUCCESS: string;
  };
}



const TribeForm: React.FC<TribeFormProps> = ({ formData, updateFormData, currentStep, STEPS }) => {
  const { pickFile } = useFileUpload();
  const { control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  // Add loading states
  const [isCoverImageLoading, setIsCoverImageLoading] = useState(false);
  const [isCollectibleImageLoading, setIsCollectibleImageLoading] = useState(false);

  // Modify handleCoverImagePick
  const handleCoverImagePick = async () => {
    try {
      setIsCoverImageLoading(true);
      const result = await pickFile(FileType.IMAGE);
      if (result?.file) {
        updateFormData('coverImage', result.file.uri);
      }
    } finally {
      setIsCoverImageLoading(false);
    }
  };

  // Modify handleCollectibleMediaPick
  const handleCollectibleMediaPick = async () => {
    try {
      setIsCollectibleImageLoading(true);
      const result = await pickFile(FileType.IMAGE);
      if (result?.success && result?.file) {
        updateFormData('collectibleMedia', result.file.uri);
        const fileType = getFileTypeFromUri(result.file.uri);
        updateFormData("collectibleType", fileType);
      }
    } finally {
      setIsCollectibleImageLoading(false);
    }
  };

  if (currentStep === STEPS.BASIC) {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-y-[32px] py-6">
          <View>
            <Text className="text-2xl font-PlusJakartaSansBold text-white mb-6">
              Basic Information
            </Text>
            <View className="space-y-6">
              {/* Cover Image Upload */}
              <TouchableOpacity
                onPress={handleCoverImagePick}
                className="h-[200px] rounded-xl bg-[#1C1F2A] items-center justify-center"
              >
                {isCoverImageLoading ? (
                  <View className="items-center">
                    <Text className="text-gray-400">Loading...</Text>
                  </View>
                ) : formData.coverImage ? (
                  <Image
                    source={{ uri: formData.coverImage }}
                    style={{ width: '100%', height: 200, borderRadius: 12 }}
                  />
                ) : (
                  <View className="items-center">
                    <ImageAdd02Icon size={32} color='#63656B' variant='stroke' />
                    <Text className="text-gray-400">Upload cover image</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Community Name */}
              <View>
                <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansBold my-2 leading-[22px] tracking-[0.32px]">
                  What do you want to call your Tribe?
                </Text>
                <Controller
                  control={control}
                  name="tribeName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={{
                        backgroundColor: "#1C1F2A",
                        color: "#fff",
                        height: 56,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                      }}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        updateFormData('tribeName', text);
                      }}
                      value={value}
                      placeholder="Ex: Rema Ravers"
                      placeholderTextColor="#4B5563"
                    />
                  )}
                />
              </View>

              {/* Description */}
              <View>
                <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansBold my-2 leading-[22px] tracking-[0.32px]">
                  Add a short description of your Tribe
                </Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <TextInput
                        style={{
                          backgroundColor: "#1C1F2A",
                          color: "#fff",
                          minHeight: 200,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingTop: 16,
                          textAlignVertical: 'top',
                        }}
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          onChange(text);
                          updateFormData('description', text);
                        }}
                        value={value}
                        placeholder="Tell others what your community is about"
                        placeholderTextColor="#4B5563"
                        multiline
                        numberOfLines={4}
                        maxLength={150}
                      />
                      <Text className="text-gray-500 text-xs mt-1 text-right">
                        {value?.length || 0}/250
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View className="gap-y-[32px] py-6">
        <View>
          <Text className="text-[20px] font-PlusJakartaSansBold text-white mb-6">
            Tribe Pass
          </Text>
          <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[24px] mb-4">
            Create your first collectible
          </Text>
          <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansBold my-6 leading-[22px] tracking-[0.32px]">
            Your membership NFT collectible gives your fans access to your tribe as well as other future perks you choose.
          </Text>
          <View className="space-y-6">
            {/* Membership Badge Upload */}
            <TouchableOpacity
              onPress={handleCollectibleMediaPick}
              className="h-[200px] rounded-xl border border-dashed border-gray-600 bg-[#1C1F2A] items-center justify-center"
            >
              {isCollectibleImageLoading ? (
                <View className="items-center">
                  <Text className="text-gray-400">Loading...</Text>
                </View>
              ) : formData.collectibleMedia ? (
                <Image
                  source={{ uri: formData.collectibleMedia }}
                  style={{ width: '100%', height: 200, borderRadius: 12 }}
                />
              ) : (
                <View className="items-center">
                  <Text className="text-gray-400 text-sm mb-1">PNG, GIF, WEBP, Max 50MB</Text>
                  <TouchableOpacity
                    className="bg-[#1E1E1E] px-6 py-3 rounded-full mt-2"
                    onPress={handleCollectibleMediaPick}
                  >
                    <Text className="text-white">Choose file</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>

            <View>
                <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansBold my-2 leading-[22px] tracking-[0.32px]">
                Collectible name
                </Text>
                <Controller
                  control={control}
                  name="collectibleName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={{
                        backgroundColor: "#1C1F2A",
                        color: "#fff",
                        height: 56,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                      }}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        updateFormData('collectibleName', text);
                      }}
                      value={value}
                      placeholder="Ex: Rema Ravers"
                      placeholderTextColor="#4B5563"
                    />
                  )}
                />
              </View>

              <View>
                <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansBold my-2 leading-[22px] tracking-[0.32px]">
                  Add a short description of your Tribe
                </Text>
                <Controller
                  control={control}
                  name="CollectibleDescription"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View>
                      <TextInput
                        style={{
                          backgroundColor: "#1C1F2A",
                          color: "#fff",
                          minHeight: 200,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingTop: 16,
                          textAlignVertical: 'top',
                        }}
                        onBlur={onBlur}
                        onChangeText={(text) => {
                          onChange(text);
                          updateFormData('CollectibleDescription', text);
                        }}
                        value={value}
                        placeholder="Tell others what your community is about"
                        placeholderTextColor="#4B5563"
                        multiline
                        numberOfLines={4}
                        maxLength={150}
                      />
                      <Text className="text-gray-500 text-xs mt-1 text-right">
                        {value?.length || 0}/250
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View>
                <Text className="text-[#D2D3D5] text-[16px] font-PlusJakartaSansBold my-2 leading-[22px] tracking-[0.32px]">
                Collectible name
                </Text>
                <Controller
                  control={control}
                  name="communitySymbol"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={{
                        backgroundColor: "#1C1F2A",
                        color: "#f4f4f4",
                        height: 56,
                        borderRadius: 12,
                        paddingHorizontal: 16,
                      }}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        updateFormData('communitySymbol', text);
                      }}
                      value={value}
                      placeholder="Ex: Rema Ravers"
                      placeholderTextColor="#4B5563"
                      className='font-PlusJakartaSansBold text-[16px]'
                    />
                  )}
                />
              </View>

          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TribeForm;
