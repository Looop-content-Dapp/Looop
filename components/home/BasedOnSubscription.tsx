import { View, ScrollView, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import { useRouter } from "expo-router";
import { useAppSelector } from "@/redux/hooks";
import { Avatar } from "react-native-elements";
import FastImage from 'react-native-fast-image';

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
        {/* <Skeleton
          colorMode="dark"
          width={200}
          height={24}
          show={true}
          transition={{
            type: "timing",
            duration: 1000,
          }}
        /> */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-6 px-4 mt-4"
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
    <View className="mb-6">
      <Text className='text-[#D2D3D5] text-[20px] font-PlusJakartaSansMedium mb-4'>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-x-6 px-4"
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
  const { userdata } = useAppSelector((state) => state.auth);
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
        show={!item}
        transition={{
          type: "timing",
          duration: 1000,
        }}
      >
      {item?.profileImage && (
          <FastImage
            source={{
              uri: item?.profileImage || "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
              priority: FastImage.priority.normal,
              cache: FastImage.cacheControl.immutable
            }}
            style={{
              width: 140,
              height: 140,
              borderRadius: 70, // For rounded image
            }}
            resizeMode={FastImage.resizeMode.cover}
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
          height={20}
          show={loading}
          transition={{
            type: "timing",
            duration: 1000,
          }}
        >
          {!loading && (
            <Text className="text-[#F4F4F4] text-center font-PlusJakartaSansSemiBold">
              {item?.name}
            </Text>
          )}
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
          className="mt-1"
        >
          {!loading && (
            <Text className="text-[#8E8E8E] text-[12px] text-center">
              {followers.length} followers
            </Text>
          )}
        </Skeleton>
      </MotiView>
    </Pressable>
  );
};
