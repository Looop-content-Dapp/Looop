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

const Index = () => {
  const { currentTrack } = useMusicPlayer();
  const { userdata } = useAppSelector((state) => state.auth);
  const {
    getAllReleases,
    getAllArtists,
    getDashboardRecommendations,
    getFollowedArtistsReleases,
    getDailyMixes,
  } = useQuery();

  const [newReleases, setNewReleases] = useState([]);
  const [recommendedMusic, setRecommendedMusic] = useState([]);
  const [followedArtistReleases, setFollowedArtistReleases] = useState<
    ArtistsYouFollowThisMonth[]
  >([]);
  const [dailyMixes, setDailyMixes] = useState<DailyMixesMix[]>([]);
  const [allArtists, setAllArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          releasesResponse,
          artistsResponse,
          recommendationsResponse,
          followedReleasesResponse,
          dailyMixesResponse,
        ] = await Promise.all([
          getAllReleases(),
          getAllArtists(),
          getDashboardRecommendations(userdata?._id as string),
          getFollowedArtistsReleases(userdata?._id as string),
          getDailyMixes(userdata?._id as string),
        ]);

        setNewReleases(releasesResponse.data);
        setDailyMixes(dailyMixesResponse?.data.mixes ?? []);
        setAllArtists(artistsResponse.data);
        setRecommendedMusic(recommendationsResponse.data);
        setFollowedArtistReleases(
          followedReleasesResponse?.data.releases.thisMonth ?? []
        );
        console.log(JSON.stringify(artistsResponse), "artist response");
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <StatusBar translucent={true} backgroundColor="#040405" style="light" />
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="space-y-[4px]"
          contentContainerStyle={{
            paddingBottom: currentTrack ? 90 : 30,
            paddingTop: 32,
            paddingLeft: 16,
          }}
        >
          {/* Daily Mixes */}
          <DailyMixesSection
            mixes={dailyMixes}
            isLoading={loading}
            title="Your Daily Mixes"
          />

          {/* <Text className="text-[#ffffff] text-[14px] font-PlusJakartaSansBold">Amazing sounds Coming Soon</Text> */}

          {/* New Releases Section */}
          {/* <NewlyReleased
            musicData={newReleases}
            isLoading={loading}
            title="New Releases"
          /> */}

          {/* Followed Artists' New Releases */}
          {/* {followedArtistReleases.length !== 0 && (
            <NewlyReleased
              musicData={followedArtistReleases}
              isLoading={loading}
              title="New From Artists You Follow"
            />
          )} */}

          {/* Personalized Recommendations */}
          {/* <RecommededMusic
            data={recommendedMusic}
            isLoading={loading}
            title="Recommended For You"
          /> */}

          {/* Artists to Explore */}
          <BasedOnSubscription
            data={allArtists}
            isLoading={loading}
            title="New Discographies to Explore"
          />
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
