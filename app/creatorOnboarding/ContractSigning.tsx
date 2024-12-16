import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import Intro from '../../components/CreatorOnboarding/ContractFlow/Intro';
import ContractIntro from '../../components/CreatorOnboarding/ContractFlow/ContractIntro';

import ContractAgreement from '../../components/CreatorOnboarding/ContractFlow/ContractAgreement';
import SignContract from '../../components/CreatorOnboarding/ContractFlow/SignContract';
import { useRouter } from 'expo-router';
// import CreateProfile from './CreateProfile';

const ContractSigning = () => {
    const [currentFlow, setCurrentFlow] = useState("Reviewed");
    const [buttonText, setButtonText] = useState("Continue")
    const { width, height } = useWindowDimensions();
    const { navigate } = useRouter()

    const handleFlow = () => {
        switch (currentFlow) {
            case "Reviewed":
               return <Intro />
            //    case "Create Profile":
            //     return <CreateProfile />
             case "intro":
                return <ContractIntro />
                case "Contract":
                    return <ContractAgreement />
                    case "Sign":
                        return <SignContract />
            default:
                return <Intro />
        }
    }

    const handleNext = () => {
        switch (currentFlow) {
            case "Reviewed":
                setCurrentFlow("intro");
                break;
            case "intro":
                setCurrentFlow("Contract");
                setButtonText("Next Step")
                break;
            case "Contract":
                setCurrentFlow("Sign")
                setButtonText("Sign & Continue")
                // You can navigate to the next screen here
                case "Sign":
                setCurrentFlow("Sign")
                setButtonText("Sign & Continue")
                navigate("/(artisteTabs)/(dashboard)")
                // You can navigate to the next screen here
                break;
            default:
                setCurrentFlow("Reviewed");
        }
    };

    const styles = StyleSheet.create({
        button: {
          backgroundColor: "#A187B5",
          alignItems: "center",
        //   marginTop: height * 0.06,
          marginHorizontal: width *  0.05,
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
    <View className='flex-1'>
     {handleFlow()}
     <TouchableOpacity
        onPress={handleNext}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>

    </View>
  )
}

export default ContractSigning
