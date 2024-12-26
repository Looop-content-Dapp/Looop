import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { Pressable, Text } from "react-native";

export const AppBackButton = ({
  name,
  onBackPress = () => {},
}: {
  name: string;
  onBackPress: () => void;
}) => {
  return (
    <Pressable
      className="flex flex-row gap-3 items-center"
      onPress={onBackPress}
    >
      <ArrowLeft02Icon size={24} color="#FFFFFF" />
      <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">
        {name}
      </Text>
    </Pressable>
  );
};
