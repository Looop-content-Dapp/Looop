import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import Intro from './ContractFlow/Intro';
import ContractIntro from './ContractFlow/ContractIntro';

import ContractAgreement from './ContractFlow/ContractAgreement';
import SignContract from './ContractFlow/SignContract';

const ContractSigning = () => {
    const [currentFlow, setCurrentFlow] = useState("Reviewed");
    const [buttonText, setButtonText] = useState("Continue")
    const { width, height } = useWindowDimensions();

    const handleFlow = () => {
        switch (currentFlow) {
            case "Reviewed":
               return <Intro />
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
                Alert.alert("Contract Signed!", "Thank you for signing the contract.", [
                    { text: "OK", onPress: () => console.log("Contract signed successfully") }
                ]);
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
