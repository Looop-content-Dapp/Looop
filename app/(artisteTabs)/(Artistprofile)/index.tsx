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
import React, { useEffect, useRef, useState, useMemo } from "react";
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

// Remove unused interfaces
export type SheetType = 'main' | 'linkBank' | 'transfer' | 'password';

// Simple placeholder component instead of animated skeleton
const ProfilePlaceholder = () => (
  <View className="h-full w-full bg-[#1a1a1a]">
    <View className="h-[260px]" />
    <View className="px-[12px] mt-[40%]">
      <View className="h-6 w-48 bg-gray-700 rounded mb-2" />
      <View className="h-4 w-32 bg-gray-700 rounded" />
    </View>
  </View>
);

const index = () => {
  const [activeTab, setActiveTab] = useState("releases");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [artistProfile, setArtistProfile] = useState<Artist>();
  const [isLoading, setIsLoading] = useState(true);
  const { userdata } = useAppSelector((state) => state.auth);
  const { navigate } = useRouter();

  // Optimized API call
  const retrieveArtistInfo = async () => {
    if (!userdata?.artist) return;

    try {
      const response = await api.get(`/api/artist/${userdata.artist}`);
      if (response?.data?.data) {
        setArtistProfile(response.data.data.artist);
      }
    } catch (error) {
      console.error('Failed to fetch artist info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(userdata?.artist){
      retrieveArtistInfo();
    }
  }, [userdata?.artist]);

  // Memoize animations for better performance
  const animations = useMemo(() => ({
    headerHeight: scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [260, 60],
      extrapolate: "clamp",
    }),
    headerOpacity: scrollY.interpolate({
      inputRange: [100, 200],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    imageOpacity: scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: "clamp",
    })
  }), [scrollY]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "releases":
        return <ArtistReleases artistId={userdata?.artist} />;
      case "collectible":
        return <ArtistCollectible />;
      case "about":
        return <ArtistAbout />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-[#0A0A0A]">
      <Animated.View style={{ height: animations.headerHeight, opacity: animations.imageOpacity }}>
        {isLoading ? (
          <ProfilePlaceholder />
        ) : (
          <ImageBackground
            source={{
              uri: artistProfile?.profileImage,
            }}
            style={{
              height: hp("40.9%"),
              width: wp("100%"),
            }}
            resizeMode="cover"
          >
            <View className="flex-row items-center justify-between w-full mt-[45%] px-[20px]">
              <View className="flex-1 mr-4">
                <View className="flex-row gap-x-[8px] items-center">
                  <Text className="text-[24px] font-PlusJakartaSansBold text-white" numberOfLines={1} ellipsizeMode="tail">
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
                <View className="flex-row items-center gap-x-[6px] mt-1">
                  <Text className="text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]">
                    {artistProfile?.followers?.toLocaleString() || 0} Followers
                  </Text>
                  <Ellipse />
                  <Text className="text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]" numberOfLines={1} ellipsizeMode="tail">
                    {artistProfile?.monthlyListeners?.toLocaleString() || 0} Monthly Listeners
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="border border-[#D2D3D5] py-[10px] px-[14px] rounded-[24px] bg-black/40">
                <Text className="text-[14px] font-PlusJakartaSansMedium text-white">
                  Change Cover
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      </Animated.View>

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="px-[16px] mx-auto mt-[16px] gap-y-[14px]">
          <View className="flex-row justify-center items-center gap-x-[16px] w-full">
            <TouchableOpacity
              onPress={() => navigate("/(musicTabs)")}
              className="items-center justify-center rounded-[16px] overflow-hidden h-[89px] flex-1 bg-[#12141B] shadow-md"
            >
              <View className="gap-2 items-center">
                <HeadphonesIcon size={24} color="#FF8A49" variant="solid" />
                <Text className="text-[#f4f4f4] text-[14px] font-PlusJakartaSansMedium text-center px-2">
                  Back to Listen Mode
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("/wallet")}
              className="items-center justify-center rounded-[16px] overflow-hidden flex-1 h-[89px] bg-[#12141B] shadow-md"
            >
              <View className="gap-2 items-center">
                <Wallet01Icon size={20} color="#A187B5" variant="stroke" />
                <Text className="text-[#f4f4f4] text-[14px] font-PlusJakartaSansMedium text-center px-2">
                  Wallet & Earnings
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-start px-[4px] py-[2px] mt-4 border-b border-gray-800">
          {["releases", "collectible", "about"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`py-[20px] px-[24px] ${
                activeTab === tab ? "border-b-2 border-[#FF8A49]" : ""
              }`}
            >
              <Text
                className={`text-[16px] font-PlusJakartaSansMedium ${
                  activeTab === tab ? "text-white" : "text-gray-400"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="py-4 pb-20">{renderTabContent()}</View>
      </Animated.ScrollView>
    </View>
  );
};

export default index;
