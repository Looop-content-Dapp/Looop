import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import RecommendedMusicSkeleton from "../SkeletonLoading/RecommendedMusicSkeleton";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const CARD_GAP = 10;

interface Artist {
  name: string;
  profileImage?: string;
}

interface Artwork {
  cover_image?: {
    high: string;
  };
  high?: string;
}

interface Release {
  _id: string;
  artwork?: Artwork;
  type?: string;
}

interface MusicItem {
  title: string;
  artist: Artist | string;
  release: Release;
  isExplicit?: boolean;
  cover?: string;
}

interface RecommendedMusicProps {
  data: MusicItem[];
  isLoading: boolean;
  title?: string;
}

const RecommededMusic: React.FC<RecommendedMusicProps> = ({
  data,
  isLoading,
  title = "Recommended For You",
}) => {
  const router = useRouter();

  if (isLoading) {
    return <RecommendedMusicSkeleton />;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const truncateText = (text: string, limit: number) => {
    return text?.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  const getImageUrl = (item: MusicItem): string => {
    if (item.release?.artwork?.cover_image?.high) {
      return item.release.artwork.cover_image.high;
    } else if (item.release?.artwork?.high) {
      return item.release.artwork.high;
    } else if (item.cover) {
      return item.cover;
    } else if (typeof item.artist !== "string" && item.artist?.profileImage) {
      return item.artist.profileImage;
    }
    return "https://via.placeholder.com/300";
  };

  const renderExplicitBadge = () => (
    <View className="bg-[#999] rounded px-1 py-0.5">
      <Text className="text-black text-[10px] font-semibold">E</Text>
    </View>
  );

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className="mt-6 mb-4">
     <Text className="text-[#D2D3D5] text-[24px] font-TankerRegular mb-4">
         {title}
       </Text>
      <View className="flex-1">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: CARD_GAP }}
          decelerationRate="fast"
        >
          {data.map((item, index) => (
            <View key={index} className="mr-2.5" style={{ width: CARD_WIDTH }}>
              <Pressable
                style={({ pressed }) => [
                  { width: "250%", height: "auto", opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/(musicTabs)/(home)/_screens/musicDetails",
                    params: {
                      id: item.release._id,
                    },
                  });
                }}
              >
                <Image
                  source={{ uri: getImageUrl(item) }}
                  className="w-full aspect-square rounded-lg bg-[#2a2a2a]"
                  resizeMode="cover"
                />

                <View className="mt-2 w-full">
                  <View className="flex-row items-center gap-1 w-full">
                    <Text
                      numberOfLines={1}
                      className="text-[#D2D3D5] text-[14px] font-PlusJakartaSansBold font-bold flex-1"
                    >
                      {truncateText(item.title, 15)}
                    </Text>
                    {item.isExplicit && renderExplicitBadge()}
                  </View>
                  <View className="flex-row mt-0.5 gap-1 w-full">
                    <Text
                      numberOfLines={1}
                      className="text-[#63656B] text-[12px] font-PlusJakartaSansBold font-bold"
                    >
                      {typeof item.artist === "string"
                        ? item.artist
                        : item.artist?.name}
                    </Text>
                    {item.release?.type && (
                      <Text className="text-[11px] text-[#999] bg-opacity-10 px-1 py-0.5 rounded overflow-hidden capitalize">
                        {item.release.type}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default RecommededMusic;
