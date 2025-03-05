import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, FlatList, Alert } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Add01Icon, Search01Icon } from '@hugeicons/react-native';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { useQuery } from '../../hooks/useQuery';
import { useAppSelector } from '@/redux/hooks';

const AddToPlaylistBottomSheet = ({ isVisible, closeSheet, album }: { isVisible: boolean; closeSheet: () => void; album: any }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { getAllPlaylistsForUser, addSongToPlaylist } = useQuery();
  const { userdata } = useAppSelector((state) => state.auth);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const fetchPlaylists = useCallback(async () => {
    if (!userdata?._id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllPlaylistsForUser(userdata._id);
      setPlaylists(response?.data || []);
    } catch (err) {
      setError('Failed to fetch playlists');
    } finally {
      setIsLoading(false);
    }
  }, [getAllPlaylistsForUser]);

  useEffect(() => {
    if (isVisible) {
      fetchPlaylists();
    }
  }, [isVisible, fetchPlaylists]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      closeSheet();
    }
  }, [closeSheet]);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleAddSong = async (playlistId: string) => {
    if (!userdata?._id) return;
    try {
      const trackIds = album?.tracks?.map((item: any) => item._id) || [];

      if (!trackIds.length) {
        Alert.alert('Error', 'No tracks found to add');
        return;
      }

      await addSongToPlaylist(trackIds, playlistId, userdata?._id);
      Alert.alert('Success', 'Songs added to playlist');
    } catch (error) {
      Alert.alert('Error', 'Failed to add songs to playlist');
    }
  };

  const renderPlaylists = () => {
    if (isLoading) {
      return (
        <FlatList
          data={Array(5).fill({})}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => (
            <MotiView
              from={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, duration: 800 }}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            >
              <View style={{ width: 50, height: 50, backgroundColor: '#242424', borderRadius: 8 }} />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <View style={{ width: '80%', height: 14, backgroundColor: '#242424', marginBottom: 8, borderRadius: 4 }} />
                <View style={{ width: '60%', height: 14, backgroundColor: '#242424', borderRadius: 4 }} />
              </View>
            </MotiView>
          )}
        />
      );
    }

    if (error) {
      return <Text style={{ color: 'red' }}>{error}</Text>;
    }

    if (playlists.length === 0) {
      return (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: 'white', fontSize: 16 }}>No playlists available.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={playlists}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center mb-3"
            onPress={() => handleAddSong(item._id)}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 50, height: 50, borderRadius: 8 }}
            />
            <View className="ml-3">
              <Text className="text-white">{item.title}</Text>
              <Text className="text-gray-400">{item.songs.length} Songs</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <BottomSheet
      index={isVisible ? 0 : -1}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={[450, 700]}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#12141B' }}
      handleIndicatorStyle={{
        backgroundColor: '#787A80',
        width: 80,
        height: 4,
        borderRadius: 10,
      }}
    >
      <BottomSheetView style={{ backgroundColor: '#12141B', padding: 16 }}>
        <View className="flex-row gap-x-[40px] items-center mb-4 border-b-2 border-[#1D2029] border-spacing-6">
          <TouchableOpacity onPress={closeSheet}>
            <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/04">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-[16px] font-PlusJakartaSansMedium text-[#f4f4f4] font-bold">Add to Playlist</Text>
        </View>

        {/* Search bar */}
        <View className="bg-[#242424] flex-row items-center gap-x-6 p-3 mb-4 rounded-lg">
          <Search01Icon size={16} color='#787A80' variant='stroke' />
          <TextInput
            placeholder="Search playlists"
            placeholderTextColor="#787A80"
            style={{ color: '#fff', flex: 1 }}
          />
        </View>

        {/* Create new playlist */}
        <TouchableOpacity
          className="flex-row items-center mb-4"
          onPress={() => router.push("/createPlaylist")}
        >
          <View className="w-[40px] h-[40px] bg-[#1D2029] items-center justify-center rounded-[10px]">
            <Add01Icon size={24} color="#787A80" />
          </View>
          <Text className="ml-3 text-white">Create a new playlist</Text>
        </TouchableOpacity>

        {/* Playlist section */}
        <Text className="text-white mb-2">My Library</Text>

        {renderPlaylists()}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AddToPlaylistBottomSheet;
