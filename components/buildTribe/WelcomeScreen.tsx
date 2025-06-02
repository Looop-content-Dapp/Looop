import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  ScaledSize,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import TribesInfoModal from "../modals/TribesInfoModal";

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  const [screenDimensions, setScreenDimensions] = useState<ScaledSize>(
    Dimensions.get("window")
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  // Calculate dynamic dimensions
  const imageWidth = Math.min(screenDimensions.width * 0.7, 265);
  const imageHeight = (imageWidth * 241.72) / 265;
  const topMargin = screenDimensions.height * 0.15;

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  // Create dynamic styles based on screen dimensions
  const dynamicStyles = StyleSheet.create({
    imageContainer: {
      marginTop: topMargin,
      width: imageWidth,
      height: imageHeight,
    },
    contentContainer: {
      marginTop: screenDimensions.height * 0.05,
    },
    title: {
      fontSize: Math.min(24, screenDimensions.width * 0.06),
    },
    description: {
      fontSize: Math.min(16, screenDimensions.width * 0.04),
    },
    button: {
      marginTop: screenDimensions.height * 0.15,
      bottom: Platform.OS === "ios" ? 90 : 30,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.mainContent}>
        <Image
          source={require("../../assets/images/Tribez.png")}
          style={[styles.image, dynamicStyles.imageContainer]}
        />

        <View style={[styles.textContainer, dynamicStyles.contentContainer]}>
          <Text style={[styles.title, dynamicStyles.title]}>
            Welcome to tribes
          </Text>

          <Text style={[styles.description, dynamicStyles.description]}>
            Connect with your audience on a closer level than ever before
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleOpenModal}
          style={[styles.button, dynamicStyles.button]}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Start building</Text>
        </TouchableOpacity>
      </View>

      <TribesInfoModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onNext={onNext}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    minHeight: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  image: {
    resizeMode: "contain",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "PlusJakartaSansBold",
    color: "#f4f4f4",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    color: "#9CA3AF",
    fontFamily: "PlusJakartaSansRegular",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#A187B5",
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    borderRadius: 56,
    position: "absolute",
    left: 20,
    right: 20,
    ...Platform.select({
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
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSansMedium",
    color: "#12141B",
  },
});

export default WelcomeScreen;
