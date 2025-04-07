import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowDown01Icon, Search01Icon } from "@hugeicons/react-native";
import { useArtistMusic } from '@/hooks/useArtistMusic';

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Image
      source={require('@/assets/images/ghost.png')}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>No tracks yet</Text>
    <Text style={styles.emptyText}>Upload your music to start exploring your tracks</Text>
  </View>
);

const Songs = () => {
  const { data, isLoading } = useArtistMusic();
  const [searchText, setSearchText] = useState("");
  const [filteredTracks, setFilteredTracks] = useState([]);

  useEffect(() => {
    if (data?.data.songs.items) {
      setFilteredTracks(data.data.songs.items);
    }
  }, [data]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = data?.data.songs.items.filter((track) =>
      track.title.toLowerCase().includes(text.toLowerCase())
    ) || [];
    setFilteredTracks(filtered);
  };

  const renderListHeader = () => (
    <View>
      <View className="bg-[#12141B] h-[32px] flex-row items-center justify-between px-[16px]">
        <Text className="text-[14px] font-PlusJakartaSansBold text-Grey/06">
          Track name
        </Text>
        <Text className="text-[14px] font-PlusJakartaSansBold text-Grey/06">
          Streams
        </Text>
        <Text className="text-[14px] font-PlusJakartaSansBold text-Grey/06">
          Date
        </Text>
      </View>
    </View>
  );

  const renderTrack = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between p-[16px] border-b border-[#12141B]">
      <View className="items-start flex-1 justify-center gap-3">
        <Image source={{ uri: item.artwork }} style={styles.trackImage} />
        <Text className="text-[14px] font-PlusJakartaSansRegular text-[#f4f4f4]">
          {item.title}
        </Text>
      </View>

      <View className="flex-1">
        <Text className="text-[14px] font-PlusJakartaSansBold text-[#f4f4f4]">
          {parseInt(item.totalStreams).toLocaleString()}
        </Text>
      </View>

      <View>
        <Text style={styles.trackDate}>
          {new Date(item.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A187B5" />
      </View>
    );
  }

  if (!data?.data.songs.items?.length) {
    return <EmptyState />;
  }

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-[18px] font-PlusJakartaSansMedium text-[#787A80]">
          {data?.data.songs.total || 0} Tracks
        </Text>
        <TouchableOpacity className="py-[8px] border-2 border-Grey/07 flex-row items-center px-[12px] gap-x-[4px] rounded-[10px]">
          <Text className="text-[14px] font-PlusJakartaSansMedium text-[#D2D3D5]">
            30 Days
          </Text>
          <ArrowDown01Icon size={24} color="#787A80" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-x-[8px] py-[16px] my-[24px]">
        <View className="absolute top-8 left-4 z-30">
          <Search01Icon size={16} color="#787A80" />
        </View>
        <TextInput
          placeholder="Search for a track"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderTrack}
        disableVirtualization={true}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  searchInput: {
    backgroundColor: "#0A0B0F",
    color: "white",
    paddingLeft: 36,
    paddingRight: 16,
    // marginHorizontal: 16,
    // marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "gray",
    height: 42,
    width: "100%",
    flex: 1,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  trackDate: {
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#f4f4f4',
    fontFamily: 'PlusJakartaSansMedium',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#787A80',
    fontFamily: 'PlusJakartaSansRegular',
    textAlign: 'center',
  },
});

export default Songs;
