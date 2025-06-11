import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { AppButton } from "@/components/app-components/button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAppSelector } from "@/redux/hooks";
import { useGetArtistBasedOnGenre} from "@/hooks/artist/useGenre";
import ArtistsByGenre from "@/components/ArtistGenre";
import {
    ArrowLeft02Icon,
    
  } from "@hugeicons/react-native";

interface SelectedArtist {
  id: string;
  name: string;
}

const Selection = () => {
  const { userdata } = useAppSelector((state) => state.auth);
  const { data, isLoading } = useGetArtistBasedOnGenre(userdata?._id as string);
  const [selectedArtists, setSelectedArtists] = useState<SelectedArtist[]>([]);
  
  const navigation = useNavigation();
  const router = useRouter();
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text className="text-[20px] text-center text-[#f4f4f4] leading-[30px] font-PlusJakartaSansBold">
          Based on your selections
        </Text>
      ),
      headerBackTitleVisible: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft02Icon size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleJoinTribe = (artistId: string, artistName: string) => {
    if (selectedArtists.some(artist => artist.id === artistId)) {
      setSelectedArtists(prev => prev.filter(artist => artist.id !== artistId));
    } else {
      setSelectedArtists(prev => [...prev, { id: artistId, name: artistName }]);
    }
  };

  const handleContinue = () => {
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A1B" />
          <Text style={styles.loadingText}>Finding artists based on your preferences...</Text>
        </View>
      ) : (
        <>
          <>
            <View style={styles.headerContainer}>
              
              <Text style={styles.headerSubtitle}>
              Alright! Let&rsquo;s follow some artistes to start exploring their discographies
              </Text>
            </View>
            
            <View style={styles.artistGenreContainer}>
              <ArtistsByGenre 
            // @ts-expect-error: Type 'Artist[]' is not assignable to type 'GenreData[]'.
                data={data?.data || []} 
                onJoinTribe={handleJoinTribe}
              />
            </View>
          </>
          
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040405",
  },
  scrollContent: {
    paddingBottom: hp('20%'),
  },
  headerContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f4f4f4',
    fontFamily: 'PlusJakartaSansBold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: 8,
    fontFamily: 'PlusJakartaSansRegular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#f4f4f4',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSansRegular',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    width: wp('100%'),
    backgroundColor: '#000',
    zIndex: 10,
    padding: 20,
  },
  artistGenreContainer: {
    flex: 1,
  }
});

export default Selection;