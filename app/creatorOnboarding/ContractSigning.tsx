import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import Intro from '@/components/CreatorOnboarding/ContractFlow/Intro';
import ContractIntro from '@/components/CreatorOnboarding/ContractFlow/ContractIntro';
import ContractAgreement from '@/components/CreatorOnboarding/ContractFlow/ContractAgreement';
import SignContract from '@/components/CreatorOnboarding/ContractFlow/SignContract';
import { useSignArtistContract } from '@/hooks/useSignArtistContract';
import { useNotification } from '@/context/NotificationContext';

type ContractFlowState =
  | "REVIEWED"
  | "INTRO"
  | "CONTRACT"
  | "SIGN"
  | "COMPLETED";

const ContractSigning = () => {
    const { showNotification } = useNotification();
    const [currentFlow, setCurrentFlow] = useState<ContractFlowState>("REVIEWED");
    const [fullName, setFullName] = useState<string>('') // Add type
    const [isChecked, setIsChecked] = useState<boolean>(false) // Add type
    const signContract = useSignArtistContract();
    const { width, height } = useWindowDimensions();
    const { push } = useRouter();

    const getButtonText = (flow: ContractFlowState) => {
      switch (flow) {
        case "REVIEWED":
        case "INTRO":
          return "Continue";
        case "CONTRACT":
          return "Next Step";
        case "SIGN":
          return "Sign & Continue";
        default:
          return "Continue";
      }
    };

    const handleFlow = () => {
        switch (currentFlow) {
            case "REVIEWED":
            case "INTRO":
                return <ContractIntro />;
            case "CONTRACT":
                return <ContractAgreement />;
            case "SIGN":
                return <SignContract
                fullName={fullName}
                setFullName={setFullName}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                 />;
        }
    }

    const handleNext = () => {
        switch (currentFlow) {
            case "REVIEWED":
                // Smoothly transition to intro
                setCurrentFlow("INTRO");
                break;
            case "INTRO":
                // Move to contract review
                setCurrentFlow("CONTRACT");
                break;
            case "CONTRACT":
                // Move to signing phase
                setCurrentFlow("SIGN");
                break;
            case "SIGN":
                // Validate before proceeding
                if (!fullName.trim()) {
                    showNotification({
                        type: 'error',
                        title: 'Missing Information',
                        message: 'Please enter your full name to continue',
                        position: 'top'
                    });
                    return;
                }

                if (!isChecked) {
                    showNotification({
                        type: 'error',
                        title: 'Agreement Required',
                        message: 'Please review and accept the terms to continue',
                        position: 'top'
                    });
                    return;
                }

                // Sign the contract
                signContract.mutate({ fullName: fullName }, {
                    onSuccess: (data) => {
                        showNotification({
                            type: 'success',
                            title: 'Success',
                            message: 'Contract signed successfully!',
                            position: 'top'
                        });
                        push("/(artisteTabs)/(dashboard)");
                    },
                    onError: (error: any) => {
                        showNotification({
                            type: 'error',
                            title: 'Contract Signing Failed',
                            message: error?.message || 'Failed to sign the contract. Please try again.',
                            position: 'top'
                        });
                    }
                });
                break;
            default:
                setCurrentFlow("REVIEWED");
        }
    };

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#040405",
        },
        button: {
          backgroundColor: "#A187B5",
          alignItems: "center",
          marginHorizontal: width * 0.05,
          paddingVertical: height * 0.02,
          borderRadius: 56,
          position: "absolute",
          bottom: 30,
          right: 0,
          left: 0
        },
        buttonText: {
          color: "#0a0b0f",
          fontSize: width * 0.045,
          fontFamily: "PlusJakartaSans-Bold",
        },
    });

    return (
        <View style={styles.container}>
            {handleFlow()}
            <TouchableOpacity
                onPress={handleNext}
                style={styles.button}
            >
                <Text style={styles.buttonText}>
                    {getButtonText(currentFlow)}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default ContractSigning;
