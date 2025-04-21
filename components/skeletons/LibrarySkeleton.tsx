import { View } from "react-native";
import React from "react";

export const LibrarySkeleton = () => {
  return (
    <View className="flex-1">
      {/* Horizontal frames skeleton */}
      <View className="flex-row gap-3 mt-6 pl-2">
        {[1, 2, 3].map((_, index) => (
          <View
            key={index}
            className="w-[190px] h-[160px] rounded-[24px] bg-gray-200 animate-pulse"
          />
        ))}
      </View>

      {/* Recently played skeleton */}
      <View className="mt-6 px-4">
        <View className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
        <View className="mt-4 flex-row flex-wrap gap-4">
          {[1, 2, 3, 4].map((_, index) => (
            <View
              key={index}
              className="w-[160px] h-[160px] rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </View>
      </View>
    </View>
  );
};
