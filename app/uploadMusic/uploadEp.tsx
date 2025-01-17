import { View, Text } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AppButton } from "@/components/app-components/button";
import FileUpload from "@/components/uploadMusicFlow/FileUpload";
import EPBasicInfo from "@/components/uploadMusicFlow/ep/uploadEP-BasicInfo";
import TrackInfo from "@/components/uploadMusicFlow/ep/uploadEP-TrackInfo";
import EPPreview from "@/components/uploadMusicFlow/ep/uploadEP-PreviewUpload";

const TRACK_COUNT: number = 4;

const UploadEP = () => {
  const [flow, setFlow] = useState<"BasicInfo" | "EPDetails" | "PreviewUpload">(
    "BasicInfo"
  );
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions?.({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#000"
      },
      headerLeft: () => (
        <AppBackButton name="Upload music" onBackPress={() => handleBack()} />
      ),
      headerTitle: ""
    });
  }, [navigation, flow]);

  const handleNextPage = () => {
    if (flow === "BasicInfo") {
      setFlow("EPDetails");
    } else if (flow === "EPDetails") {
      setFlow("PreviewUpload");
    }
  };

  const handleBack = () => {
    if (flow === "BasicInfo") {
      navigation.goBack();
    } else if (flow === "EPDetails") {
      setFlow("BasicInfo");
    } else if (flow === "PreviewUpload") {
      setFlow("EPDetails");
    }
  };

  const handleFlow = () => {
    switch (flow) {
      case "BasicInfo":
        return <EPBasicInfo />;
      case "EPDetails":
        return <TrackInfo trackCount={TRACK_COUNT} />;
      case "PreviewUpload":
        return <EPPreview />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingBottom: 120
      }}
      className="flex-1 min-h-screen px-[24px]">
      <View>{handleFlow()}</View>

      <AppButton.Primary
        text="Continue"
        color="#57E09A"
        loading={false}
        onPress={handleNextPage}
      />
    </KeyboardAwareScrollView>
  );
};

export default UploadEP;
