// index.js
import { View, ScrollView, Text, ImageBackground, Image } from "react-native";
import React from "react";
import BasedOnSubscription from "../../../components/home/BasedOnSubscription";
import useMusicPlayer from "../../../hooks/useMusicPlayer";
import DailyMixesSection from "../../../components/cards/DailyMix";
import RecommededMusic from "../../../components/cards/RecommededMusic";
import { StatusBar } from "expo-status-bar";
import { useUserDashboard } from "../../../hooks/useUserFeed";
import { useDailyMix } from "@/hooks/useDailyMix";
import MoodSection from "../../../components/home/MoodSection";

const Index = () => {
  const { currentTrack } = useMusicPlayer();
  const { data: dailyMix, isLoading: isDailyMixesLoading } = useDailyMix();
  const { data: userFeedData, isLoading: isUserFeedLoading } = useUserDashboard();

  // Extract data from userFeed
  const dailyMixes = dailyMix?.data?.mixes ?? []
  const followedArtists = userFeedData?.data?.followedArtists || [];
  const recommendedArtists = userFeedData?.data?.recommendedArtists || [];
  const suggestedTracks = userFeedData?.data?.suggestedTracks || [];
  const recentReleases = userFeedData?.data?.recentReleases || [];

  const dataLoading = isDailyMixesLoading || isUserFeedLoading;
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
            paddingLeft: 6,
          }}
        >

        {/* Hottest On The Block */}
      <ImageBackground
          source={require("../../../assets/images/hottestBG.png")}
          className="bg-[#2DD881] w-[100%] mx-auto h-[157px] overflow-hidden flex-row items-center mb-[32px] justify-between relative rounded-[10px]"
          resizeMode="cover"
        >
          <View className="h-full px-4 justify-center z-10">
            <View className="w-[90%]">
              <Text className="text-[28px] w-[50%] text-[#111318] font-TankerRegular font-extrabold leading-tight">HOTTEST ON THE BLOCK</Text>
              <Text className="text-[14px] w-[60%] text-[#111318] font-PlusJakartaSansMedium mt-1">
                The hottest new music from Looop superstar creators.
              </Text>
            </View>
          </View>
          <Image
              source={require("../../../assets/images/HottestTeen.png")}
              className="h-full w-[65%] absolute right-5"
              resizeMode="cover"
            />
        </ImageBackground>

        <MoodSection />

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
