import { AppBackButton } from "@/components/app-components/back-btn";
import { Invoice01Icon, UserGroupIcon } from "@hugeicons/react-native";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AvatarGroupProps {
  images: string[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ images }) => {
  return (
    <View className="flex-row -space-x-2">
      {images.map((image, index) => (
        <View
          key={index}
          className="w-6 h-6 rounded-full border-2 border-[#040405] overflow-hidden"
        >
          <Image
            source={{ uri: image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      ))}
    </View>
  );
};

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => {
  return (
    <View className="flex-row justify-between items-center w-full">
      <Text className="text-[#9a9b9f] text-base font-semibold tracking-[-0.32px]">
        {label}
      </Text>
      {typeof value === "string" ? (
        <Text className="text-white text-base font-PlusJakartaSansMedium font-medium tracking-[-0.32px]">
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
};

const CollectibleDetail = () => {
  const navigation = useNavigation();
  const dummyAvatars = [
    "https://i.pinimg.com/736x/ee/61/70/ee617030b39b3139a690adedf58f203d.jpg",
    "https://i.pinimg.com/736x/ee/61/70/ee617030b39b3139a690adedf58f203d.jpg",
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <AppBackButton
          name="Collectible details"
          onBackPress={() => router.back()}
        />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-[#040405]">
      <ScrollView className="flex-1">
        <View className="px-6">
          <View className="w-full max-w-[382px] mx-auto">
            {/* Hero Image */}
            <View className="relative h-60 rounded-[10px] overflow-hidden mb-6">
              <Image
                source={{
                  uri: "https://i.pinimg.com/736x/ee/61/70/ee617030b39b3139a690adedf58f203d.jpg",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute top-4 left-4">
                <View className="bg-[#ff7a1b] px-3 py-2 rounded-full">
                  <Text className="text-white text-sm font-PlusJakartaSansMedium font-semibold">
                    Active
                  </Text>
                </View>
              </View>
            </View>

            {/* Title and Tribe Section */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-white text-[24px] font-PlusJakartaSansMedium font-medium mb-2">
                  Wacced out mural
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="flex-row items-center gap-2">
                    <UserGroupIcon size={18} color="#ffffff" variant="solid" />
                    <Text className="text-white text-base font-PlusJakartaSansMedium font-medium">
                      Tribe
                    </Text>
                  </View>
                  <View className="bg-[#202227] px-3 py-1 rounded-full">
                    <Text className="text-white text-sm font-PlusJakartaSansMedium">
                      Not like us
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="bg-[#ff7a1b] px-4 py-2 rounded-full">
                <Text className="text-white font-medium">Go to Tribe</Text>
              </TouchableOpacity>
            </View>

            {/* Members Section */}
            <View className="flex-row items-center gap-3 mb-4">
              <AvatarGroup images={dummyAvatars} />
              <Text className="text-white text-sm">
                and 254M others have this collectible
              </Text>
            </View>

            {/* Subscription Info */}
            <View className="flex-row items-center gap-2 mb-8">
              <Invoice01Icon size={18} color="#A187B5" variant="solid" />
              <Text className="text-white text-sm">
                Next subscription payment: 10th March, 2025
              </Text>
            </View>

            {/* Collectible Info Section */}
            <View className="mb-8 my-[64px]">
              <Text className="text-[#63656b] text-[16px] font-PlusJakartaSansBold font-bold mb-4">
                Collectible info
              </Text>
              <View className="gap-y-4">
                <View>
                  <Text className="text-[#63656b] text-[16px] font-PlusJakartaSansBold font-bold mb-2">
                    Description
                  </Text>
                  <Text className="text-white text-[16px] font-PlusJakartaSansRegular leading-relaxed">
                    Yo, welcome to Not Like Us. It's your passport to the West
                    Coast inner circle. It unlocks exclusive sessions, raw
                    conversations, and vibes straight from the streets of
                    Compton to the glow of L.A. If you ride with truth and feel
                    our struggle's rhythm, you're already family. Step in, stay
                    real, and know that when you roll with us, you're Just Like
                    Us.
                  </Text>
                </View>

                <View className="gap-y-4 mt-[48px]">
                  <Text className="text-[#63656b] text-[16px] font-PlusJakartaSansBold font-bold mb-2">
                    Details
                  </Text>
                  <DetailRow
                    label="Creator"
                    value={
                      <View className="flex-row items-center gap-2">
                        <Image
                          source={{
                            uri: "https://i.pinimg.com/736x/ee/61/70/ee617030b39b3139a690adedf58f203d.jpg",
                          }}
                          className="w-6 h-6 rounded-full"
                        />
                        <Text className="text-white">Kendrick Lamar</Text>
                      </View>
                    }
                  />
                  <DetailRow label="Collectible type" value="Tribes Pass" />
                  <DetailRow
                    label="Uniqueness"
                    value={
                      <View className="flex-row items-center gap-2">
                        <View className="w-5 h-5 bg-blue-500 rounded-full items-center justify-center">
                          <Text className="text-white text-xs">1</Text>
                        </View>
                        <Text className="text-white">Lvl 1 (Common)</Text>
                      </View>
                    }
                  />
                  <DetailRow label="Subscription" value="Yes" />
                  <DetailRow label="Price" value="$1 per month" />
                </View>
              </View>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity className="w-full h-16 bg-[#290708] mt-[80px] rounded-full items-center justify-center mb-8">
              <Text className="text-[#ff1b1b] font-medium">
                Cancel subscription
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CollectibleDetail;
