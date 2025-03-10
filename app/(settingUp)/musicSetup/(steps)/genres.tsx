import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { router, useNavigation } from "expo-router";
import { MotiView } from "moti";
import { useQuery } from "../../../../hooks/useQuery";
import { showToast } from "@/config/ShowMessage";
import { AppButton } from "@/components/app-components/button";
import { useAppSelector } from "@/redux/hooks";
import { AppBackButton } from "@/components/app-components/back-btn";

const SkeletonGenre = () => (
  <View style={styles.skeletonContainer}>
    <MotiView
      from={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, duration: 1000 }}
      style={styles.skeleton}
    />
  </View>
);

const Genres = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userdata } = useAppSelector((state) => state.auth);
  const { getGenres, saveUserPreference } = useQuery();
  const navigation = useNavigation()

  useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => <AppBackButton name="Discover artists on Looop" onBackPress={() => router.back()} />
      });
    }, [navigation]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getGenres();
      setGenres(data.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      showToast("Failed to load genres. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      if (userdata?._id) {
        await saveUserPreference(userdata._id, selectedInterests);
      }
      router.push("/(settingUp)/musicSetup/(steps)/artists");
    } catch (error) {
      console.error("Error saving preferences:", error);
      showToast("Failed to save preferences. Please try again.", "error");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What are your favorite genres?</Text>
        <Text style={styles.subtitle}>
          Select one or more genres to discover amazing sounds.
        </Text>
      </View>

      <FlatList
        data={loading ? Array(23).fill({}) : genres.slice(0, 23)}
        renderItem={({ item }) =>
          loading ? (
            <SkeletonGenre />
          ) : (
            <TouchableOpacity
              onPress={() =>
                setSelectedInterests((prev) =>
                  prev.includes(item._id)
                    ? prev.filter((id) => id !== item._id)
                    : [...prev, item._id]
                )
              }
              style={styles.genreItem}
            >
              <View
                style={[
                  styles.genreButton,
                  selectedInterests.includes(item._id) && styles.selectedGenre,
                ]}
              >
                <Text
                  style={[
                    styles.genreText,
                    selectedInterests.includes(item._id) && styles.selectedGenreText,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
        numColumns={3}
        keyExtractor={(item, index) => item?._id || index.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <AppButton.Secondary
        onPress={handleNext}
        text="Continue"
        color="#FF6D1B"
        loading={loading}
        disabled={selectedInterests.length === 0}
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
  },
  title: {
    fontSize: 24,
    color: "#f4f4f4",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  genreItem: {
    width: "33%",
    padding: 3,
  },
  genreButton: {
    borderWidth: 1,
    borderColor: "#A0A0A0",
    padding: 16,
    borderRadius: 56,
    alignItems: "center",
  },
  selectedGenre: {
    borderColor: "#FF6D1B",
    backgroundColor: "#FF6D1B",
  },
  genreText: {
    color: "#A0A0A0",
  },
  selectedGenreText: {
    color: "#ffffff",
  },
  skeletonContainer: {
    width: "33%",
    padding: 3,
  },
  skeleton: {
    backgroundColor: "#2e2e2e",
    height: 48,
    borderRadius: 56,
  },
});

export default Genres;
