import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import Intro from '@/components/CreatorOnboarding/ContractFlow/Intro';
import ContractIntro from '@/components/CreatorOnboarding/ContractFlow/ContractIntro';
import ContractAgreement from '@/components/CreatorOnboarding/ContractFlow/ContractAgreement';
import SignContract from '@/components/CreatorOnboarding/ContractFlow/SignContract';

type ContractFlowState =
  | "REVIEWED"
  | "INTRO"
  | "CONTRACT"
  | "SIGN"
  | "COMPLETED";

const ContractSigning = () => {
    const [currentFlow, setCurrentFlow] = useState<ContractFlowState>("REVIEWED");
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
                return <Intro />;
            case "INTRO":
                return <ContractIntro />;
            case "CONTRACT":
                return <ContractAgreement />;
            case "SIGN":
                return <SignContract />;
            default:
                return <Intro />;
        }
    }

    const handleNext = () => {
        switch (currentFlow) {
            case "REVIEWED":
                setCurrentFlow("INTRO");
                break;
            case "INTRO":
                setCurrentFlow("CONTRACT");
                break;
            case "CONTRACT":
                setCurrentFlow("SIGN");
                break;
            case "SIGN":
                setCurrentFlow("COMPLETED");
                push("/(artisteTabs)/(dashboard)");
                break;
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
