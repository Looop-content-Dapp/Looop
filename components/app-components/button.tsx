import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  loading?: boolean;
  text: string;
  color: string;
  icon?: React.ReactNode; // Optional icon prop
}

const Primary = ({ text = "Action", loading, color, icon, ...props }: ButtonProps) => {
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
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className="text-lg font-PlusJakartaSansMedium text-[#040405]">
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Secondary = ({ text = "Action", loading, color, icon, ...props }: ButtonProps) => {
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
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className="text-lg font-PlusJakartaSansMedium text-white">
            {text}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}


export const AppButton = {
  Primary,
  Secondary,
};
