import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useQuery } from "../../hooks/useQuery";
import { MotiView } from "moti";

// Type for a genre, which is simply a string
type Genre = string;

const PickArtistes = () => {
  const [artistes, setArtistes] = useState<App.Artist[]>([]);
  const [followingArtists, setFollowingArtists] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [] = useState();
  const {
    getArtistBasedOnGenre,
    followArtist,
    isFollowingArtist,
    retrieveUserId,
    fetchFollowingArtists,
    userID,
  } = useQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await retrieveUserId();
        console.log("Retrieved userID:", userId);

        if (userId) {
          const artistData = await getArtistBasedOnGenre(userId);
          console.log("Fetched artistes:", artistData);
          setArtistes(artistData.data);

          // Fetch the artists that the user is already following
          const followedArtistsResponse = await fetchFollowingArtists(userID);
          setFollowingArtists(followedArtistsResponse?.data?.artists || []);
        }
      } catch (error) {
        console.error("Error fetching artists or followed artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle following an artist
  // Function to handle following an artist
  const handleFollowArtist = async (artistId: string) => {
    try {
      if (!userID) {
        console.error("User ID is not available.");
        return;
      }
      await followArtist(userID, artistId);
      console.log(`Successfully followed artist with ID: ${artistId}`);
      setFollowingArtists((prev) => [...prev, artistId]);
    } catch (error) {
      console.error(`Error following artist with ID ${artistId}:`, error);
    }
  };

  // Determine if an artist is being followed by the user
  const isArtistFollowed = (artistId: string) => {
    return followingArtists.includes(artistId);
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <View style={{ width: "50%", padding: 10 }}>
      <MotiView
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: 24,
          padding: 16,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        from={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 1000,
        }}
      >
        {/* Skeleton Image */}
        <MotiView
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#2e2e2e",
          }}
        />

        {/* Skeleton Name */}
        <MotiView
          style={{
            height: 20,
            width: "60%",
            backgroundColor: "#2e2e2e",
            borderRadius: 4,
            marginTop: 8,
          }}
        />

        {/* Skeleton Genre */}
        <MotiView
          style={{
            height: 14,
            width: "40%",
            backgroundColor: "#2e2e2e",
            borderRadius: 4,
            marginTop: 8,
          }}
        />

        {/* Skeleton Button */}
        <MotiView
          style={{
            backgroundColor: "#2e2e2e",
            height: 32,
            width: "80%",
            borderRadius: 16,
            marginTop: 16,
          }}
        />
      </MotiView>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 16 }}>
        <ArrowLeft02Icon size={32} color="#fff" />
      </TouchableOpacity>

      <View
        style={{
          alignItems: "flex-start",
          marginVertical: 12,
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#f4f4f4" }}>
          Based on your selections
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: "#aaa",
            marginTop: 4,
          }}
        >
          Alright! Let’s follow some artistes to start exploring their
          discographies
        </Text>
      </View>

      {/* Conditional rendering based on loading state */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => item.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}
        />
      ) : (
        <FlatList
          data={artistes}
          renderItem={({ item }) => {
            const followed = isArtistFollowed(item._id);
            return (
              <View style={{ width: "50%", padding: 10 }}>
                <View
                  style={{
                    backgroundColor: "#1E1E1E",
                    borderRadius: 24,
                    padding: 16,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Artist Image */}
                  <Image
                    source={{ uri: item.profileImage }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                  />

                  {/* Artist Name */}
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      fontWeight: "500",
                      color: "#fff",
                      marginTop: 8,
                    }}
                  >
                    {item.name}
                  </Text>

                  {/* Genre */}
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#aaa",
                      marginTop: 4,
                    }}
                  >
                    {item.genre}
                  </Text>

                  {/* Follow/Following Button */}
                  <TouchableOpacity
                    onPress={() => handleFollowArtist(item._id)}
                    style={{
                      backgroundColor: followed ? "#555" : "#8e44ad",
                      paddingVertical: 8,
                      paddingHorizontal: 20,
                      borderRadius: 20,
                      marginTop: 16,
                    }}
                    disabled={followed}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16,
                      }}
                    >
                      {followed ? "Following" : "Follow"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 20,
          }}
        />
      )}

      {/* Continue button */}
      <TouchableOpacity
        onPress={() => router.navigate("/loadingScreen")}
        style={{
          backgroundColor: "#EC6519",
          alignItems: "center",
          paddingVertical: 16,
          borderRadius: 56,
          marginHorizontal: 16,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "500", fontSize: 16 }}>
          Continue
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PickArtistes;
