import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";
import { ArrowRight01Icon } from "@hugeicons/react-native";
import useMusicPlayer from "@/hooks/music/useMusicPlayer";
import { MotiView } from "moti";

// ... existing types ...

const ChartItemSkeleton = () => {
  return (
    <View className="flex-row items-center justify-between py-3 px-4">
      <View className="flex-row items-center flex-1">
        <MotiView
          className="w-8 h-4 bg-[#202227] rounded"
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
          }}
        />
        <MotiView
          className="w-12 h-12 rounded-lg mx-3 bg-[#202227]"
          from={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 1000,
            loop: true,
            delay: 100,
          }}
        />
        <View className="flex-1">
          <MotiView
            className="w-32 h-4 bg-[#202227] rounded mb-2"
            from={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
              delay: 200,
            }}
          />
          <MotiView
            className="w-24 h-4 bg-[#202227] rounded"
            from={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 1000,
              loop: true,
              delay: 300,
            }}
          />
        </View>
      </View>
      <MotiView
        className="w-12 h-4 bg-[#202227] rounded"
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 1000,
          loop: true,
          delay: 400,
        }}
      />
    </View>
  );
};

type ChartItemProps = {
  position: number;
  title: string;
  artist: string;
  imageUrl: string;
  duration: string;
  onPress?: () => void;
  trackData?: any; // Add this to pass the full track data
};

type ChartListSectionProps = {
  title: string;
  data: ChartItemProps[];
};

const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFr0lEQVR4nO2ZeWxUVRTGf522Q2kLtAhtaSnQUkAKtMiiQCMCAcIiBsQQI4sKJCwCEkQDhCUYAgKGRVkiEMISQFkCyBIQEAhCwLCjgOyoQJEKXShtoZ3xO8l5yWOYmc7M6/BP+JIvmcybe+453z333HvOvQ/+R8IjHagLtAE6Ax2AZkBDoCZQHagElAJFQD5wA7gMnANOA8eBI0BuGcddJjQApgBbgQdAcRnbfWArMAmoV17BVwYmA2eA4hjbGeBjoEV5BN8c2OYj0ELgKLAKmA70AhKBWkA8UAWoCtQHWgOJwHvASuAYUOQj+K1As7IMfhCQ5dHxbWA+0AaIi8JfHNAWWAAc8/CZBQwsq+CfBrZ7dHgQGIX7KUaDSsBoXE7Z/m4HniltwE8BK4EfPG7+KzAWqFRKv5WBccBej/81wESgQmkC7wOcLCHoZR7XZYEKwEfAPY//E0DvUvitBKz2CLwQmIvzrWVBJeBT4L7HzzqgciTOOgFXPALTgQ4RjrUdmAG8DnQF2gOvAu8C84BfPOPuAV2j9N8RuOoZbwXQMZyh+sAGj6EsYCyuOIWDBGC9x/994FNcxRUKCcBXQIHH5magYTjDX3sMLwLqhTE6BLjpsTkGvBjGLg74HDf7wTYXeCmU0RQP5wVgMNCX0Ei1+5+AHwlf6Y0H1nn8ZQODQhl87uGcAzwfwmACLlcC/u4Ao8MEnQCs9/i8jatVQmEgkO3xuxd4IZjBKI/DW0DvEAYbPJwLgBlhnrgFvhR3xQZwDOgWwrYPcMPj/weguq9yFY/yPKBHCGcvA+c9vKVhbFd6bArthRYK44Bcj/9MoKmv8iIP51QgPoSzF3D5G+BdHMYmFOKBbz28hcDUMEFP9/B/DXT3VW7zcP4cxlkd4KCHdyPwVBjbysAmD/cwUCuM7WwP/1GgTkBlG9zVF+BcBGd1gUMe7m/AM2FsqwA/enjXhrGtCGz28B4AagQqp3s4iyM4qwYkAb8Bu3DVVShUB3Z4uNOAqmFsKwHbPLy7gKcDlbs8nAsjOKsGfI+7EguBLWFsqwLbPdzfhbEFV5kFgv8RqBSo3O/hfD+Cs+rAj7ir8SHwbRjbGrgcD3CvDWML8IGHdx9QKVC538OZEsFZLI0qwA4P93dhrYFFHt7dQMVA5X4P5+QIzmJpxOFegwHuVWFsE4GlHt7tQIVA5X4P55QIzmJtfOHhXRHGrj3uRRng/h6oGKjc7+GcFsFZrI2PPbwrw9i1Aa55eNcHKvZ7OGdEcBZrY5qHd2UYu5bAJQ/vd4GK/R7OWRGcxdqY4uFdGcauKXDew7sxUHHQw/lxBGexNiZ5eFeFsWsInPTwbg1UHPZwzgvjLNbGOA/v6jB29YEjHt4dgYojHs75YZzF2hjt4V0Txq4OsM/DuytQcdzDuSCMs1gbIz28a8PYJeDeEwLcewMVpzycX4VxFmtjmId3XRi7WsAuD+/+QMU5D+c3YZzF2kj28K4PY1cT2Onh/SlQccXDuTGMs1gb/T28G8LYVQd2e3gPBSqueziTwziLtdHbw7sxjF0VYKeH93Cg4raHc0sYZ7E2unt4N4WxqwRs9/AeDVTc83BuC+Ms1kZXD+/mMHYVgK0e3uOBinwP584wzmJtdPbwbgljFwds8fCeClQUeTj3hnEWa6Ojh3drGLs43KdagPd0oKLYw3kgjLNYG+09vNvC2FUEfvDwngWe9FUe83AeC+Ms1kYbD+/2MHaVgM0e3vNATV/lKQ/n6TDOYm209vDuCGNXGdjg4b0I1PNVXvBwXgrjLNZGKw/vzjB2VYF1Ht7LQENf5VUP5/UwzmJttPTw7gpjVw1Y4+G9CjTxVd7ycN4J4yzWRgsP754wdtVx/4MI8N4Cmvsq73s474VxFmujmYd3bxi7GsAqD28e0DZQWeDhLAjjLNZGUw/vvjB2NYGVHt583K+1/+E/hj8ByrX5KBnHWqsAAAAASUVORK5CYII=';

const ChartItem = ({ position, title, artist, imageUrl, duration, onPress, trackData }: ChartItemProps) => {
    const { play } = useMusicPlayer();

    const handlePress = async () => {
      if (trackData) {
        const albumInfo = {
          title: trackData?.release?.title,
          type: trackData?.release?.type || "album",
          coverImage: trackData?.release?.artwork?.high,
        };

        await play(trackData, albumInfo);
      }
    };
    return (
        <Pressable
        onPress={handlePress}
          className="flex-row items-center justify-between py-3 px-4"
        >
          <View className="flex-row items-center flex-1">
            <Text className="text-[#787A80] font-PlusJakartaSansMedium text-[14px] w-8">{position}</Text>
            <Image
              source={{ uri: imageUrl }}
              defaultSource={{ uri: PLACEHOLDER_IMAGE }}
              className="w-12 h-12 rounded-lg mx-3"
            />
            <View className="flex-1">
              <Text className="text-white text-[16px] font-PlusJakartaSansBold" numberOfLines={1}>
                {title}
              </Text>
              <Text className="text-[#787A80] text-[14px] font-PlusJakartaSansMedium" numberOfLines={1}>
                {artist}
              </Text>
            </View>
          </View>
          <Text className="text-[#787A80]">{duration}</Text>
        </Pressable>
      );
}

const ChartListSection = ({ title, data, isLoading }: ChartListSectionProps) => {
    return (
      <View className="mt-6" style={{ width: wp("100%") }}>
       <View style={{ width: wp("100%") }}>
          <View className="flex-row items-center justify-between px- mb-4">
            <Text className="text-[#F4F4F4] text-[24px] font-TankerRegular">
              {title}
            </Text>
            <TouchableOpacity className="flex-row items-center gap-x-[4px]">
              <Text className="text-[16px] font-PlusJakartaSansMedium text-[#9A9B9F]">See all</Text>
              <ArrowRight01Icon size={24} color="#9A9B9F" variant="stroke" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="border-t border-[#12141B]">
          {isLoading ? (
            // Show 4 skeleton items while loading
            Array.from({ length: 4 }).map((_, index) => (
              <ChartItemSkeleton key={index} />
            ))
          ) : (
            data.map((item, index) => (
              <ChartItem key={index} {...item} />
            ))
          )}
        </View>
      </View>
    );
  };

export default ChartListSection;
