import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import TribesInfoModal from "../modals/TribesInfoModal";

const WelcomeScreen = ({ onNext }) => {
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("window")
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const imageWidth = Math.min(screenDimensions.width * 0.7, 265);
  const imageHeight = (imageWidth * 241.72) / 265;
  const topMargin = screenDimensions.height * 0.15;

  const platformStyles = {
    buttonShadow: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View
        style={{
          flex: 1,
          minHeight: "100%",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Image
          source={require("../../assets/images/Tribez.png")}
          style={{
            marginTop: topMargin,
            width: imageWidth,
            height: imageHeight,
            resizeMode: "contain",
          }}
        />

        <View
          style={{
            marginTop: screenDimensions.height * 0.05,
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: Math.min(24, screenDimensions.width * 0.06),
              fontFamily: "PlusJakartaSansBold",
              color: "#f4f4f4",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Welcome to tribes
          </Text>

          <Text
            style={{
              fontSize: Math.min(16, screenDimensions.width * 0.04),
              color: "#9CA3AF",
              fontFamily: "PlusJakartaSansRegular",
              textAlign: "center",
              paddingHorizontal: 10,
            }}
          >
            Connect with your audience on a closer level than ever before
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: "#A187B5",
            paddingVertical: 16,
            width: "100%",
            alignItems: "center",
            borderRadius: 56,
            marginTop: screenDimensions.height * 0.15,
            position: "absolute",
            bottom: Platform.OS === "ios" ? 90 : 30,
            left: 20,
            right: 20,
            ...platformStyles.buttonShadow,
          }}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "PlusJakartaSansMedium",
              color: "#12141B",
            }}
          >
            Start building
          </Text>
        </TouchableOpacity>
      </View>
      <TribesInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNext={onNext}
      />
    </SafeAreaView>
  );
};

export default WelcomeScreen;
