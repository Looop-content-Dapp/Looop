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
}

export const ImageUpload = ({
  label,
  description,
  value,
  onChange,
  maxSize,
  acceptedFormats,
  error
}: ImageUploadProps) => {
  const { pickFile, isLoading } = useFileUpload();
  console.log('ImageUpload:', value);

  const handlePickImage = async () => {
    try {
      const result = await pickFile(FileType.IMAGE);
      if (result) {
        onChange(result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View className="gap-y-[12px]">
      <View>
        <Text className="text-[#F4F4F4] text-[16px] font-PlusJakartaSansMedium">{label}</Text>
        {description && (
          <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium">{description}</Text>
        )}
        {/* {(maxSize || acceptedFormats) && (
          <Text className="text-[#787A80] text-sm">
            {maxSize && `Max size: ${maxSize}`}
            {maxSize && acceptedFormats && ' • '}
            {acceptedFormats && `Format: ${acceptedFormats}`}
          </Text>
        )} */}
      </View>

      {!value ? (
        <TouchableOpacity
          onPress={handlePickImage}
          disabled={isLoading}
          className="border border-[#202227] bg-[#111318] rounded-lg py-[158px] items-center justify-center"
        >
          {isLoading ? (
            <View className="items-center space-y-2">
              <ActivityIndicator color="#57E09A" />
              <Text className="text-[#787A80]">Uploading...</Text>
            </View>
          ) : (
            <>
              <ImageAdd01Icon  size={34} color="#63656B" />
              <Text className="text-[#63656B] text-[16px] font-PlusJakartaSansMedium mt-2">Click to upload image</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View>
          <Image
            source={{ uri: value.file.uri }}
            className="w-full h-[200px] rounded-lg"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => onChange(null)}
            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}
    </View>
  );
};
