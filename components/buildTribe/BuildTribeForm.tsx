import { View, Text, TouchableOpacity, SafeAreaView, Platform, Keyboard, Alert } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Preview from './formFlow/Preview';
import StepIndicator from './StepIndicator';
import { useAppSelector } from '@/redux/hooks';
import api from '@/config/apiConfig';
import { useRouter } from 'expo-router';
import TribeSuccessScreen from './TribeSuccessScreen';
import TribeForm, { FormData } from './formFlow/TribeForm';

const STEPS = {
    BASIC: 'basic',
    MEMBERSHIP: 'membership',
    PREVIEW: 'preview',
    SUCCESS: 'success'
  };

const STEP_COLORS = {
  [STEPS.BASIC]: '#A187B5',
  [STEPS.MEMBERSHIP]: '#87A1B5',
  [STEPS.PREVIEW]: '#87B5A1'
};

const BuildTribeForm = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC);
  const [isSuccess, setIsSuccess] = useState(false);
  const { back } = useRouter()
  const [formData, setFormData] = useState<FormData>({
    tribeName: '',
    description: '',
    coverImage: undefined,
    collectibleName: '',
    CollectibleDescription: '',
    collectibleMedia: undefined,
    collectibleType: "",
    communitySymbol: ""
  });
  const scrollViewRef = useRef(null);
  const { userdata, artistId } = useAppSelector((state) => state.auth);

  const handleCreateCommunity =  async() => {
     const payload = {
    "communityName": formData?.tribeName,
    "description": formData?.description,
    "coverImage": formData?.coverImage,
    "collectibleName": formData?.collectibleName,
    "collectibleDescription":formData?.CollectibleDescription,
    "collectibleImage": formData?.collectibleMedia,
    "collectibleType": formData?.collectibleType,
    "artistId": artistId,
    "communitySymbol":formData?.communitySymbol
    }
     try {
        const response = await api.post("/api/community/createcommunity", payload)
        console.log(JSON.stringify(response))
        if(response.data.status === "success"){
            setCurrentStep(STEPS.SUCCESS);
        }else{
            Alert.alert("Error", "Failed to create community. Please try again.");
        }
      } catch (error) {
       console.log("error creating community", error.message)
       Alert.alert("Error", "Something went wrong. Please try again.");
      }
  }

  const updateFormData = (field: any, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BASIC:
      case STEPS.MEMBERSHIP:
        return <TribeForm
          formData={formData}
          updateFormData={updateFormData}
          currentStep={currentStep}
          STEPS={STEPS}
        />;
      case STEPS.PREVIEW:
        return <Preview formData={formData}/>;
      case STEPS.SUCCESS:
        return <TribeSuccessScreen tribeName={formData} />;
      default:
        return <TribeForm
          formData={formData}
          updateFormData={updateFormData}
          currentStep={currentStep}
          STEPS={STEPS}
        />;
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case STEPS.BASIC:
        // Validate basic info
        if (!formData.tribeName || !formData.description || !formData.coverImage) {
          Alert.alert("Required Fields", "Please fill in all required fields");
          return;
        }
        setCurrentStep(STEPS.MEMBERSHIP);
        break;

      case STEPS.MEMBERSHIP:
        // Validate membership info
        if (!formData.collectibleName || !formData.CollectibleDescription ||
            !formData.collectibleMedia || !formData.communitySymbol) {
          Alert.alert("Required Fields", "Please fill in all required fields");
          return;
        }
        setCurrentStep(STEPS.PREVIEW);
        break;

      case STEPS.PREVIEW:
        handleCreateCommunity();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case STEPS.MEMBERSHIP:
        setCurrentStep(STEPS.BASIC);
        break;
      case STEPS.PREVIEW:
        setCurrentStep(STEPS.MEMBERSHIP);
        break;
      default:
        back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 12,
      }}>
        <TouchableOpacity onPress={handleBack} style={{ padding: 8 }}>
        <MaterialIcons name="arrow-back" size={24} color="#f4f4f4" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 20,
          color: '#f4f4f4',
          fontFamily: 'PlusJakartaSansBold',
          marginLeft: 12,
        }}>
          Build my Tribe
        </Text>
      </View>

      <StepIndicator
      currentStep={currentStep}
      STEPS={STEPS}
     />

      {/* Scrollable Content */}
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {renderCurrentStep()}
        </View>

        <View style={{
          padding: 16,
          paddingBottom: Platform.OS === 'ios' ? 34 : 16,
          borderTopWidth: 1,
          borderTopColor: '#1C1F2A',
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: STEP_COLORS[currentStep],
              alignItems: 'center',
              width: '100%',
              paddingVertical: 16,
              borderRadius: 56,
            }}
            onPress={() => {
              Keyboard.dismiss();
              handleNext();
            }}
          >
            <Text style={{
              color: '#12141B',
              fontSize: 16,
              fontFamily: 'PlusJakartaSansMedium',
            }}>
              {currentStep === STEPS.PREVIEW ? 'Create Tribe' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default BuildTribeForm;
