import {
  Platform,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  ArrowLeft02Icon,
  Wallet01Icon,
  CheckmarkBadge01Icon,
  HeadphonesIcon,
} from "@hugeicons/react-native"
import React, { useEffect, useRef, useState } from "react";
import Ellipse from "../../../components/Ellipse";
import { useRouter } from "expo-router";
import ArtistReleases from "../../../components/ArtistProfile/ArtistReleases";
import ArtistCollectible from "../../../components/ArtistProfile/ArtistCollectible";
import ArtistAbout from "../../../components/ArtistProfile/ArtistAbout";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { Artist } from "@/types/index";
import * as Animatable from 'react-native-animatable';

interface Community {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  __v: number;
}

export type SheetType = 'main' | 'linkBank' | 'transfer' | 'password';

const SkeletonLoader = () => (
  <View className="animate-pulse">
    <View className="h-[260px] bg-gray-800" />
    <View className="px-[12px] mt-[40%]">
      <View className="h-6 w-48 bg-gray-800 rounded mb-2" />
      <View className="h-4 w-32 bg-gray-800 rounded" />
    </View>
  </View>
);

const index = () => {
  const [activeTab, setActiveTab] = useState("releases");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [artistProfile, setArtistProfile] = useState<Artist>();
  const [isLoading, setIsLoading] = useState(true);
  const { artistId } = useAppSelector((state) => state.auth);
  const { navigate } = useRouter();

  const retrieveArtistInfo = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/artist/${artistId}`);
      if (!response?.data?.data) {
        throw new Error('Invalid artist data received');
      }
      setArtistProfile(response.data.data.artist);
    } catch (error) {
      console.error('Failed to fetch artist info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(artistId){
      retrieveArtistInfo();
    }
  }, [artistId]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [Platform.OS === "ios" ? 260 : 260, 60],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [100, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "releases":
        return <ArtistReleases artistId="" />;
      case "collectible":
        return <ArtistCollectible />;
      case "about":
        return <ArtistAbout />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 min-h-screen">
      <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
        {isLoading ? (
          <Animatable.View 
            animation="pulse" 
            easing="ease-out" 
            iterationCount="infinite"
            className="h-full w-full bg-[#1a1a1a]"
          >
            <SkeletonLoader />
          </Animatable.View>
        ) : (
          <ImageBackground
            source={{
              uri: artistProfile?.profileImage,
            }}
            style={{
              height: hp("27.9%"),
              width: wp("100%"),
            }}
          >
            <View className="flex-row items-center justify-between w-full mt-[40%] px-[12px]">
              <View>
                <View className="flex-row gap-x-[8px] items-center">
                  <Text className="text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]">
                    {artistProfile?.name}
                  </Text>
                  {artistProfile?.verified === true && (
                    <CheckmarkBadge01Icon
                      size={20}
                      variant="solid"
                      color="#2DD881"
                    />
                  )}
                </View>
                <View className="flex-row items-center gap-x-[4px]">
                  <Text className="text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]">
                    {artistProfile?.followers?.toLocaleString()} Followers
                  </Text>
                  <Ellipse />
                  <Text className="text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]">
                    {artistProfile?.monthlyListeners.toLocaleString()} Monthly Listeners
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity className="border border-[#D2D3D5] py-[16px] px-[12px] rounded-[24px]">
                  <Text className="text-[14px] font-PlusJakartaSansMedium text-[#D2D3D5]">
                    Change Cover
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
      </Animated.View>

      {/* Rest of the component remains the same */}
      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event) => {
              const offsetY = event?.nativeEvent?.contentOffset.y;
              setShowStickyTabs(offsetY > 200);
            },
          }
        )}
        scrollEventThrottle={16}
      >
        <View className="px-[2px] mt-[10px] gap-y-[24px]">
          <View className="flex-row items-center gap-x-[10px] mx-auto w-full">
            <TouchableOpacity
              onPress={() => navigate("/(musicTabs)")}
              className="items-center justify-center rounded-lg overflow-hidden h-[89px] w-[50%] border-2 bg-[#12141B]"
            >
              <View className="gap-2">
                <HeadphonesIcon size={24} color="#FF8A49" variant="solid" />
                <Text className="text-[#f4f4f4] text-[14px] font-PlusJakartaSansMedium">
                  Back to Listen Mode
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>  navigate("/wallet")}
              className="items-center justify-center rounded-lg overflow-hidden w-[50%] h-[89px] bg-[#12141B]"
            >
              <View className="gap-2">
                <Wallet01Icon size={20} color="#A187B5" variant="stroke" />
                <Text className="text-[#f4f4f4] text-[14px] font-PlusJakartaSansMedium">
                  Wallet & Earnings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-start px-[4px] py-[2px] mt-4">
          <TouchableOpacity
            onPress={() => setActiveTab("releases")}
            className={`py-[24px] px-[24px] ${
              activeTab === "releases" ? "border-b-[#FF8A49] border" : ""
            }`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === "releases" ? "text-white" : "text-gray-400"
              }`}
            >
              Releases
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("collectible")}
            className={`py-[24px] px-[24px] ${
              activeTab === "collectible" ? "border-b-[#FF8A49] border" : ""
            }`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === "collectible" ? "text-white" : "text-gray-400"
              }`}
            >
              Collectible
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("about")}
            className={`py-[24px] px-[24px] ${
              activeTab === "about" ? "border-b-[#FF8A49] border" : ""
            }`}
          >
            <Text
              className={`text-[16px] font-PlusJakartaSansMedium ${
                activeTab === "about" ? "text-white" : "text-gray-400"
              }`}
            >
              About
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 py-2">{renderTabContent()}</View>
      </Animated.ScrollView>
    </View>
  );
};

export default index;
