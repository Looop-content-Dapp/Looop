// index.js
import DailyMixesSection from "@/components/cards/DailyMix";
import NewCollectionCard from "@/components/cards/NewCollectionCard";
import RecommededMusic from "@/components/cards/RecommededMusic";
import BasedOnSubscription from "@/components/home/BasedOnSubscription";
import { useDailyMix } from "@/hooks/music/useDailyMix";
import useMusicPlayer from "@/hooks/music/useMusicPlayer";
import { useUserDashboard } from "@/hooks/user/useUserFeed";
import { useAppSelector } from "@/redux/hooks";
import { Notification02Icon } from "@hugeicons/react-native";
import { router, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "moti";
import React, { useLayoutEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";

const Index = () => {
  const { currentTrack } = useMusicPlayer();
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: dailyMix, isLoading: isDailyMixesLoading } = useDailyMix();
  const { data: userFeedData, isLoading: isUserFeedLoading } =
    useUserDashboard();
    const navigation = useNavigation()
    const { userdata } = useAppSelector((state) => state.auth)

    const getGreeting = () => {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
          return "Start your morning with music";
        } else if (currentHour >= 12 && currentHour < 18) {
          return "Great afternoon for music";
        } else {
          return "Evening vibes huh?";
        }
      };

  useLayoutEffect(() => {
    navigation.setOptions({
        // headerLeft: () =>  <Text className="text-[16px] text-[#fff]">{getGreeting()}</Text>,
        // headerRight: () => (

        //   ),
        header: () =>  (
            <SafeAreaView style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 6,
            }}>
                <Text className="text-[18px] text-[#f4f4f4] font-PlusJakartaSansExtraBold">{getGreeting()}</Text>
                <View className="flex-row items-center gap-x-[16px] px-4">
              <Notification02Icon
                size={24}
                color="#787A80"
                variant="stroke"
                onPress={() => router.navigate("/notification") }
              />
              <Avatar
                source={{
                  uri:
                    userdata?.profileImage
                      ? userdata?.profileImage
                      : "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
                }}
                size={35}
                rounded
                onPress={() => router.push("/(profile)") }
                avatarStyle={{
                  borderWidth: 2,
                  borderColor: "#f4f4f4",
                }}
              />
            </View>
            </SafeAreaView>
        ),
          title: ""
    })
  })

  const categories = [
    "All",
    "Party",
    "Blues",
    "Workout",
    "Sleep",
    "Hip Hop",
    "Rap",
    "Country",
    "Pop",
    "Jazz",
    "R&B",
    "Rock",
  ];

  // Extract data from userFeed
  const dailyMixes = dailyMix?.data?.mixes ?? [];
  const followedArtists = userFeedData?.data?.followedArtists || [];
  const recommendedArtists = userFeedData?.data?.recommendedArtists || [];
  const suggestedTracks = userFeedData?.data?.suggestedTracks || [];
  return (
    <>
      <StatusBar translucent={true} backgroundColor="#040405" style="light" />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="space-y-[4px]"
          contentContainerStyle={{
            paddingBottom: currentTrack ? 90 : 30,
            paddingTop: 12,
          }}
        >
          <View className="gap-y-[12px]">
            <Text className="text-[#D2D3D5] text-[24px] font-TankerRegular">
              Select Categories
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-x-[12px] mb-[24px]"
            >
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveCategory(category)}
                  className={`bg-[#12141B] border border-[#2A2B32] rounded-[56px] py-[12px] px-[24px] ${
                    activeCategory === category ? "border-[#FF6D1B]" : ""
                  }`}
                >
                  <Text
                    className={`text-[14px] font-TankerRegular ${
                      activeCategory === category
                        ? "text-[#FF6D1B]"
                        : "text-[#9A9B9F]"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="gap-y-[12px]">
            <Text className="text-[#D2D3D5] text-[24px] font-TankerRegular font-bold">
              New Collection
            </Text>
            <NewCollectionCard
              title="HOTTEST ON THE BLOCK"
              subtitle="The hottest new music from Looop superstar creators."
              backgroundImage={require("../../../assets/images/hottestBG.png")}
              foregroundImage={require("../../../assets/images/HottestTeen.png")}
            />

          </View>

          {/* Daily Mixes */}
          <DailyMixesSection
            mixes={dailyMixes}
            isLoading={isDailyMixesLoading}
            title="Daily Mixes"
          />

          {/* Followed Artists Section - only show if there's data */}
          {followedArtists.length > 0 && (
            <BasedOnSubscription
              data={followedArtists}
              isLoading={isUserFeedLoading}
              title="Artists You Follow"
            />
          )}

          {/* Recommended Artists Section - only show if there's data */}
          {recommendedArtists.length > 0 && (
            <BasedOnSubscription
              data={recommendedArtists}
              isLoading={isUserFeedLoading}
              title="Some artist for you to explore..."
            />
          )}

          {/* Suggested Tracks Section - only show if there's data */}
          {suggestedTracks.length > 0 && (
            <RecommededMusic
              data={suggestedTracks}
              isLoading={isUserFeedLoading}
              title="Rythms you'll love..."
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
