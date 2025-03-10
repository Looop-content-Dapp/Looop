import React, { useLayoutEffect} from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useNavigation } from "expo-router";
import { AppButton } from "@/components/app-components/button";

const Welcome = () => {
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false
        });
      }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../../../assets/images/audioOrange.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Learning your taste</Text>
          <Text style={styles.title}>
            Before we get you started listening to all your favorite artistes, we want to get a feel for your music taste so we can recommend you amazing sounds.
          </Text>
        </View>
      </View>
      <AppButton.Secondary
        onPress={() => router.push("/(settingUp)/musicSetup/(steps)/genres")}
        text="Get Started"
        color="#FF6D1B"
        className="absolute bottom-6 left-6 right-6 z-10 py-[16px] rounded-[56px]"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040405",
  },
  content: {
    alignItems: "center",
    paddingBottom: 10,
  },
  image: {
    width: 215,
    height: 215,
    marginTop: "20%",
  },
  textContainer: {
    gap: 16,
    alignItems: "center",
    width: "90%",
    marginTop: "20%",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#A0A0A0",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "PlusJakartaSansBold",
    color: "#f4f4f4",
    textAlign: "center",
    lineHeight: 30,
  },
});

export default Welcome;
