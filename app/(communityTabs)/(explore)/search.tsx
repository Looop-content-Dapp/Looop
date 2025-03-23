import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { ArrowLeft01Icon, Search01Icon } from '@hugeicons/react-native';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { addRecentSearch, clearRecentSearches } from '../../../redux/slices/searchSlice';
import { useSearch } from '../../../hooks/useSearch';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'posts' | 'tribes' | 'artistes'>();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const recentSearches = useAppSelector(state => state.search.recentSearches);

    const { data, isLoading } = useSearch(searchQuery, activeFilter);
    const results = data?.data?.results || [];

    const handleRecentSearchPress = (search: string) => {
        setSearchQuery(search);
    };

    const renderSearchResult = ({ item }: { item: any }) => {
        switch (item.type) {
            case 'community':
                return (
                    <Pressable
                        className="flex-row items-center p-4 rounded-lg mb-2 bg-[#202227]"
                        onPress={() => {
                            // Navigate to community
                        }}
                    >
                        <Image
                            source={{ uri: item.coverImage }}
                            className="w-12 h-12 rounded-full mr-3"
                        />
                        <View>
                            <Text className="text-[#f4f4f4] font-medium">{item.communityName}</Text>
                            <Text className="text-[#63656B] text-sm">{item.memberCount} members</Text>
                        </View>
                    </Pressable>
                );
            case 'post':
                return (
                    <Pressable
                        className="flex-row items-center p-4 rounded-lg mb-2 bg-[#202227]"
                        onPress={() => {
                            // Navigate to post
                        }}
                    >
                        <View>
                            <Text className="text-[#f4f4f4] font-medium">{item.title}</Text>
                            <Text className="text-[#63656B] text-sm">
                                in {item.community.communityName}
                            </Text>
                        </View>
                    </Pressable>
                );
            default:
                return (
                    <Pressable
                        className="flex-row items-center p-4 rounded-lg mb-2 bg-[#202227]"
                        onPress={() => handleRecentSearchPress(item)}
                    >
                        <Text className="text-[#f4f4f4]">
                            {typeof item === 'string' ? item : item.name}
                        </Text>
                    </Pressable>
                );
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "",
            headerShadowVisible: false,
            headerLeft: () => (
                <View className="flex-row items-center flex-1">
                    <Pressable onPress={() => navigation.goBack()} className="pr-3">
                        <ArrowLeft01Icon size={24} color="#f4f4f4" variant="stroke" />
                    </Pressable>
             <View className="bg-[#111318] h-[40px] flex-1 rounded-[10px] px-4 flex-row items-center gap-x-[12px] border border-[#202227]">
                <Search01Icon size={16} color="#63656B" variant="stroke" />
                <TextInput
                  placeholder="Find your favorite artistes and join their tribe"
                  placeholderTextColor="#63656B"
                  className="flex-1 text-[14px] text-white font-PlusJakartaSansMedium"
                />
              </View>
            </View>
            )
        })
    }, [searchQuery])

    return (
        <View className="flex-1 bg-black">
            {!searchQuery ? null : (
                <View className="border-b border-[#202227]">
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={['All', 'Posts', 'Artistes', 'Tribes']}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item }) => (
                            <Pressable
                                key={item}
                                className={`px-6 py-3 ${
                                    (item.toLowerCase() === 'all' && !activeFilter) ||
                                    (activeFilter === item.toLowerCase())
                                        ? 'border-b-2 border-[#FF4D00]'
                                        : ''
                                }`}
                                onPress={() => setActiveFilter(item.toLowerCase() as any)}
                            >
                                <Text className="text-[#f4f4f4] font-medium">{item}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}

            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator color="#f4f4f4" />
                </View>
            ) : (
                <FlatList
                    data={searchQuery ? results : recentSearches}
                    keyExtractor={(item, index) =>
                        item._id || (typeof item === 'string' ? item : String(index))
                    }
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center pt-8">
                            <Text className="text-[#63656B] text-center">
                                {searchQuery ? 'No results found' : 'No recent searches'}
                            </Text>
                        </View>
                    }
                    ListHeaderComponent={
                        !searchQuery && recentSearches.length > 0 ? (
                            <Text className="text-[#f4f4f4] text-lg mb-4">Recent Searches</Text>
                        ) : null
                    }
                    renderItem={renderSearchResult}
                />
            )}
        </View>
    );
};

export default SearchScreen;
