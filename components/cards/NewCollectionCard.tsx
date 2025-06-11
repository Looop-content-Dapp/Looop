import React from "react";
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";

interface NewCollectionCardProps {
  title: string;
  subtitle: string;
  backgroundImage: ImageSourcePropType;
  foregroundImage: ImageSourcePropType;
}

const NewCollectionCard: React.FC<NewCollectionCardProps> = ({
  title,
  subtitle,
  backgroundImage,
  foregroundImage,
}) => {
  return (
    <View className="gap-y-[12px]">
      <ImageBackground
        source={backgroundImage}
        className="bg-[#2DD881] w-[100%] mx-auto h-[157px] overflow-hidden flex-row items-center mb-[32px] justify-between relative rounded-[10px]"
        resizeMode="cover"
      >
        <View className="h-full px-4 justify-center z-10">
          <View className="w-[90%]">
            <Text className="text-[28px] w-[50%] text-[#111318] font-TankerRegular font-extrabold leading-tight">
              {title}
            </Text>
            <Text className="text-[14px] w-[60%] text-[#111318] font-PlusJakartaSansMedium mt-1">
              {subtitle}
            </Text>
          </View>
        </View>
        <Image
          source={foregroundImage}
          className="h-full w-[65%] absolute right-5"
          resizeMode="cover"
        />
      </ImageBackground>
    </View>
  );
};

export default NewCollectionCard;
