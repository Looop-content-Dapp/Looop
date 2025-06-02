import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';

const Spacer = ({ height = 8 }) => <View style={{ height }} />;

export const TribeCardSkeleton = () => {
  return (
    <View className="w-[283px] h-[320px] mr-3 rounded-[20px] overflow-hidden bg-[#202227]">
      <Skeleton.Group show={true}>
        {/* Cover Image */}
        <View className="w-full h-[60%]">
          <Skeleton colorMode="dark" height="100%" />
        </View>

        {/* Artist Badge */}
        <View className="absolute top-4 left-4">
          <View className="flex-row items-center bg-[#111318] rounded-[24px] p-2 w-[120px]">
            <View className="w-5 h-5 rounded-full overflow-hidden">
              <Skeleton colorMode="dark" height={20} width={20} radius={10} />
            </View>
            <View className="ml-2 flex-1">
              <Skeleton colorMode="dark" height={12} width="80%" radius={4} />
            </View>
          </View>
        </View>

        {/* Bottom Content */}
        <View className="absolute bottom-0 w-full p-4">
          <Skeleton colorMode="dark" height={20} width="80%" radius={4} />
          <Spacer />
          <Skeleton colorMode="dark" height={16} width="60%" radius={4} />
          <Spacer height={16} />

          {/* Members List */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center bg-[#111318] rounded-[16px] p-2 flex-1">
              <View className="flex-row">
                {[1, 2, 3].map((i) => (
                  <View key={i} className="w-6 h-6 rounded-full overflow-hidden -ml-2">
                    <Skeleton colorMode="dark" height={24} width={24} radius={12} />
                  </View>
                ))}
              </View>
              <View className="ml-2">
                <Skeleton colorMode="dark" height={12} width={60} radius={4} />
              </View>
            </View>
            <View className="ml-2">
              <Skeleton colorMode="dark" height={32} width={32} radius={8} />
            </View>
          </View>
        </View>
      </Skeleton.Group>
    </View>
  );
};

export const SubscriptionCardSkeleton = () => {
  return (
    <View className="w-full h-[100px] my-[20px] rounded-[16px] overflow-hidden bg-[#202227] flex-row">
      <Skeleton.Group show={true}>
        {/* Left Image */}
        <View className="w-[100px] h-full">
          <Skeleton colorMode="dark" height="100%" />
        </View>

        {/* Content */}
        <View className="flex-1 p-3">
          <Skeleton colorMode="dark" height={20} width="60%" radius={4} />
          <Spacer />

          {/* Members */}
          <View className="flex-row items-center">
            <View className="flex-row">
              {[1, 2, 3].map((i) => (
                <View key={i} className="w-5 h-5 rounded-full overflow-hidden -ml-2">
                  <Skeleton colorMode="dark" height={20} width={20} radius={10} />
                </View>
              ))}
            </View>
            <View className="ml-2">
              <Skeleton colorMode="dark" height={12} width={80} radius={4} />
            </View>
          </View>
          <Spacer />

          {/* Status Badges */}
          <View className="flex-row gap-2">
            <View className="rounded-full overflow-hidden">
              <Skeleton colorMode="dark" height={24} width={80} radius={12} />
            </View>
            <View className="rounded-full overflow-hidden">
              <Skeleton colorMode="dark" height={24} width={60} radius={12} />
            </View>
          </View>
        </View>

        {/* Arrow Icon */}
        <View className="justify-center pr-4">
          <Skeleton colorMode="dark" height={24} width={24} radius={6} />
        </View>
      </Skeleton.Group>
    </View>
  );
};
