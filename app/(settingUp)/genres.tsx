import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft02Icon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useQuery } from "../../hooks/useQuery";

// Define the Genre type based on your API response
interface Genre {
  _id: string;
  name: string;
  // Include other properties if needed
}

const Genres = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getGenres, saveUserPreference, userID, retrieveUserId } = useQuery();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        await retrieveUserId();
        const data = await getGenres();
        setGenres(data.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchGenres();
  }, []);

  // Function to toggle a genre's selection using its ID
  const toggleGenreSelection = (genreId: string) => {
    setSelectedGenres((prevSelectedGenres) => {
      let updatedSelectedGenres;
      if (prevSelectedGenres.includes(genreId)) {
        // Remove the genre ID from selected genres
        updatedSelectedGenres = prevSelectedGenres.filter(
          (id) => id !== genreId
        );
      } else {
        // Add the genre ID to selected genres
        updatedSelectedGenres = [...prevSelectedGenres, genreId];
      }
      return updatedSelectedGenres;
    });
  };

  // Function to check if a genre is selected
  const isSelected = (genreId: string) => selectedGenres.includes(genreId);

  // Placeholder data for skeleton loading
  const placeholderData = Array.from({ length: 22 }, (_, index) => ({
    _id: index.toString(),
  }));

  return (
    <SafeAreaView style={{ flex: 1, minHeight: "100%" }}>
      <TouchableOpacity
        style={{ paddingLeft: 24 }}
        onPress={() => router.back()}
      >
        <ArrowLeft02Icon size={32} color="#fff" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>What are your favorite genres?</Text>
        <Text style={styles.subtitle}>
          Select one or more genres and we’ll help you discover amazing sounds
        </Text>
      </View>

      {/* FlatList to handle the scrolling */}
      <View style={styles.listContainer}>
        <Text style={styles.popularText}>Popular among other users</Text>
        <FlatList
          data={loading ? placeholderData : genres}
          renderItem={({ item }) => {
            if (loading) {
              // Render skeleton item
              return (
                <View style={styles.itemWrapper}>
                  <Skeleton
                    // width={'100%'}
                    // height={50}
                    // borderRadius={56}
                    colorMode="dark"
                    show
                    // backgroundColor="#2e2e2e"
                    // highlightColor="#3e3e3e"
                  >
                    <View
                      style={[styles.genreItem, { borderColor: "#2e2e2e" }]}
                    />
                  </Skeleton>
                </View>
              );
            } else {
              const selected = isSelected(item._id);
              return (
                <TouchableOpacity
                  style={styles.itemWrapper}
                  onPress={() => toggleGenreSelection(item._id)}
                >
                  <View
                    style={[
                      styles.genreItem,
                      selected && styles.genreItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genreText,
                        selected && styles.genreTextSelected,
                      ]}
                    >
                      {item?.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          }}
          keyExtractor={(item) => item._id}
          numColumns={3}
          contentContainerStyle={{ paddingVertical: 20 }}
        />
      </View>

      {/* Continue button */}
      <TouchableOpacity
        onPress={async () => {
          if (selectedGenres.length > 0) {
            try {
              console.log("Selected genres:", selectedGenres);
              if (userID) {
                await saveUserPreference(userID, selectedGenres);
                router.navigate("/(settingUp)/pickArtistes");
              } else {
                Alert.alert("Userid doesnt exist");
              }
            } catch (error) {
              console.error("Error saving user preferences:", error);
              alert("Failed to save preferences. Please try again.");
            }
          } else {
            alert("Please select at least one genre.");
          }
        }}
        style={styles.continueButton}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Genres;

const styles = StyleSheet.create({
  headerContainer: {
    gap: 8,
    width: "95%",
    marginTop: 12,
    // alignItems: 'center',
    marginHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "PlusJakartaSansBold",
    color: "#f4f4f4",
  },
  subtitle: {
    color: "#A0A0A0", // Assuming 'Grey/04' corresponds to this color
    fontSize: 16,
    fontFamily: "PlusJakartaSansRegular",
  },
  listContainer: {
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginTop: 24,
  },
  popularText: {
    color: "#808080", // Assuming 'Grey/06' corresponds to this color
    fontSize: 16,
    fontFamily: "PlusJakartaSansBold",
    lineHeight: 20,
  },
  itemWrapper: {
    width: "33%",
    padding: 3,
  },
  genreItem: {
    borderWidth: 1,
    borderColor: "#A0A0A0", // Assuming 'Grey/04' corresponds to this color
    paddingVertical: 16,
    borderRadius: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  genreItemSelected: {
    backgroundColor: "#FF6D1B", // Assuming 'Orange/08' corresponds to this color
    borderColor: "transparent",
  },
  genreText: {
    textAlign: "center",
    color: "#A0A0A0", // Assuming 'Grey/04' corresponds to this color
  },
  genreTextSelected: {
    color: "#f4f4f4",
  },
  continueButton: {
    backgroundColor: "#FF6D1B", // Assuming 'Orange/08' corresponds to this color
    width: "90%",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 38,
    alignSelf: "center",
    borderRadius: 56,
  },
  continueButtonText: {
    color: "#ffffff",
    fontFamily: "PlusJakartaSansMedium",
    fontSize: 16,
  },
});
