import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Image } from 'react-native';
import { ImageAdd02Icon } from '@hugeicons/react-native';
import useFileUpload, { FileType, UploadedFile } from '../../../hooks/useFileUpload';
import { ResizeMode, Video } from 'expo-av';
import { CollectibleFileType, getFileTypeFromUri } from '@/types/index';

// Define interface for the file object
interface FileObject extends UploadedFile {}

// Define interface for the form data
interface FormData {
    collectibleName: string;
    CollectibleDescription: string;
    collectibleMedia: string;
    collectibleType: CollectibleFileType | "";
    communitySymbol: string;
  }

interface MembersProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

const Members: React.FC<MembersProps> = ({ formData, updateFormData }) => {
  const { files, isLoading, error, pickFile, removeFile } = useFileUpload();
  const [mediaType, setMediaType] = React.useState<FileType>(FileType.IMAGE);

  const handleMediaPick = async (type: FileType) => {
    setMediaType(type);
    const result = await pickFile(type);
    if (result && result?.success && result?.file) {
      updateFormData('collectibleMedia', result?.file?.uri);
      const fileType = getFileTypeFromUri(result.file.uri);
      console.log(fileType)
      updateFormData("collectibleType", fileType);
    }
  };

  const handleRemoveMedia = async () => {
    if (formData.collectibleMedia) {
      await removeFile(formData.collectibleMedia);
      updateFormData('collectibleMedia', undefined);
    }
  };

  const renderMediaPreview = () => {
    if (!formData.collectibleMedia) return null;

    return formData?.collectibleMedia?.type?.startsWith('video') ? (
      <Video
        source={{ uri: formData.collectibleMedia.uri }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isLooping={false}
        useNativeControls
      />
    ) : (
      <Image
        source={{ uri: formData.collectibleMedia }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 20,
        color: '#f4f4f4',
        fontFamily: 'PlusJakartaSansBold',
        marginBottom: 24,
      }}>
        Membership & Subscribers
      </Text>

      <View className='gap-y-[8px] mb-[24px]'>
        <Text className='text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]'>Create your first collectible</Text>
        <Text className='text-[16px] font-PlusJakartaSansMedium text-[#D2D3D5]'>Your membership NFT collectible gives your fans access to your tribe as well as other future perks you choose.</Text>
      </View>

      <TouchableOpacity
        style={{
          height: 200,
          backgroundColor: 'transparent',
          borderRadius: 12,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          borderStyle: "dashed",
          borderWidth: 4,
          borderColor: "#787A80",
          rowGap: 16,
          overflow: 'hidden',
        }}
      >
        {formData.collectibleMedia ? (
          <>
            {renderMediaPreview()}
            <TouchableOpacity
              onPress={handleRemoveMedia}
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
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              color: '#787A80',
              fontSize: 16,
              fontFamily: 'PlusJakartaSansRegular',
              marginBottom: 16,
            }}>
              PNG, GIF, WEBP. Max 50MB
            </Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable
                onPress={() => handleMediaPick(FileType.IMAGE)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: "#12141B",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 8,
                  gap: 8
                }}
              >
                <Text style={{
                  color: '#787A80',
                  fontSize: 16,
                  fontFamily: 'PlusJakartaSansRegular',
                }}>
                  {isLoading ? 'Uploading...' : 'Choose File'}
                </Text>
              </Pressable>
            </View>
          </View>
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
        Collectible name
      </Text>
      <TextInput
        value={formData.collectibleName}
        onChangeText={(value) => updateFormData('collectibleName', value)}
        placeholder="Ex: Rema Ravers"
        placeholderTextColor="#6B7280"
        style={{
          backgroundColor: '#12141B',
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
        Token Symbol
      </Text>
      <TextInput
        value={formData.communitySymbol}
        onChangeText={(value) => updateFormData('communitySymbol', value)}
        placeholder="Ex: REV"
        placeholderTextColor="#6B7280"
        style={{
          backgroundColor: '#12141B',
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
        Description (Optional)
      </Text>
      <View style={{ position: 'relative' }}>
      <TextInput
          value={formData.CollectibleDescription}
          onChangeText={(value) => updateFormData('CollectibleDescription', value)}
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
          {formData.CollectibleDescription.length}/150
        </Text>
      </View>

      <View style={{ height: 30 }} />
    </View>
  );
};

export default Members;
