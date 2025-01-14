import { View, Text } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { AppBackButton } from "@/components/app-components/back-btn";
import TrackUploadForm from "@/components/uploadMusicFlow/TrackUploadForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { AppButton } from "@/components/app-components/button";
import FileUpload from "@/components/uploadMusicFlow/FileUpload";

const uploadSingle = () => {
  const [flow, setFlow] = useState("Track info");
  const navigation = useNavigation();
  const [coverImage, setCoverImage] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: "#000"
      },
      headerLeft: () => (
        <AppBackButton
          name="Upload music"
          onBackPress={() => console.log("hello")}
        />
      ),
      headerTitle: ""
    });
  }, [navigation]);

  const handleNextPage = () => {
    if (flow === "Track info") {
      setFlow("File Metadata");
    }
    // Add more cases here if you have more steps
  };

  const handleFlow = () => {
    switch (flow) {
      case "Track info":
        return <TrackUploadForm />;
      case "File Metadata":
        return <FileUpload />;
      default:
        break;
    }
  };
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        paddingBottom: 120
      }}
      className="flex-1 min-h-screen px-[24px]">
      <Text className="text-[24px] font-PlusJakartaSansBold leading-[30px] text-[#F4F4F4]">
        Upload single - {flow}
      </Text>
      <View className="py-[32px] px-[24px] bg-[#0A0B0F] gap-y-[32px] mt-[32px]">
        <Text className="text-[#787A80] text-[20px] leading-[22px] font-PlusJakartaSansMedium text-start">
          Track info
        </Text>
        {handleFlow()}
      </View>
      <AppButton.Primary
        text="Continue"
        color="#57E09A"
        loading={false}
        onPress={handleNextPage}
      />
    </KeyboardAwareScrollView>
  );
};

export default uploadSingle;
