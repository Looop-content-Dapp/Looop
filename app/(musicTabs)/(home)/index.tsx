// index.js
import { View, ScrollView, Text, ImageBackground, Image } from "react-native";
import React, { useState, useEffect } from "react";
import BasedOnSubscription from "../../../components/home/BasedOnSubscription";
import useMusicPlayer from "../../../hooks/useMusicPlayer";
import DailyMixesSection from "../../../components/cards/DailyMix";
import RecommededMusic from "../../../components/cards/RecommededMusic";

import { useQuery } from "../../../hooks/useQuery";
import { useAppSelector } from "@/redux/hooks";
import { StatusBar } from "expo-status-bar";
import { useUserDashboard } from "../../../hooks/useUserFeed";

const Index = () => {
  const { currentTrack } = useMusicPlayer();
  const { userdata } = useAppSelector((state) => state.auth);
  const {
    getDailyMixes,
  } = useQuery();

  const { data: userFeedData, isLoading: userFeedLoading } = useUserDashboard();

  const [dailyMixes, setDailyMixes] = useState<DailyMixesMix[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDailyMixes = async () => {
    try {
      setLoading(true);
      const dailyMixesResponse = await getDailyMixes(userdata?._id as string);
      setDailyMixes(dailyMixesResponse?.data.mixes ?? []);
    } catch (error) {
      console.log("Error fetching daily mixes:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDailyMixes();
}, []);

  // Extract data from userFeed
  const followedArtists = userFeedData?.data?.followedArtists || [];
  const recommendedArtists = userFeedData?.data?.recommendedArtists || [];
  const suggestedTracks = userFeedData?.data?.suggestedTracks || [];
  const recentReleases = userFeedData?.data?.recentReleases || [];


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
          className="bg-[#2DD881] w-[95%] mx-auto h-[157px] overflow-hidden flex-row items-center mb-[32px] justify-between relative rounded-[10px]"
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
              className="h-full w-[60%] absolute right-5"
              resizeMode="cover"
            />
        </ImageBackground>

          {/* Daily Mixes */}
          <DailyMixesSection
            mixes={dailyMixes}
            isLoading={loading}
            title="Your Daily Mixes"
          />


          {/* Followed Artists Section - only show if there's data */}
          {followedArtists.length > 0 && (
          <BasedOnSubscription
          data={followedArtists}
          isLoading={userFeedLoading}
          title="Artists You Follow"
        />
          )}

          {/* Recommended Artists Section - only show if there's data */}
          {recommendedArtists.length > 0 && (
            <BasedOnSubscription
              data={recommendedArtists}
              isLoading={userFeedLoading}
              title="Some artist for you to explore..."
            />
          )}

          {/* Suggested Tracks Section - only show if there's data */}
          {suggestedTracks.length > 0 && (
            <RecommededMusic
              data={suggestedTracks}
              isLoading={userFeedLoading}
              title="Rythms you'll love..."
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
