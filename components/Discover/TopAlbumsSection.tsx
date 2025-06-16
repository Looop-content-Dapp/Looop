import { View, Text, Image, Pressable, FlatList, StyleSheet } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

type AlbumItemProps = {
  position: number;
  title: string;
  artist: string;
  imageUrl: string;
  onPress?: () => void;
  explicit?: boolean;
};

type TopAlbumsSectionProps = {
  title: string;
  data: AlbumItemProps[];
};

const AlbumItem = ({ position, title, artist, imageUrl, explicit, onPress }: AlbumItemProps) => (
  <Pressable
    onPress={onPress}
    style={{ width: wp(40) }}
    className="mr-4"
  >
    <View className="relative">
      <Image
        source={{ uri: imageUrl }}
        className="w-full aspect-square rounded-[10px] bg-Grey/06"

      />
       <View style={styles.overlay} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,1)']}
        className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-lg"
      />
      <View className="absolute bottom-2 right-[20px] rounded-lg px-3 py-1">
        <Text className="text-white font-TankerRegular text-[48px]">#{position}</Text>
      </View>
    </View>
    <View className="mt-2">
      <View className="flex-row items-center">
        <Text className="text-white font-medium text-base" numberOfLines={1}>
          {title}
        </Text>
        {explicit && (
          <View className="ml-1 bg-[#787A80] rounded px-1">
            <Text className="text-[10px] text-white">E</Text>
          </View>
        )}
      </View>
      <Text className="text-[#787A80]" numberOfLines={1}>
        {artist}
      </Text>
    </View>
  </Pressable>
);

const TopAlbumsSection = ({ title, data }: TopAlbumsSectionProps) => {
  return (
    <View className="mt-8">
      <Text className="text-[#F4F4F4] text-[24px] font-TankerRegular px- mb-4">
        {title}
      </Text>
      <FlatList
        horizontal
        data={data}
        renderItem={({ item }) => <AlbumItem {...item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 4 }}
      />
    </View>
  );
};

export default TopAlbumsSection;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
      },
});
