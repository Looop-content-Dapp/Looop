import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DailyMixSkeleton from "../SkeletonLoading/DailyMixSkelton";
import { PlayIcon, PauseIcon } from '@hugeicons/react-native'
import FastImage from 'react-native-fast-image';
import { useMusicPlayerContext } from "@/context/MusicPlayerContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = 350;

const DailyMixCard = ({
  mix,
  onPress,
  isPlaying = false, // Add new prop
}: {
  mix: DailyMixesMix;
  onPress: () => void;
  isPlaying?: boolean;
}) => {
  return (
    <TouchableOpacity
    style={styles.cardContainer}
    activeOpacity={0.9}
  >
    <FastImage
      source={{
        uri: mix.artwork,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable
      }}
      style={styles.gradient}
      resizeMode={FastImage.resizeMode.cover}
    >
      <View style={styles.overlay} />
      <FastImage
        source={require("../../assets/images/logo-orange.png")}
        style={styles.logo}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} className="text-[#D2D3D5] text-[24px] font-TankerRegular font-bold capitalize" numberOfLines={2}>
          {mix.name}
        </Text>
        <Text style={styles.description} className="text-[#D2D3D5] text-[14px] font-PlusJakartaSansRegular" numberOfLines={2}>
          {mix.description}
        </Text>

        <Pressable
         onPress={onPress}
         style={styles.footer}>
          {isPlaying ? (
            <PauseIcon
              size={34}
              color="rgba(255,255,255,0.9)"
              variant="solid"
            />
          ) : (
            <PlayIcon
              size={34}
              color="rgba(255,255,255,0.9)"
              variant="solid"
            />
          )}
        </Pressable>
      </View>
    </FastImage>
  </TouchableOpacity>
  );
};

const DailyMixesSection = ({
  mixes,
  title = "",
  isLoading,
}: {
  mixes: DailyMixesMix[];
  title: string;
  isLoading: boolean;
}) => {
  const { play, currentTrack } = useMusicPlayerContext();
//   console.log("songdata", mixes[0]?.tracks[0]?.songData?._id);

  if (isLoading) {
    return <DailyMixSkeleton count={3} />;
  }

  const handleMixPress = async (mix: DailyMixesMix) => {
    const albumInfo = {
      title: mix.name,
      type: "album",
      coverImage: mix.artwork
    };

    if (mix.tracks && mix.tracks.length > 0) {
      // Format the track data to match ExtendedTrack interface
      const formattedTracks = mix.tracks.map(track => ({
        ...track,
      }));
      await play(formattedTracks[0], albumInfo, formattedTracks);
    }
  };

  return (
    <View style={styles.container}>
     <Text className='text-[#D2D3D5] text-[24px] font-TankerRegular font-bold mb-4'>
       {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 20}
      >
        {mixes?.map((mix: DailyMixesMix) => (
          <DailyMixCard
            key={mix.id}
            mix={mix}
            onPress={() => handleMixPress(mix)}
            isPlaying={currentTrack?.songData?._id === mix.tracks?.[0]?._id}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 20,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  logo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 24,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackCount: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 6,
  },
});

export default DailyMixesSection;
