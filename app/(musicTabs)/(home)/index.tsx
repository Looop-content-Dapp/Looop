// index.js
import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import NewlyReleased from "../../../components/home/newlyRelease";
import BasedOnSubscription from "../../../components/home/BasedOnSubscription";
import { useQuery } from "../../../hooks/useQuery";
import useMusicPlayer from "../../../hooks/useMusicPlayer";
import DailyMixesSection from "../../../components/cards/DailyMix";
import RecommededMusic from "../../../components/cards/RecommededMusic";

const Index = () => {
    const { currentTrack } = useMusicPlayer();
    const { getAllReleases, getAllArtists,  getDashboardRecommendations, retrieveUserId, getFollowedArtistsReleases, getDailyMixes } =
        useQuery();

        const [newReleases, setNewReleases] = useState([]);
        const [recommendedMusic, setRecommendedMusic] = useState([]);
        const [followedArtistReleases, setFollowedArtistReleases] = useState([]);
        const [dailyMixes, setDailyMixes] = useState([]);
        const [allArtists, setAllArtists] = useState([]);
        const [loading, setLoading] = useState(true);


    // Function to sort albums by date
    const sortAlbumsByDate = (albums) => {
        return albums.sort((a, b) => {
            const dateA = new Date(a.release_date);
            const dateB = new Date(b.release_date);
            return dateB - dateA; // Sort in descending order
        });
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Get user ID
                const userId = await retrieveUserId();
                if (!userId) {
                    console.error('No user ID found');
                    return;
                }

                // Fetch all data in parallel
                const [
                    releasesResponse,
                    artistsResponse,
                    recommendationsResponse,
                    followedReleasesResponse,
                    dailyMixesResponse
                ] = await Promise.all([
                    getAllReleases(),
                    getAllArtists(),
                    getDashboardRecommendations(userId),
                    getFollowedArtistsReleases(userId),
                    getDailyMixes(userId)
                ]);
                console.log("recommed", dailyMixesResponse.data)
                setNewReleases(releasesResponse.data);
                setAllArtists(artistsResponse.data);
                setRecommendedMusic(recommendationsResponse.data);
                setFollowedArtistReleases(followedReleasesResponse.data);
                setDailyMixes(dailyMixesResponse.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <View style={{ flex: 1, minHeight: "100%" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pl-[12px] space-y-[4px]"
                contentContainerStyle={{
                    paddingBottom: currentTrack ? 90 : 30,
                    paddingTop: 32,
                }}
            >

                     {/* Daily Mixes */}
                     <DailyMixesSection
                        mixes={dailyMixes?.mixes}
                        isLoading={loading}
                        title="Your Daily Mixes"
                    />

                     {/* New Releases Section */}
                 <NewlyReleased
                    musicData={newReleases}
                    isLoading={loading}
                    title="New Releases"
                />



                {/* Followed Artists' New Releases */}
                {followedArtistReleases.length > 0 && (
                    <NewlyReleased
                        musicData={followedArtistReleases}
                        isLoading={loading}
                        title="New From Artists You Follow"
                    />
                )}

                {/* Personalized Recommendations */}
                <RecommededMusic
                  data={recommendedMusic}
                  isLoading={loading}
                  title="Recommended For You"
                   />

                {/* Artists to Explore */}
                <BasedOnSubscription
                    data={allArtists}
                    isLoading={loading}
                    title="New Discographies to Explore"
                />
            </ScrollView>
        </View>
    );
};

export default Index;
