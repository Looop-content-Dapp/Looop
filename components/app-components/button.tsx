import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  loading: boolean;
  text: string;
}

const Primary = ({ text = "Action", loading, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      className="bg-orange-500 disabled:opacity-30 items-center py-4 rounded-full"
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator className="text-white" size={24} />
      ) : (
        <Text className="text-lg font-PlusJakartaSansMedium text-white">
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const AppButton = {
  Primary,
};
