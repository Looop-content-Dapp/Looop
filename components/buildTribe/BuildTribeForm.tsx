import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Keyboard } from 'react-native';
import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import BasicInformation from './formFlow/BasicInformation';
import Preview from './formFlow/Preview';
import Members from './formFlow/Members';
import StepIndicator from './StepIndicator';
import { useQuery } from '../../hooks/useQuery';

const STEPS = {
  BASIC: 'basic',
  MEMBERSHIP: 'membership',
  PREVIEW: 'preview'
};

const STEP_COLORS = {
  [STEPS.BASIC]: '#A187B5',
  [STEPS.MEMBERSHIP]: '#B9A5C8',
  [STEPS.PREVIEW]: '#87B5A1'
};

const BuildTribeForm = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.BASIC);
  const [formData, setFormData] = useState({
    tribeName: '',
    description: '',
    coverImage: undefined,
    collectibleName: '',
    CollectibleDescription: '',
    collectibleMedia: undefined,
  });
  const scrollViewRef = useRef(null);
  const { createCommunity } = useQuery()

  const handleCreateCommunity =  async() => {
     const data = {
         name: formData.tribeName,
         description: formData.description,
         artistId: "66f25fc08ceaa671b0d73a5d",
         coverImage: formData?.coverImage?.uri,
         collectibleName: formData.collectibleName,
         collectibleImage: formData?.collectibleMedia?.uri,
     }
     console.log("formdat", data)
     //  createCommunity(data)
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.BASIC:
        return <BasicInformation
        formData={formData}
        updateFormData={updateFormData}
        // errors={errors}
        />;
      case STEPS.MEMBERSHIP:
        return <Members
        formData={formData}
        updateFormData={updateFormData}
        // errors={errors}
        />;
      case STEPS.PREVIEW:
        return <Preview formData={formData}/>;
      default:
        return <BasicInformation
        formData={formData}
        updateFormData={updateFormData}
        // errors={errors}
        />;
    }
  };

  const handleNext = () => {
    switch (currentStep) {
      case STEPS.BASIC:
        if (formData.tribeName && formData.description && formData.coverImage) {
          setCurrentStep(STEPS.MEMBERSHIP);
        }
        break;
      case STEPS.MEMBERSHIP:
        if (formData.collectibleName  && formData.CollectibleDescription && formData.collectibleMedia) {
          setCurrentStep(STEPS.PREVIEW);
        }
        break;
      case STEPS.PREVIEW:
        // Handle form submission
        handleCreateCommunity()
        console.log('Form submitted:', formData);
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
        navigation.goBack();
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
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        extraScrollHeight={Platform.OS === 'ios' ? 120 : 80}
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
