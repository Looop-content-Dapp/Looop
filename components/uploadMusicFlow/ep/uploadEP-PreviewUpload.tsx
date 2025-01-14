import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";

const EPCoverImage = require("../../../assets/images/rema.jpg");

const EPPreview = () => {
  const EP = {
    coverImage: EPCoverImage,
    name: "Sounds from this side",
    artist: "Artist Name",
    numberOfSongs: 10,
    songs: [
      {
        id: "1",
        name: "Am I high rn",
        artists: "Soundman, Wavboy",
        duration: "3:45"
      },
      {
        id: "2",
        name: "By any means",
        artists: "Soundman",
        duration: "4:20"
      },
      { id: "3", name: "8 cars", artists: "Soundman", duration: "2:50" },
      {
        id: "4",
        name: "Bank on me",
        artists: "Soundman, Jeriq",
        duration: "5:15"
      }
    ]
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* EP Cover */}
        <Image
          source={EP.coverImage}
          style={styles.coverImage}
          resizeMode="cover"
        />

        {/* EP Details */}
        <Text style={styles.EPName}>{EP.name}</Text>
        <Text style={styles.artistName}>By {EP.artist}</Text>
        <Text style={styles.songCount}>EP • {EP.numberOfSongs} songs</Text>

        {EP.songs.map((song, index) => (
          <View style={styles.songItem} key={index}>
            <View>
              <Text style={styles.songIndex}>{index + 1}.</Text>
            </View>
            <View style={styles.songInfo}>
              <Text style={styles.songName}>{song.name}</Text>
              <Text style={styles.songArtists}>{song.artists}</Text>
            </View>
            <Text style={styles.songDuration}>{song.duration}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default EPPreview;

const styles = StyleSheet.create({
  container: {
    // flex: 1
  },
  contentContainer: {
    paddingBottom: 120,
    paddingTop: 48,
    alignItems: "center"
  },
  coverImage: {
    width: 240,
    height: 240,
    borderRadius: 24,
    marginTop: 32
  },
  EPName: {
    fontSize: 20,
    color: "#f4f4f4",
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 16,
    textAlign: "center"
  },
  artistName: {
    fontSize: 14,
    color: "#D2D3D5",
    textAlign: "center",
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 4
  },
  songCount: {
    fontSize: 14,
    marginTop: 4,
    color: "#787A80",
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
    marginBottom: 48
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12
    // borderBottomColor: "#333",
    // borderBottomWidth: 1
  },
  songIndex: {
    width: 16,
    fontSize: 16,
    color: "#F4F4F4",
    fontFamily: "PlusJakartaSans-Medium"
  },
  songInfo: {
    flex: 1,
    marginLeft: 12
  },
  songName: {
    color: "#F4F4F4",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "PlusJakartaSans-Medium"
  },
  songArtists: {
    color: "#787A80",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    marginTop: 4
  },
  songDuration: {
    color: "#787A80",
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium"
  },
  fixedButton: {
    position: "absolute",
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: "#57E09A",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center"
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold"
  }
});
