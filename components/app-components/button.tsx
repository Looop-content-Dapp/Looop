import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  loading: boolean;
  text: string;
  color: string
}

const Primary = ({ text = "Action", loading, color,  ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
    style={{backgroundColor: color}}
      className="disabled:opacity-30 items-center py-4 rounded-full"
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator className="text-white" size={24} />
      ) : (
        <Text className="text-lg font-PlusJakartaSansMedium text-[#040405]">
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const AppButton = {
  Primary
};
