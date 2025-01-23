import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { ImageAdd02Icon } from '@hugeicons/react-native';
import useFileUpload, { FileType, UploadedFile } from '../../../hooks/useFileUpload';

interface FormData {
  tribeName: string;
  description: string;
  coverImage?: UploadedFile;
}

interface BasicInformationProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ formData, updateFormData }) => {
  const { isLoading, error, pickFile, removeFile } = useFileUpload();

  const handleCoverImagePick = async () => {
    const result = await pickFile(FileType.IMAGE);
    if (result && result.file) {
        console.log(result.file.uri)
      updateFormData('coverImage', result.file.uri);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.coverImage) {
      await removeFile(formData.coverImage);
      updateFormData('coverImage', undefined);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 20,
        color: '#f4f4f4',
        fontFamily: 'PlusJakartaSansBold',
        marginBottom: 24,
      }}>
        Basic Information
      </Text>

      <TouchableOpacity
        onPress={handleCoverImagePick}
        style={{
          height: 200,
          backgroundColor: '#1C1F2A',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          overflow: 'hidden',
        }}
      >
        {formData.coverImage ? (
          <>
            <Image
              source={{ uri: formData.coverImage }}
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={handleRemoveImage}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: '#fff' }}>Remove</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ImageAdd02Icon size={40} color="#9CA3AF" />
            <Text style={{
              color: '#9CA3AF',
              fontSize: 16,
              fontFamily: 'PlusJakartaSansRegular',
              marginTop: 8,
            }}>
              {isLoading ? 'Uploading...' : 'Upload cover image'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {error && (
        <Text style={{
          color: '#ef4444',
          fontSize: 14,
          fontFamily: 'PlusJakartaSansRegular',
          marginBottom: 16,
        }}>
          {error}
        </Text>
      )}

      <Text style={{
        color: '#f4f4f4',
        fontSize: 16,
        fontFamily: 'PlusJakartaSansMedium',
        marginBottom: 8,
      }}>
        What do you want to call your Tribe?
      </Text>
      <TextInput
        value={formData.tribeName}
        onChangeText={(value) => updateFormData('tribeName', value)}
        placeholder="Ex: Rema Ravers"
        placeholderTextColor="#6B7280"
        style={{
          backgroundColor: '#1C1F2A',
          borderRadius: 12,
          padding: 16,
          color: '#f4f4f4',
          fontSize: 16,
          fontFamily: 'PlusJakartaSansRegular',
          marginBottom: 24,
        }}
      />

      <Text style={{
        color: '#f4f4f4',
        fontSize: 16,
        fontFamily: 'PlusJakartaSansMedium',
        marginBottom: 8,
      }}>
        Add a short description of your Tribe
      </Text>
      <View style={{ position: 'relative' }}>
        <TextInput
          value={formData.description}
          onChangeText={(value) => updateFormData('description', value)}
          multiline
          numberOfLines={4}
          maxLength={150}
          style={{
            backgroundColor: '#1C1F2A',
            borderRadius: 12,
            padding: 16,
            color: '#f4f4f4',
            fontSize: 16,
            fontFamily: 'PlusJakartaSansRegular',
            height: 120,
            textAlignVertical: 'top',
          }}
        />
        <Text style={{
          position: 'absolute',
          bottom: 8,
          right: 16,
          color: '#6B7280',
          fontSize: 14,
          fontFamily: 'PlusJakartaSansRegular',
        }}>
          {formData.description.length}/150
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </View>
  )
}

export default BasicInformation
