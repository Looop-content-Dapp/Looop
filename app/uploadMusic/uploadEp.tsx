import { View, Text, Alert } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AppButton } from "@/components/app-components/button";
import EPBasicInfo from "@/components/uploadMusicFlow/ep/uploadEP-BasicInfo";
import TrackInfo from "@/components/uploadMusicFlow/ep/uploadEP-TrackInfo";
import EPPreview from "@/components/uploadMusicFlow/ep/uploadEP-PreviewUpload";
import { EPUploadProvider, useEPUpload } from "@/context/EPUploadContext";
import { validateEPBasicInfo, validateEPTrackInfo } from "@/utils/epValidation";

const UploadEPContent = () => {
  const { epData } = useEPUpload();
  const [flow, setFlow] = useState<"BasicInfo" | "EPDetails" | "PreviewUpload">("BasicInfo");
  const [trackCount, setTrackCount] = useState<number>(2);
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
      const validation = validateEPBasicInfo(epData);
      if (!validation.isValid) {
        Alert.alert("Missing Information", validation.message);
        return;
      }
      setFlow("EPDetails");
    } else if (flow === "EPDetails") {
      const validation = validateEPTrackInfo(epData.tracks);
      if (!validation.isValid) {
        Alert.alert("Missing Information", validation.message);
        return;
      }
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
        return <EPBasicInfo onTrackCountChange={setTrackCount} />;
      case "EPDetails":
        return <TrackInfo trackCount={trackCount} />;
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

const UploadEP = () => {
  return (
    <EPUploadProvider>
      <UploadEPContent />
    </EPUploadProvider>
  );
};

export default UploadEP;
