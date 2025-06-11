import api from "@/config/apiConfig";
import { handleApiError } from "@/utils/requestHandler";
import { Ionicons } from "@expo/vector-icons";
import { Search01Icon } from "@hugeicons/react-native";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

const useDebounce = (func: Function, delay: number) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );
};

interface SearchResult {
  _id: string;
  title?: string;
  name?: string;
  image?: string;
  profileImage?: string;
  type?: "track" | "artist" | "release" | "playlist";
  artist?: {
    name: string;
    image: string;
  };
}

interface SearchParams {
  query: string;
  resultType?: string;
  limit?: number;
  sort?: string;
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

interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchResults;
  metadata: {
    query: string;
    pagination: {
      current: number;
      limit: number;
      totalResults: number;
    };
  };
}

const renderSearchItem = ({
  item,
  onItemPress,
}: {
  item: any;
  onItemPress: (item: any, type: string) => void;
}) => {
  console.log("displayImage", item);
  // Default type based on available properties
  let displayType =
    item.type || (item.name ? "artist" : item.title ? "track" : "unknown");

  const displayImage =
    displayType === "artist"
      ? item.profileImage || item.image || ""
      : item?.artwork?.high ||
        item?.release?.artwork?.high ||
        item?.artist?.image ||
        "";

  const displayTitle = item?.title || item?.name || "Untitled";

  return (
    <Pressable
      className="flex-row items-center py-3"
      onPress={() => onItemPress(item, displayType)}
    >
      <Image
        source={{ uri: displayImage }}
        className={`w-12 h-12 ${
          displayType === "artist" ? "rounded-full" : "rounded"
        }`}
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

// Add these component definitions before the MusicSearch component

const LoadingSpinner = () => (
  <View className="flex-1 justify-center items-center">
    <ActivityIndicator size="large" color="#FF6D1B" />
  </View>
);

const RecentSearches = ({
  searches,
  onSearchSelect,
  onClearAll,
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
      renderItem={({ item }) => (
        <Pressable
          className="flex-row items-center py-3"
          onPress={() => onSearchSelect(item)}
        >
          <Search01Icon size={24} color="#787A80" />
          <Text className="text-white ml-3">{item}</Text>
        </Pressable>
      )}
      ListEmptyComponent={() => (
        <Text className="text-[#787A80] text-center py-4">
          No recent searches
        </Text>
      )}
    />
  </View>
);

const searchApi = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    const { query, resultType, limit = 20, sort = "relevance" } = params;
    const response = await api.get("/search", {
      params: {
        query,
        type: resultType,
        limit,
        sort,
        page: 1,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error as AxiosError);
  }
};

const MusicSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Map display names to result types
  type TabType = "All" | "Songs" | "Artists" | "Albums" | "Playlists";

  const tabsMap: Record<TabType, string> = {
    All: "all",
    Songs: "track",
    Artists: "artist",
    Albums: "release",
    Playlists: "playlist",
  };

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery<SearchResponse>({
    queryKey: ["search", searchQuery, activeTab],
    queryFn: () =>
      searchApi({
        query: searchQuery,
        resultType:
          tabsMap[activeTab as TabType] === "all"
            ? undefined
            : tabsMap[activeTab as TabType],
        limit: 20,
        sort: "relevance",
      }),
    enabled: searchQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime)
  });

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      setRecentSearches([]);
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const handleClearRecentSearches = async () => {
    try {
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  const handleSearch = useDebounce(async (query: string) => {
    if (!query.trim()) {
      // Handle empty query
    }
  }, 500);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, activeTab]);

  const getResultsForTab = () => {
    if (!searchResults?.data) return [];

    const results = searchResults.data;
    switch (activeTab) {
      case "Songs":
        return results.tracks?.items || [];
      case "Artists":
        return results.artists?.items || [];
      case "Albums":
        return results.releases?.items || [];
      case "Playlists":
        return results.playlists?.items || [];
      default:
        return [
          ...(results.tracks?.items || []),
          ...(results.artists?.items || []),
          ...(results.releases?.items || []),
          ...(results.playlists?.items || []),
        ];
    }
  };

  const renderActiveTab = () => {
    if (!searchQuery) {
      return (
        <RecentSearches
          searches={recentSearches}
          onSearchSelect={setSearchQuery}
          onClearAll={handleClearRecentSearches}
        />
      );
    }

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <Text className="text-[#FF6D1B] text-center py-4">
          {error instanceof Error
            ? error.message
            : "An error occurred while searching"}
        </Text>
      );
    }

    const results = getResultsForTab();
    return (
      <FlatList
        data={results}
        className="px-4"
        keyExtractor={(item) => `${item.type || "unknown"}-${item._id}`}
        renderItem={({ item }) =>
          renderSearchItem({
            item,
            onItemPress: handleItemPress,
          })
        }
        ListEmptyComponent={() => (
          <Text className="text-[#787A80] text-center py-4">
            No results found
          </Text>
        )}
      />
    );
  };

  const handleItemPress = (item: any, displayType: string) => {
    switch (displayType) {
      case "artist":
        router.push({
          pathname: `/(musicTabs)/(home)/_screens/artist/${item._id}`,
          params: {
            id: item._id,
            name: item.name,
            image:
              item.profileImage || item?.artwork?.high || item?.artist?.image,
          },
        });
        break;

      case "track":
      case "release":
        router.push({
          pathname: "/(musicTabs)/(home)/_screens/musicDetails",
          params: {
            id: item._id,
            title: item.title || item.name,
            image: item?.artwork?.high || item?.release?.artwork?.high,
            type: displayType,
            artist: item.artist?.name,
          },
        });
        break;

      case "playlist":
        router.push({
          pathname: "/(musicTabs)/(library)/playlistDetails",
          params: {
            id: item._id,
            title: item.title || item.name,
            image: item?.artwork?.high,
          },
        });
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#000000]">
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
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setActiveTab(item)}
                className={`px-[16px] py-[10px] mr-2 rounded-[10px] ${
                  activeTab === item ? "bg-[#FF6D1B]" : "bg-[#12141B]"
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
  );
};

export default MusicSearch;
