import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFileUpload, { FileType, UploadedFile } from '@/hooks/useFileUpload';
import { formatBytes } from '@/utils/formatBytes';

interface AudioUploadProps {
  label: string;
  description?: string;
  acceptedFormats: string;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  error?: string;
}

export const AudioUpload = ({
  label,
  description,
  acceptedFormats,
  value,
  onChange,
  error
}: AudioUploadProps) => {
  const { pickFile, isLoading } = useFileUpload();

  const handlePickAudio = async () => {
    try {
      const result = await pickFile(FileType.AUDIO);
      if (result) {
        onChange(result);
      }
    } catch (error) {
      console.error('Error picking audio:', error);
    }
  };

  return (
    <View className="space-y-4">
      <View>
        <Text className="text-[#F4F4F4] text-base font-medium">{label}</Text>
        {description && (
          <Text className="text-[#787A80] text-sm mt-1">{description}</Text>
        )}
        <Text className="text-[#787A80] text-sm">
          {acceptedFormats}
        </Text>
      </View>

      {!value ? (
        <TouchableOpacity
          onPress={handlePickAudio}
          disabled={isLoading}
          className="border border-dashed border-[#787A80] rounded-lg p-4 items-center justify-center"
        >
          {isLoading ? (
            <View className="items-center space-y-2">
              <ActivityIndicator color="#57E09A" />
              <Text className="text-[#787A80]">Uploading...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="musical-note" size={24} color="#787A80" />
              <Text className="text-[#787A80]">Choose audio file</Text>
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View className="bg-[#12141B] p-4 rounded-lg flex-row justify-between items-center">
          <View className="flex-row items-center space-x-3">
            <Ionicons name="musical-note" size={24} color="#787A80" />
            <View>
              <Text className="text-[#F4F4F4]">{value.name}</Text>
              <Text className="text-[#787A80] text-sm">
                {formatBytes(value.size)}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onChange(null)}>
            <Ionicons name="close" size={20} color="#787A80" />
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <Text className="text-red-500 text-sm">{error}</Text>
      )}
    </View>
  );
};
