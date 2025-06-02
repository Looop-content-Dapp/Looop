import React from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFileUpload, { FileType, UploadedFile } from '@/hooks/useFileUpload';
import { ImageAdd01Icon } from '@hugeicons/react-native';

interface ImageUploadProps {
  label: string;
  description?: string;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  maxSize?: string;
  acceptedFormats?: string;
  error?: string;
  type?: 'rounded' | 'square';  // Add new type prop
}

export const ImageUpload = ({
  label,
  description,
  value,
  onChange,
  maxSize,
  acceptedFormats,
  error,
  type = 'rounded'  // Default to rounded if not specified
}: ImageUploadProps) => {
  const { pickFile, isLoading } = useFileUpload();

  const handlePickImage = async () => {
    try {
      const result = await pickFile(FileType.IMAGE);
      if (result?.success && result.file) {
        onChange(result.file);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View className="gap-y-[12px]">
      <View className="self-start">
        <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
        {description && (
          <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">{description}</Text>
        )}
      </View>

      <View className="items-center">
        {!value ? (
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isLoading}
            className={`border border-[#202227] bg-[#111318] ${
              type === 'rounded'
                ? 'rounded-full w-[220px] h-[220px]'
                : 'rounded-lg w-full py-[158px]'
            } items-center justify-center`}
          >
            {isLoading ? (
              <View className="items-center space-y-2">
                <ActivityIndicator color="#57E09A" />
                <Text className="text-[#787A80]">Uploading...</Text>
              </View>
            ) : (
              <>
                <ImageAdd01Icon size={type === 'rounded' ? 24 : 34} color="#63656B" />
                <Text className="text-[#63656B] text-[14px] font-PlusJakartaSansMedium mt-2">
                  {type === 'rounded' ? 'Upload' : 'Click to upload image'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View className={type === 'rounded' ? 'w-[220px] h-[220px]' : 'w-full'}>
            <Image
              source={{ uri: value.uri }} 
              className={`${
                type === 'rounded'
                  ? 'w-[220px] h-[220px] rounded-full'
                  : 'w-full h-[200px] rounded-lg'
              }`}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onChange(null)}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm self-start">{error}</Text>
      )}
    </View>
  );
};
