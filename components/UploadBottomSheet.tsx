import React, { useRef, memo } from "react";
import {
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { PlusSignIcon, FileUploadIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Modalize } from "react-native-modalize";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Portal } from "@gorhom/portal";

// Constants for styling and configuration
const COLORS = {
  PRIMARY: "#4CD964",
  BACKGROUND: "#0A0B0F",
  SECONDARY: "#1C1C1E",
  TEXT_GRAY: "#787A80",
  WHITE: "#fff",
  BLACK: "#000",
};

const MODAL_HEIGHT = 800;

const FeatureItem = ({ text }: { text: string }) => (
  <Text className="font-PlusJakartaSansRegular text-white text-base">
    ◆ {text}
  </Text>
);

// Change the component definition to use function declaration
function UploadBottomSheet() {
  const modalizeRef = useRef<Modalize>(null);

  const handleOpen = () => modalizeRef.current?.open();
  const handleContinue = () => router.push("/uploadMusic");

  const features = [
    "Choose upload types",
    "Add features",
    "Include necessary metadata",
    "Upload your own cover art",
  ];

  return (
    <SafeAreaProvider>
      <TouchableOpacity 
        onPress={handleOpen}
        className="w-12 h-12 rounded-full bg-[#4CD964] items-center justify-center mb-8"
      >
        <PlusSignIcon size={24} color={COLORS.BLACK} />
      </TouchableOpacity>
      <Portal>
        <Modalize
          modalStyle={{
            width: wp(100),
            backgroundColor: COLORS.BACKGROUND,
          }}
          modalHeight={MODAL_HEIGHT}
          ref={modalizeRef}
        >
          <View className="px-6 pt-8">
            <View className="items-center mb-8">
              <View className="bg-[#12141B] rounded-full p-[60px] mb-6">
                <FileUploadIcon size={64} color={COLORS.PRIMARY} variant="solid" />
              </View>
            </View>

            <View className="items-start gap-y-[32px] w-full">
            <View>
             <Text className="font-PlusJakartaSansBold text-[28px] text-white mb-2">
                Uploading music on Looop
              </Text>
              <Text className="font-PlusJakartaSansRegular text-[16px] text-[#D2D3D5]">
                You're all set to share your music with everyone, and we've made it super easy for you!
              </Text>
           </View>
        
          <View className="bg-[#12141B] rounded-2xl p-[32px] w-full">
              <Text className="font-PlusJakartaSansBold text-[#787A80] text-[20px] mb-4">
                You can now:
              </Text>
              <View className="gap-y-4">
                {features.map((feature, index) => (
                  <FeatureItem key={index} text={feature} />
                ))}
              </View>
            </View>
            </View>

      

            <TouchableOpacity 
              onPress={handleContinue}
              className="bg-[#4CD964] rounded-full py-4 mt-[20%] mb-4"
            >
              <Text className="font-PlusJakartaSansBold text-black text-center text-base">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </Modalize>
      </Portal>
    </SafeAreaProvider>
  );
}

// Apply memo after the function definition
const MemoizedUploadBottomSheet = memo(UploadBottomSheet);
MemoizedUploadBottomSheet.displayName = 'UploadBottomSheet';

export default MemoizedUploadBottomSheet;