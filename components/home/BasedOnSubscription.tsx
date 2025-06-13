import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import FastImage from "react-native-fast-image";

const ExploreDiscographies = ({
  title,
  data,
  isLoading,
}: {
  title: string;
  data: any[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <View className="mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="mt-4"
        >
          {[...Array(5)].map((_, index) => (
            <ProfileCard key={index} loading={true} item={null} />
          ))}
        </ScrollView>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className="mb-6 mt-6">
      <Text className="text-[#D2D3D5] text-[24px] font-TankerRegular font-bold mb-4">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-x-6"
      >
        {data.map((item: any, index: React.Key) => (
          <ProfileCard key={index} loading={false} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ExploreDiscographies;

const ProfileCard = ({ item, loading }: { item: any; loading: boolean }) => {
  const router = useRouter();
  const followers = item?.followers || [];

  return (
    <Pressable
      onPress={() => {
        if (!loading && item?._id) {
          router.push({
            pathname: `/(musicTabs)/(home)/_screens/artist/${item?._id}`,
            params: {
              id: item?._id,
            },
          });
        }
      }}
      className="items-center gap-y-2"
    >
      <Skeleton
        colorMode="dark"
        radius="round"
        height={140}
        width={140}
        show={!item}
        transition={{
          type: "timing",
          duration: 1000,
        }}
      >
        <MotiView>
          {item?.profileImage && (
            <FastImage
              source={{
                uri:
                  item?.profileImage ||
                  "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                width: 140,
                height: 140,
                borderRadius: 100, // Matching Figma's 100px border radius
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
        </MotiView>
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
        className="items-center"
      >
        <Skeleton
          colorMode="dark"
          width={87}
          height={22}
          show={loading}
          transition={{
            type: "timing",
            duration: 1000,
          }}
        >
          <MotiView>
            {!loading && (
              <Text
                className="text-[#ffffff] text-[16px] text-center font-PlusJakartaSansBold font-bold tracking-[-0.32px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.name}
              </Text>
            )}
          </MotiView>
        </Skeleton>
        <Skeleton
          colorMode="dark"
          width={80}
          height={16}
          show={loading}
          transition={{
            type: "timing",
            duration: 1000,
          }}
        >
          <MotiView>
            {!loading && (
              <Text className="text-[#63656b] text-[12px] font-PlusJakartaSansBold font-bold tracking-[-0.24px]">
                {followers.length}M Tribestars
              </Text>
            )}
          </MotiView>
        </Skeleton>
      </MotiView>
    </Pressable>
  );
};
