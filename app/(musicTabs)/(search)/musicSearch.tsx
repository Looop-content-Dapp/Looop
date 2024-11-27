import { View, Text, FlatList, Image, Pressable, SafeAreaView, ActivityIndicator } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import React, { useState, useEffect, useCallback } from 'react'
import { Search01Icon } from '@hugeicons/react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useQuery } from '../../../hooks/useQuery'

const useDebounce = (func: Function, delay: number) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
};

interface SearchResult {
  _id: string;
  title?: string;
  name?: string;
  image?: string;
  profileImage?: string;
  type?: 'track' | 'artist' | 'release' | 'playlist';
  artist?: {
    name: string;
    image: string;
  };
}

interface SearchSection {
  items: SearchResult[];
  total: number;
  hasMore: boolean;
}

interface SearchResults {
  tracks?: SearchSection;
  artists?: SearchSection;
  releases?: SearchSection;
  playlists?: SearchSection;
}

const renderSearchItem = ({ item, onPress }: { item: any; onPress?: () => void }) => {
  // Default type based on available properties
  let displayType = item.type ||
    (item.name ? 'artist' :
     item.title ? 'track' :
     'unknown');
     console.log("search", item)

  const displayImage = item?.artwork?.high || item?.release?.artwork?.high || item?.artist?.image || '';
  const displayTitle = item?.title || item?.name || 'Untitled';

  return (
    <Pressable className="flex-row items-center py-3" onPress={onPress}>
      <Image
        source={{ uri: displayImage }}
        className={`w-12 h-12 ${displayType === 'artist' ? 'rounded-full' : 'rounded'}`}
      />
      <View className="ml-3">
        <Text className="text-white text-base">{displayTitle}</Text>
        <Text className="text-[#787A80]">
          {displayType.charAt(0).toUpperCase() + displayType.slice(1)}
          {item.artist && ` • ${item.artist.name}`}
        </Text>
      </View>
    </Pressable>
  );
};

const RecentSearches = ({
  searches,
  onSearchSelect,
  onClearAll
}: {
  searches: string[];
  onSearchSelect: (query: string) => void;
  onClearAll: () => void;
}) => (
  <View className="px-4">
    <View className="flex-row justify-between items-center py-3">
      <Text className="text-white font-medium">Recent Searches</Text>
      {searches.length > 0 && (
        <Pressable onPress={onClearAll}>
          <Text className="text-[#FF6D1B]">Clear All</Text>
        </Pressable>
      )}
    </View>
    <FlatList
      data={searches}
      keyExtractor={(item) => item}
      renderItem={({item}) => (
        <Pressable
          className="flex-row items-center py-3"
          onPress={() => onSearchSelect(item)}
        >
          <Search01Icon size={24} color="#787A80" />
          <Text className="text-white ml-3">{item}</Text>
        </Pressable>
      )}
      ListEmptyComponent={() => (
        <Text className="text-[#787A80] text-center py-4">No recent searches</Text>
      )}
    />
  </View>
);

const LoadingSpinner = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#FF6D1B" />
  </View>
);

const MusicSearch = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('All')
    const [searchResults, setSearchResults] = useState<SearchResults>({})
    const [recentSearches, setRecentSearches] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { search, getRecentSearches, clearRecentSearches } = useQuery()

    // Map display names to result types
    const tabsMap = {
      'All': 'all',
      'Songs': 'track',
      'Artists': 'artist',
      'Albums': 'release',
      'Playlists': 'playlist'
    }

    useEffect(() => {
      loadRecentSearches()
    }, [])

    const loadRecentSearches = async () => {
      try {
        const response = await getRecentSearches()
        setRecentSearches(response.data.map((item: any) => item.query))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }

    const handleClearRecentSearches = async () => {
      try {
        await clearRecentSearches()
        setRecentSearches([])
      } catch (error) {
        console.error('Error clearing recent searches:', error)
      }
    }

    const handleSearch = useDebounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults({})
        return
      }

      setIsLoading(true)
      try {
        const resultType = tabsMap[activeTab]
        const response = await search({
          query,
          type: resultType === 'all' ? undefined : resultType,
          limit: 20,
          sort: 'relevance'
        })
        setSearchResults(response.data)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults({})
      } finally {
        setIsLoading(false)
      }
    }, 500)

    useEffect(() => {
      if (searchQuery) {
        handleSearch(searchQuery)
      }
    }, [searchQuery, activeTab])

    const getResultsForTab = () => {
      switch (activeTab) {
        case 'Songs':
          return searchResults.tracks?.items || []
        case 'Artists':
          return searchResults.artists?.items || []
        case 'Albums':
          return searchResults.releases?.items || []
        case 'Playlists':
          return searchResults.playlists?.items || []
        default:
          return [
            ...(searchResults.tracks?.items || []),
            ...(searchResults.artists?.items || []),
            ...(searchResults.releases?.items || []),
            ...(searchResults.playlists?.items || [])
          ]
      }
    }

    const renderActiveTab = () => {
      if (!searchQuery) {
        return (
          <RecentSearches
            searches={recentSearches}
            onSearchSelect={setSearchQuery}
            onClearAll={handleClearRecentSearches}
          />
        )
      }

      if (isLoading) {
        return <LoadingSpinner />
      }

      const results = getResultsForTab()
      return (
        <FlatList
          data={results}
          className="px-4"
          keyExtractor={(item) => `${item.type || 'unknown'}-${item._id}`}
          renderItem={({ item }) => renderSearchItem({ item })}
          ListEmptyComponent={() => (
            <Text className="text-[#787A80] text-center py-4">No results found</Text>
          )}
        />
      )
    }

    return (
      <SafeAreaView style={{flex: 1}} className="bg-[#000000]">
        <View className="px-4 py-2">
          <View className="flex-row items-center space-x-3">
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <View className="flex-1 flex-row items-center bg-[#12141B] rounded-lg px-4 h-12">
              <Search01Icon size={24} color="#787A80" />
              <TextInput
                className="flex-1 ml-3 text-white"
                placeholder="Search artists, songs, albums and playlists"
                placeholderTextColor="#787A80"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          </View>

          <View className="mt-4">
            <FlatList
              horizontal
              data={Object.keys(tabsMap)}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => setActiveTab(item)}
                  className={`px-[16px] py-[10px] mr-2 rounded-[10px] ${
                    activeTab === item ? 'bg-[#FF6D1B]' : 'bg-[#12141B]'
                  }`}
                >
                  <Text className="text-white">{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>

        {renderActiveTab()}
      </SafeAreaView>
    )
   }

   export default MusicSearch
