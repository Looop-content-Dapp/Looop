import {
  Platform,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  ArrowLeft02Icon,
  Wallet01Icon,
  CheckmarkBadge01Icon,
  HeadphonesIcon,
} from "@hugeicons/react-native";
import React, { useRef, useState } from "react";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import Ellipse from "../../../components/Ellipse";
import { useRouter } from "expo-router";
import ArtistReleases from "../../../components/ArtistProfile/ArtistReleases";
import ArtistCollectible from "../../../components/ArtistProfile/ArtistCollectible";
import ArtistAbout from "../../../components/ArtistProfile/ArtistAbout";
import WalletEarningSheet from "../../../components/bottomSheet/WalletEarningSheet";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

interface Community {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  __v: number;
}

interface ArtistCommunityDetailProps {
  community: Community;
}

const index = ({ community }: ArtistCommunityDetailProps) => {
  const [activeTab, setActiveTab] = useState("releases");
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const { navigate } = useRouter();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isWalletSheetVisible, setIsWalletSheetVisible] = useState(false);

  // Add this to your component
  const handleOpenWalletSheet = () => {
    setIsWalletSheetVisible(true);
  };

  const handleCloseWalletSheet = () => {
    setIsWalletSheetVisible(false);
  };

  // Interpolate values for animations with minimal platform adjustments
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
      {/* Animated header with back button */}
      <Animated.View style={{ height: headerHeight, opacity: imageOpacity }}>
        <ImageBackground
          source={{
            uri: "https://i.pinimg.com/564x/64/19/30/641930ec1d900889da248ebe6ad7144d.jpg",
          }}
          style={{
            height: hp("27.9%"),
            width: wp("100%"),
          }}
        >
          <View className="flex-row items-center justify-between w-full mt-[40%] px-[12px]">
            <View>
              <View className="flex-row items-center">
                <Text className="text-[24px] font-PlusJakartaSansBold text-[#f4f4f4]">
                  Rema
                </Text>
                <CheckmarkBadge01Icon
                  size={20}
                  variant="solid"
                  color="#2DD881"
                />
              </View>
              <View className="flex-row items-center gap-x-[4px]">
                <Text className="text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]">
                  500M Followers
                </Text>
                <Ellipse />
                <Text className="text-[14px] font-PlusJakartaSansMedium text-[#A5A6AA]">
                  180 Subscribers
                </Text>
              </View>
            </View>
            <View className="">
              <TouchableOpacity className="border border-[#D2D3D5] py-[16px] px-[12px] rounded-[24px]">
                <Text className="text-[14px] font-PlusJakartaSansMedium text-[#D2D3D5]">
                  Change Cover
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: (event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              if (offsetY > 200) {
                setShowStickyTabs(true);
              } else {
                setShowStickyTabs(false);
              }
            },
          }
        )}
        scrollEventThrottle={16}
      >
        <View className="px-[24px] mt-[24px] gap-y-[24px]">
          <View className="flex-row items-center gap-x-[16px] w-full">
            <TouchableOpacity
              onPress={() => navigate("/(musicTabs)")}
              className="rounded-lg overflow-hidden h-[89px] w-[50%] border-2 border-[#FF8A49]"
            >
              <ImageBackground
                source={require("../../../assets/images/listenMode.png")}
                className="w-full px-4 py-3 h-full"
              >
                <View className=" gap-2">
                  <HeadphonesIcon size={24} color="#FF8A49" variant="solid" />
                  <Text className="text-[#f4f4f4] text-[14px] font-PlusJakartaSansMedium">
                    Back to Listen Mode
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenWalletSheet}
              className="rounded-lg overflow-hidden w-[50%] h-[89px] border-2 border-[#A187B5]"
            >
              <ImageBackground
                source={require("../../../assets/images/listenMode.png")}
                className="w-full px-4 py-3 h-full"
              >
                <View className="gap-2">
                  <Wallet01Icon size={20} color="#A187B5" variant="stroke" />
                  <Text className="text-[#f4f4f4] text-[14px] font-PlusJakartaSansMedium">
                    Wallet & Earnings
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>

        {/* Original Tab Navigation */}
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
                activeTab === "collectible" ? "text-white" : "text-gray-400"
              }`}
            >
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View className="px-4 py-2">{renderTabContent()}</View>
      </Animated.ScrollView>

      <WalletEarningSheet
        isVisible={isWalletSheetVisible}
        closeSheet={handleCloseWalletSheet}
      />
    </View>
  );
};

export default index;
