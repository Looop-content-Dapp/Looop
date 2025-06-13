// index.js
import DailyMixesSection from "@/components/cards/DailyMix";
import NewCollectionCard from "@/components/cards/NewCollectionCard";
import RecommededMusic from "@/components/cards/RecommededMusic";
import BasedOnSubscription from "@/components/home/BasedOnSubscription";
import { useDailyMix } from "@/hooks/music/useDailyMix";
import useMusicPlayer from "@/hooks/music/useMusicPlayer";
import { useUserDashboard } from "@/hooks/user/useUserFeed";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Index = () => {
  const { currentTrack } = useMusicPlayer();
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: dailyMix, isLoading: isDailyMixesLoading } = useDailyMix();
  const { data: userFeedData, isLoading: isUserFeedLoading } =
    useUserDashboard();

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
