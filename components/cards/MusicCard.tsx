// MusicCard.js
import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Skeleton } from "moti/skeleton";
import { useRouter } from "expo-router";
import { useQuery } from "../../hooks/useQuery";

interface MusicCardProps {
  item: {
    id: string;
    title: string;
    artist: string;
    image: string;
    type: string;
    duration: string;
    totalTracks: string;
  };
  loading: boolean;
}

const MusicCard = ({ item, loading }: MusicCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [artistName, setArtistName] = useState("");
  const router = useRouter();

  const { getArtistDetails } = useQuery();

  // Utility function to truncate text
  const truncateText = (text: string, limit: number) => {
    return text?.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  useEffect(() => {
    const getArtistName = async (artistId: string) => {
      const artist = await getArtistDetails(artistId);
      const _artistName = artist?.data.name;
      setArtistName(_artistName);
    };
    getArtistName(item?.artist);
  }, []);
  return (
    <View>
      <Skeleton
        show={loading || isImageLoading}
        transition={{ type: "timing", duration: 2000 }}
        width={140}
        height={140}
      >
        {item?.image && (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/musicDetails",
                params: {
                  id: item?.id,
                  title: item?.title,
                  artist: artistName,
                  image: item?.image,
                  type: item.type,
                  duration: item?.duration,
                  totalTracks: item?.totalTracks,
                },
              })
            }
          >
            <Image
              source={{ uri: item?.image }}
              className="w-[140px] h-[140px] rounded-[10px]"
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          </Pressable>
        )}
      </Skeleton>

      <View className="pt-[8px] gap-y-[4px]">
        <Skeleton
          show={loading}
          transition={{ type: "timing", duration: 2000 }}
        >
          <Text className="text-[14px] text-[#fff] font-PlusJakartaSansBold font-normal">
            {truncateText(item?.title, 15)}
          </Text>
        </Skeleton>
        <Skeleton
          show={loading}
          transition={{ type: "timing", duration: 2000 }}
          colorMode="dark"
        >
          <Text className="text-[10px] font-PlusJakartaSansBold text-[#787A80] font-normal pt-[4px]">
            {item?.artist}
          </Text>
        </Skeleton>
      </View>
    </View>
  );
};

export default MusicCard;
