import { View, Text, Image, SafeAreaView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import CreatorForm from "@/components/CreatorOnboarding/creatorProfileFlow/CreatorForm";
import { AppButton } from "@/components/app-components/button";

type ProfileFlowState = "INTRO" | "CREATE_PROFILE";

const CreateProfile = () => {
  const [currentFlow, setCurrentFlow] = useState<ProfileFlowState>("INTRO");
  const navigation = useNavigation();
  const { back, push } = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: currentFlow === "CREATE_PROFILE",
      headerLeft: () => (
        <AppBackButton
          name="Set up creator profile"
          onBackPress={() => {
            if (currentFlow === "CREATE_PROFILE") {
              setCurrentFlow("INTRO");
            } else {
              back();
            }
          }}
        />
      ),
      headerRight: () => null,
    });
  }, [navigation, currentFlow]);

  const renderIntro = () => (
    <View>
      <Image
        source={require("../../assets/images/createProfile.png")}
        resizeMode="cover"
        style={{ width: "90%", alignSelf: "center", marginTop: "20%" }}
      />
      <View style={{ marginTop: "30%", alignSelf: "center", gap: 12 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#FFFFFF" }}>
          Create your profile
        </Text>
        <Text style={{ fontSize: 16, color: "#D2D3D5" }}>
          Ready to create magic? Let's get you started by setting up your
          creator profile
        </Text>
      </View>
    </View>
  );

  const handleFlow = () => {
    switch (currentFlow) {
      case "INTRO":
        return renderIntro();
      case "CREATE_PROFILE":
        return <CreatorForm />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    switch (currentFlow) {
      case "INTRO":
        setCurrentFlow("CREATE_PROFILE");
        break;
      case "CREATE_PROFILE":
        push("/creatorOnboarding/ContractSigning");
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#040405" }}>
      {handleFlow()}
      <View style={{ position: "absolute", bottom: 60, right: 24, left: 24 }}>
        <AppButton.Primary
          text="Continue"
          color="#A187B5"
          loading={false}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateProfile;
