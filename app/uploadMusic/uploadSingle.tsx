import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-gesture-handler";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const baseWidth = 391;
const scale = Math.min(SCREEN_WIDTH / baseWidth, 1.2);
const responsiveSize = (size: number) => {
  const scaledSize = Math.round(size * scale);
  return Math.max(scaledSize, size * 0.7);
};

const isIOS = Platform.OS === "ios";

const uploadSingle = () => {
  const router = useRouter();

  const [dimensions, setDimensions] = useState({
    window: Dimensions.get("window")
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Upload single - Track info</Text>
          <View style={styles.trackInfoSection}>
            {/* Track Info */}
            <View>
              <Text style={styles.trackInfoTitle}>Track Info</Text>

              {/* SongName */}
              <View style={styles.songNameSection}>
                <Text style={styles.sectionTitle}>Song name</Text>
                <Text style={styles.songNameDescription}>
                  Don't include features in the title, you can add it later
                  below
                </Text>
                <TextInput
                  placeholderTextColor="#787A80"
                  placeholder="Song name here"
                  // value={emailAddress}
                  // onChangeText={setEmailAddress}
                  // className="h-16 text-sm font-PlusJakartaSansRegular bg-Grey/07 text-Grey/04 rounded-full px-8"
                  inputMode="email"
                  keyboardAppearance="dark"
                  keyboardType="email-address"
                />
              </View>

              {/* Select Type Section */}
              <View style={styles.songNameSection}>
                <Text style={styles.sectionTitle}>
                  Is this an original song or a cover?
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000"
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    padding: responsiveSize(16),
    paddingBottom: responsiveSize(80)
  },
  iconContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: SCREEN_HEIGHT * 0.08
  },
  contentContainer: {
    marginTop: responsiveSize(32),
    gap: responsiveSize(24)
  },
  textContainer: {
    gap: responsiveSize(8)
  },
  heading: {
    fontSize: responsiveSize(24),
    fontFamily: "PlusJakartaSans-Bold",
    color: "#FFFFFF"
  },
  subHeading: {
    fontSize: responsiveSize(14),
    fontFamily: "PlusJakartaSans-Regular",
    color: "#D2D3D5",
    lineHeight: responsiveSize(20)
  },
  featureCard: {
    padding: responsiveSize(24),
    backgroundColor: "#12141B",
    borderRadius: responsiveSize(16),
    gap: responsiveSize(16)
  },
  featureTitle: {
    fontSize: responsiveSize(16),
    fontFamily: "PlusJakartaSans-Bold",
    color: "#787A80"
  },
  title: {
    fontSize: responsiveSize(24),
    fontFamily: "PlusJakartaSans-Bold",
    color: "#FFFFFF",
    marginTop: responsiveSize(16)
  },

  buttonWrapper: {
    padding: responsiveSize(16),
    paddingBottom: isIOS ? responsiveSize(32) : responsiveSize(16),
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  },
  continueButton: {
    backgroundColor: "#4ADE80",
    borderRadius: responsiveSize(30),
    height: responsiveSize(48),
    justifyContent: "center",
    alignItems: "center"
  },
  continueButtonDark: {
    backgroundColor: "#1E1E1E"
  },
  darkButtonText: {
    color: "#FFFFFF"
  },
  backButton: {
    width: responsiveSize(32),
    height: responsiveSize(32),
    justifyContent: "center"
  },
  backButtonText: {
    fontSize: responsiveSize(20),
    color: "#FFFFFF"
  },
  uploadTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: responsiveSize(16),
    gap: responsiveSize(16)
  },
  uploadTypeCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: responsiveSize(16),
    padding: responsiveSize(12),
    justifyContent: "flex-end",
    alignItems: "flex-start",
    position: "relative",
    overflow: "hidden"
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#57E09A"
  },
  uploadTypeIconContainer: {
    position: "absolute",
    top: responsiveSize(-20),
    right: responsiveSize(-20),
    opacity: 0.5
  },
  uploadTypeText: {
    fontSize: responsiveSize(16),
    color: "#F4F4F4",
    fontFamily: "PlusJakartaSans-Medium"
  },
  selectedText: {
    color: "#57E09A"
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#000000",
    letterSpacing: 0.2
  },
  disabledButton: {
    opacity: 0.5
  },
  trackInfoSection: {
    paddingVertical: responsiveSize(32),
    paddingHorizontal: responsiveSize(24),
    backgroundColor: "#0A0B0F",
    marginTop: responsiveSize(32),
    borderRadius: responsiveSize(24)
  },
  trackInfoTitle: {
    marginBottom: responsiveSize(32),
    color: "#787A80",
    fontSize: responsiveSize(20),
    fontFamily: "PlusJakartaSans-Medium"
  },
  songNameSection: {
    marginBottom: responsiveSize(32)
  },
  sectionTitle: {
    marginBottom: responsiveSize(4),
    color: "#f4f4f4",
    fontSize: responsiveSize(16),
    fontFamily: "PlusJakartaSans-Medium"
  },
  songNameDescription: {
    marginBottom: responsiveSize(12),
    color: "#A5A6AA",
    fontSize: responsiveSize(14),
    fontFamily: "PlusJakartaSans-Medium"
  }
});

export default uploadSingle;
