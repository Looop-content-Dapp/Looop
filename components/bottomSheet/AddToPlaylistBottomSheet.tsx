import React, { useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, FlatList, Alert } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Add01Icon, Search01Icon } from '@hugeicons/react-native';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { useQuery } from '../../hooks/useQuery';
import { useAppSelector } from '@/redux/hooks';
import { useAddSongToPlaylist, useUserPlaylists } from '@/hooks/usePlaylist';

const AddToPlaylistBottomSheet = ({ isVisible, closeSheet, album }: { isVisible: boolean; closeSheet: () => void; album: any }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { userdata } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string | null>("");
  const { data: playlistResponse, isLoading: isPlaylistsLoading, isFetching } = useUserPlaylists();
  const playlists = playlistResponse?.data || [];
  const addSong = useAddSongToPlaylist();
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      closeSheet();
    }
  }, [closeSheet]);

  const handleCancel = () => {
    bottomSheetRef.current?.close();
    closeSheet();
  };

  const handleAddSong = async () => {
    if (!userdata?._id || !selectedPlaylist) return;
    try {
      const trackIds = album?.tracks?.map((item: any) => item._id) || [];


      if (!trackIds.length) {
        Alert.alert('Error', 'No tracks found to add');
        return;
      }

      addSong.mutate({
        tracks: trackIds || [album?.tracks._id],
        playlistId: selectedPlaylist,
        userId: userdata?._id
      }, {
        onSuccess: () => {
          Alert.alert('Success', 'Songs added to playlist successfully');
          closeSheet();
        }
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to add songs to playlist');
    }
  };

  const renderPlaylists = () => {
    if (isFetching) {
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

    if (playlists?.length === 0) {
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
            className="flex-row items-center justify-between mb-3"
            onPress={() => setSelectedPlaylist(item._id)}
          >

           <View className='flex-row items-center gap-x-3'>
           <Image
              source={{ uri: item.coverImage }}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
            <View className="ml-3">
              <Text className="text-[#f4f4f4] text-[16px] font-PlusJakartaSansBold">{item.title}</Text>
              <Text className="text-Grey/06 text-[14px] font-PlusJakartaSansMedium">{item.songs.length} Songs</Text>
            </View>
           </View>


            <View className="w-6 h-6 rounded-full border-2 border-[#FF7A1B] mr-3 items-center justify-center">
              {selectedPlaylist === item._id && (
                <View className="w-4 h-4 rounded-full bg-[#FF7A1B]" />
              )}
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
      snapPoints={['70%']} 
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#111318' }}
      handleIndicatorStyle={{
        backgroundColor: '#787A80',
        width: 80,
        height: 4,
        borderRadius: 10,
      }}
    >
      <BottomSheetView style={{ backgroundColor: '#111318', padding: 16, flex: 1 }}>
        <View className="flex-row gap-x-[40px] items-center mb-4 border-b-2 border-[#1D2029] pb-[20px]">
          <TouchableOpacity onPress={handleCancel}>
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
          className="flex-row items-center mb-4 bg-[#202227] p-[12px] rounded-[10px]"
          onPress={() => router.push("/createPlaylist")}
        >
          <View className="w-[40px] h-[40px] bg-[#111318] items-center justify-center rounded-[10px]">
            <Add01Icon size={24} color="#787A80" />
          </View>
          <Text className="ml-3 text-[16px] font-PlusJakartaSansMedium text-white">Create a new playlist</Text>
        </TouchableOpacity>

        {/* Playlist section */}
        <Text className="text-[#f4f4f4] text-[20px] font-PlusJakartaSansMedium mb-2">My Library</Text>

        {renderPlaylists()}

        {/* Add Done Button */}
        <TouchableOpacity
          className={`p-4 rounded-[56px] w-[120px] mx-auto ${
            selectedPlaylist ? 'bg-[#2DD881]' : 'bg-[#242424]'
          }`}
          onPress={handleAddSong}
          disabled={!selectedPlaylist}
          style={{ marginTop: 'auto' }}
        >
          <Text className="text-white text-center font-PlusJakartaSansBold text-[16px]">
            Done
          </Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AddToPlaylistBottomSheet;
