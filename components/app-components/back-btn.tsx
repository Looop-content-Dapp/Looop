import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { Pressable, Text, View } from "react-native";

export const AppBackButton = ({
  name,
  onBackPress = () => {},
}: {
  name: string;
  onBackPress: () => void;
}) => {
  return (
    <Pressable className="flex flex-row gap-2" onPress={onBackPress}>
      <ArrowLeft02Icon size={32} color="#FFFFFF" />
      <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
        {name}
      </Text>
    </Pressable>
  );
};
