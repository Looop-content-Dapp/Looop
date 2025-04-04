import React, { useLayoutEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { AppBackButton } from '@/components/app-components/back-btn';
import { AppButton } from '@/components/app-components/button';
import TrackUploadForm from '@/components/uploadMusicFlow/TrackUploadForm';
import FileUpload from '@/components/uploadMusicFlow/FileUpload';
import PreviewUpload from '@/components/uploadMusicFlow/PreviewUpload';

const UploadSingle = () => {
  const [flow, setFlow] = useState('Track info');
  const [formData, setFormData] = useState({
    trackInfo: null,
    fileMetadata: null
  });

  const navigation = useNavigation();
  const { back } = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: '#000'
      },
      headerLeft: () => (
        <AppBackButton
          name="Upload music"
          onBackPress={() => back()}
        />
      ),
      headerTitle: ''
    });
  }, [navigation]);

  const handleTrackInfoSubmit = (data) => {
    setFormData(prev => ({ ...prev, trackInfo: data }));
    setFlow('File Metadata');
  };

  const handleFileMetadataSubmit = (data) => {
    setFormData(prev => ({ ...prev, fileMetadata: data }));
    setFlow('Preview');
  };

  const handleFinishUpload = async () => {
    try {
      // Implement your upload logic here
      // You can use formData.trackInfo and formData.fileMetadata
      console.log('Uploading...', formData);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const renderStep = () => {
    switch (flow) {
      case 'Track info':
        return <TrackUploadForm onSubmit={handleTrackInfoSubmit} />;
      case 'File Metadata':
        return <FileUpload onSubmit={handleFileMetadataSubmit} />;
      case 'Preview':
        return <PreviewUpload {...formData} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingBottom: 120
      }}
      className="flex-1 min-h-screen px-[24px]"
    >
      <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4]">
        Upload single - {flow}
      </Text>

      <View className="py-[32px]   gap-y-[32px] mt-[32px] rounded-[24px]">
        {renderStep()}
      </View>

      <AppButton.Primary
        text={flow === 'Preview' ? 'Finish Upload' : 'Continue'}
        color="#57E09A"
        loading={false}
        onPress={
          flow === 'Preview'
            ? handleFinishUpload
            : flow === 'Track info'
              ? () => handleTrackInfoSubmit(formData.trackInfo)
              : () => handleFileMetadataSubmit(formData.fileMetadata)
        }
      />
    </KeyboardAwareScrollView>
  );
};

export default UploadSingle;
