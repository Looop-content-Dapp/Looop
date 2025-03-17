import { View, ScrollView, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hooks";

const ExploreDiscographies = ({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: any[];
  isLoading: boolean;
}) => {
  const placeholderData = Array(5).fill({});
  return (
    <View className="mb-6">
      <Text className="text-[#F4F4F4] text-[20px] leading-[22px] tracking-[-0.69px] font-PlusJakartaSansBold px-4 mb-4">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-x-6 px-4"
      >
        {(isLoading ? placeholderData : data).map(
          (item: any, index: React.Key) => (
            <ProfileCard key={index} loading={isLoading} item={item} />
          )
        )}
      </ScrollView>
    </View>
  );
};

export default ExploreDiscographies;

const ProfileCard = ({ item, loading }: { item: any; loading: boolean }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const followers = item?.followers || [];

  return (
    <Pressable
      onPress={() => {
        if (!loading && item?._id) {
          router.push({
            pathname: `/artist/${item?._id}`,
            params: {
              id: item?._id,
              artistId: item?.artistId,
              image: item?.profileImage,
              name: item?.name,
              bio: item?.biography,
              isVerified: item?.verified,
              email: item?.email,
              websiteUrl: item?.websiteurl,
              address1: item?.address1,
              address2: item?.address2,
              city: item?.city,
              country: item?.country,
              postalCode: item?.postalcode,
              followers: followers,
              monthlyListeners: item?.monthlyListeners,
              popularity: item?.popularity,
              genres: item?.genres,
              labels: item?.labels,
              topTracks: item?.topTracks,
              createdAt: item?.createdAt,
              updatedAt: item?.updatedAt,
              isActive: item?.isActive,
              isFollowing: String(followers?.includes(userdata?._id)), // Convert to string
              noOfFollowers: followers.length,
            },
          });
        }
      }}
      className="items-center gap-y-[8px] mb-2"
    >
        <Skeleton
          colorMode="dark"
          radius="round"
          height={140}
          width={140}
          show={loading || isImageLoading}
          transition={{
            type: "timing",
            duration: 1000,
          }}
        >
          {item?.profileImage && (
            <Image
              source={{ uri: item?.profileImage }}
              className="w-[140px] h-[140px] rounded-full"
              onLoadStart={() => setIsImageLoading(true)}
              onLoadEnd={() => setIsImageLoading(false)}
            />
          )}
        </Skeleton>
      <MotiView
        transition={{
          type: "timing",
          duration: 1000,
          loop: true,
        }}
        animate={{
          opacity: loading ? [0.5, 1] : 1,
        }}
      >
        <Skeleton
          colorMode="dark"
          width={120}
          show={loading}
          transition={{
            type: "timing",
            duration: 1000,
          }}
        >
          <Text className="text-[#fff] text-center font-bold font-PlusJakartaSansBold text-[14px]">
            {item?.name}
          </Text>
        </Skeleton>
      </MotiView>
    </Pressable>
  );
};
