import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';

export const SmallCardSkeleton = () => {
  return (
    <View className="w-[180px]">
      <View className="w-[180px] h-[180px] rounded-[24px] bg-[#2A2A2A] overflow-hidden">
        {/* Bottom blur view simulation */}
        <View className="h-[40%] absolute bottom-0 w-full bg-[#1A1A1A] px-3 py-2">
          <View className="flex-row items-center gap-x-1">
            <View className="h-[14px] w-[70%] bg-[#2A2A2A] rounded-md" />
            <View className="h-[16px] w-[16px] bg-[#2A2A2A] rounded-full" />
          </View>
          <View className="h-[12px] w-[40%] bg-[#2A2A2A] rounded-md mt-1" />
        </View>
      </View>
    </View>
  );
};

export const BigCardSkeleton = () => {
  return (
    <View className="w-[283px] gap-x-5">
      <View className="h-[389px] w-[283px] bg-[#2A2A2A] rounded-[34px] overflow-hidden">
        {/* Top badge simulation */}
        <View
          className="bg-[#1A1A1A] rounded-[24px] flex-row items-center gap-x-[6px] absolute"
          style={{
            top: 16,
            left: 16,
            paddingHorizontal: 12,
            paddingVertical: 8
          }}
        >
          <View className="h-[12px] w-[80px] bg-[#2A2A2A] rounded-md" />
          <View className="h-[14px] w-[14px] bg-[#2A2A2A] rounded-full" />
        </View>

        {/* Bottom blur view simulation */}
        <View
          className="absolute bottom-0 w-full bg-[#1A1A1A]"
          style={{
            height: "45%",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        >
          <View className="flex-1 justify-end p-6 gap-y-2">
            <View className="h-[20px] w-[80%] bg-[#2A2A2A] rounded-md" />
            <View className="h-[28px] w-[90%] bg-[#2A2A2A] rounded-md" />
            <View className="flex-row w-full mt-2">
              <View className="h-[32px] w-[100px] bg-[#2A2A2A] rounded-[10px]" />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
