import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useNavigation } from "expo-router";
import { useQuery } from "../../../../hooks/useQuery";
import { showToast } from "@/components/ShowMessage";
import { AppButton } from "@/components/app-components/button";
import { useAppSelector } from "@/redux/hooks";
import ArtistSectionList from "@/components/settingUp/ArtistSectionList";
import { AppBackButton } from "@/components/app-components/back-btn";
import { useFollowArtist } from "@/hooks/useFollowArtist";

const Artists = () => {
  const [artistes, setArtistes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);
  const { getAllArtists } = useQuery();
  const { handleFollowArtist, followingStatus, isLoading: isFollowLoading } = useFollowArtist();
  const navigation = useNavigation()

useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <AppBackButton name="Discover artists on Looop" onBackPress={() => router.back()} />
    });
  }, [navigation]);



  const fetchArtists = async () => {
    try {
      setLoading(true);
      const artistData = await getAllArtists();
      setArtistes(
        artistData?.data?.length > 0 && Array.isArray(artistData.data)
          ? artistData.data
          : []
      );
    } catch (error) {
      console.error("Error fetching artists:", error);
      showToast("Failed to load artists. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const updateArtistsState = (artistId: string, isFollowed: boolean) => {
    setArtistes((prev) => {
      if (!prev) return prev; // Guard against undefined

      return prev.map((section) => ({
        ...section,
        artists: section.artists?.map((artist) =>
          artist.id === artistId
            ? { ...artist, isFollowed }
            : artist
        ) || [] // Guard against undefined artists array
      }));
    });
  };

  const onFollowPress = async (artistId: string) => {
    await handleFollowArtist(userdata?._id, artistId, updateArtistsState);
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>
        {loading ? "Finding artists for you..." : "Choose 3 or more artists to start exploring"}
      </Text>
    </View>

    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6D1B" />
      </View>
    ) : (
      <ArtistSectionList
        sections={artistes}
        onFollow={onFollowPress}
      />
    )}

    <AppButton.Secondary
      onPress={() => router.push("/(musicTabs)")}
      text="Finish"
      color="#FF6D1B"
      loading={loading}
      className="absolute bottom-6 left-6 right-6 z-10 py-[16px] rounded-[56px]"
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040405",
  },
  backButton: {
    padding: 24,
  },
  header: {
    padding: 24,
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    color: "#f4f4f4",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#D2D3D5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Artists;
