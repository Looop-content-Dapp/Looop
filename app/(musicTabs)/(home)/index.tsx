// index.js
import { View, ScrollView, Text } from "react-native";
import React, { useState, useEffect } from "react";

import NewlyReleased from "../../../components/home/newlyRelease";
import BasedOnSubscription from "../../../components/home/BasedOnSubscription";
import useMusicPlayer from "../../../hooks/useMusicPlayer";
import DailyMixesSection from "../../../components/cards/DailyMix";
import RecommededMusic from "../../../components/cards/RecommededMusic";

import { useQuery } from "../../../hooks/useQuery";
import { useAppSelector } from "@/redux/hooks";
import { StatusBar } from "expo-status-bar";
import { useUserFeed } from "../../../hooks/useUserFeed";

const Index = () => {
  const { currentTrack } = useMusicPlayer();
  const { userdata } = useAppSelector((state) => state.auth);
  const {
    getDailyMixes,
  } = useQuery();

  // Use the new useUserFeed hook
  const { data: userFeedData, isLoading: userFeedLoading } = useUserFeed(userdata?._id as string);
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

          {/* Recent Releases Section - only show if there's data */}
          {recentReleases.length > 0 && (
            <NewlyReleased
              musicData={recentReleases}
              isLoading={userFeedLoading}
              title="Recent Releases"
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
