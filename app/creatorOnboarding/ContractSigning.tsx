import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import Intro from '@/components/CreatorOnboarding/ContractFlow/Intro';
import ContractIntro from '@/components/CreatorOnboarding/ContractFlow/ContractIntro';
import ContractAgreement from '@/components/CreatorOnboarding/ContractFlow/ContractAgreement';
import SignContract from '@/components/CreatorOnboarding/ContractFlow/SignContract';
import api from '@/config/apiConfig';
import { useAppSelector } from '@/redux/hooks';

type ContractFlowState =
  | "REVIEWED"
  | "INTRO"
  | "CONTRACT"
  | "SIGN"
  | "COMPLETED";

const ContractSigning = () => {
    const [currentFlow, setCurrentFlow] = useState<ContractFlowState>("REVIEWED");
    const [fullName, setFullName] = useState<string>('') // Add type
    const [isChecked, setIsChecked] = useState<boolean>(false) // Add type
    const { width, height } = useWindowDimensions();
    const { push } = useRouter();
    const { artistId, userdata } = useAppSelector((state) => state.auth)


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
            default:
                return <Intro />;
        }
    }

    const signContract = async () => {
      if(!artistId){
        return Alert.alert("ArtistId doesnt exist")
      }

        const payload = {
            artistname: fullName,
            artistAddress: userdata?.wallets?.xion
        }

        try {
            const response = await api.post("/api/artist/sign-contract", payload);
            
            if (response.data.status === "success") {
                Alert.alert(
                    "Success",
                    response.data.message,
                    [{ text: "OK" }]
                );
                push("/(artisteTabs)/(dashboard)");
                return true;
            } else {
                throw new Error(response.data.message || 'Unexpected response status');
            }
        } catch (error) {
            let errorMessage = "An error occurred while signing the contract.";
            
            if (error instanceof Error) {
                if (error.message.includes('network')) {
                    errorMessage = "Network error. Please check your connection.";
                } else if (error.message.includes('timeout')) {
                    errorMessage = "Request timed out. Please try again.";
                } else {
                    errorMessage = error.message;
                }
            }
            
            Alert.alert(
                "Error",
                errorMessage,
                [{ text: "OK" }]
            );
            
            console.error("Contract signing error:", error);
            return false;
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
              if (fullName && isChecked) {
                signContract()  
            }
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
