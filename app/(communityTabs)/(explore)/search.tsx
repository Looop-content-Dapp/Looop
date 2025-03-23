import React, { useState, useLayoutEffect } from 'react';
import { ScrollView, View, Text, TextInput, FlatList, Pressable, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { ArrowLeft01Icon, CheckmarkBadge01Icon, Search01Icon } from '@hugeicons/react-native';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { addRecentSearch } from '../../../redux/slices/searchSlice';
import { useSearch } from '../../../hooks/useSearch';
import { BlurView } from 'expo-blur';
import { formatNumber } from '@/utils/ArstsisArr';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'posts' | 'tribes' | 'artistes'>();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const recentSearches = useAppSelector(state => state.search.recentSearches);

    const { data, isLoading } = useSearch(searchQuery, activeFilter);
    const results = data?.data?.results || [];
    console.log("result:", results)

    const handleRecentSearchPress = (search: string) => {
        setSearchQuery(search);
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() && !recentSearches.includes(text.trim())) {
            dispatch(addRecentSearch(text.trim()));
        }
    };

    const handleIconPress = () => {
        if (searchQuery.trim()) {
            handleSearch(searchQuery);
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
                        <Pressable onPress={handleIconPress}>
                            <Search01Icon size={16} color="#63656B" variant="stroke" />
                        </Pressable>
                        <TextInput
                            value={searchQuery}
                            onChangeText={handleSearch}
                            placeholder="Find your favorite artistes and join their tribe"
                            placeholderTextColor="#63656B"
                            className="flex-1 text-[14px] text-white font-PlusJakartaSansMedium"
                            autoFocus
                            onSubmitEditing={handleIconPress}
                        />
                    </View>
                </View>
            )
        })
    }, [searchQuery])

    const handleResultPress = (item: any, type: 'post' | 'artist' | 'community') => {
        switch (type) {
            case 'post':
                router.navigate({
                    pathname: 'post',
                    params: { postId: item.id }
                });
                break;
            case 'artist':
                router.navigate({
                    pathname: 'artist',
                    params: { artistId: item.id }
                });
                break;
            case 'community':
                router.navigate({
                    pathname: 'community',
                    params: { communityId: item.id }
                });
                break;
        }
    };

    // Update renderPostSection's Pressable onPress
    const renderPostSection = (data: any[]) => {
        if (!data || data.length === 0) return null;

        return (
            <View className="mb-6">
                <Text className="text-[#f4f4f4] text-xl font-semibold mb-4 px-4">Posts from your tribes</Text>
                <View className="px-4">
                    {data.map((item, index) => (
                        <Pressable
                            key={index}
                            className="mb-4"
                            onPress={() => handleResultPress(item, 'post')}
                        >
                            <View className="bg-[#202227] rounded-[16px] p-4">
                                <View className="flex-row items-center mb-3">
                                    <Image
                                        source={{ uri: item.author?.profileImage }}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <View className="flex-row items-center flex-1 ml-2">
                                        <Text className="text-[#f4f4f4] font-medium">{item.author?.name}</Text>
                                        {item.author?.verified && (
                                            <CheckmarkBadge01Icon size={16} color="#fff" className="ml-1" />
                                        )}
                                    </View>
                                    <Text className="text-[#63656B] text-[12px]">1h</Text>
                                </View>
                                <Text className="text-[#f4f4f4] text-[14px]">{item.content}</Text>
                                {item.media && item.media.length > 0 && (
                                    <View className="flex-row flex-wrap mt-3">
                                        {item.media.map((media: string, index: number) => (
                                            <Image
                                                key={index}
                                                source={{ uri: media }}
                                                className={`rounded-lg ${
                                                    item.media.length === 1 ? 'w-full h-[200px]' :
                                                    item.media.length === 2 ? 'w-[49%] h-[150px]' :
                                                    'w-[32%] h-[100px]'
                                                } ${index > 0 ? 'ml-[1%]' : ''}`}
                                            />
                                        ))}
                                    </View>
                                )}
                                <View className="flex-row items-center mt-3">
                                    <Text className="text-[#63656B] text-[14px]">{item.likes || '5.2k'}</Text>
                                    <Text className="text-[#63656B] text-[14px] ml-4">{item.comments || '1.1k'}</Text>
                                    <Text className="text-[#63656B] text-[14px] ml-4">{item.views || '12.2k'}</Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </View>
        );
    };

    // Update renderSection's Pressable onPress
    const renderSection = (title: string, data: any[], type: 'artist' | 'community') => {
        if (!data || data.length === 0) return null;

        return (
            <View className="mb-6">
                <Text className="text-[#9A9B9F] text-[20px] font-PlusJakartaSansMedium mb-4 px-4">{title}</Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={data}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    ItemSeparatorComponent={() => <View className="w-3" />}
                    renderItem={({ item }) => (
                        type === 'artist' ? (
                            <Pressable
                                className="w-[180px] h-[220px]"
                                onPress={() => handleResultPress(item, 'artist')}
                            >
                                <ImageBackground
                                    source={{ uri: item.profileImage }}
                                    className="w-full h-full rounded-[20px] bg-Grey/06 overflow-hidden"
                                    resizeMode="cover"
                                >
                                    <BlurView
                                        intensity={80}
                                        tint="dark"
                                        className="absolute bottom-0 bg-black/30 w-full"
                                    >
                                        <View className="flex-1 justify-end p-4">
                                            <View className="flex-row items-center gap-x-1">
                                                <Text className="text-[#f4f4f4] text-[14px] font-semibold">{item.name}</Text>
                                                {item.verified && (
                                                    <CheckmarkBadge01Icon size={16} color='#f4f4f4' variant='solid' />
                                                )}
                                            </View>
                                            <Text className="text-[#63656B] text-[12px] mt-1">{item?.followers} Tribestars</Text>
                                        </View>
                                    </BlurView>
                                </ImageBackground>
                            </Pressable>
                            ) : (
                                <Pressable
                                className="w-[283px] h-[320px]"
                                onPress={() => handleResultPress(item, 'community')}
                            >
                                <ImageBackground
                                    source={{ uri: item.coverImage }}
                                    className="w-full h-full rounded-[20px] bg-Grey/06 overflow-hidden"
                                    resizeMode="cover"
                                >
                                    <BlurView
                                        intensity={80}
                                        tint="dark"
                                        className="absolute bottom-0 bg-black/30 w-full"
                                    >
                                        <View className="flex-1 justify-end p-6">
                                            <View className="flex-row items-center gap-x-1">
                                                <Text className="text-[#f4f4f4] text-[16px] font-semibold">{item.communityName}</Text>
                                                {item.verified && (
                                                    <CheckmarkBadge01Icon size={24} color='#f4f4f4' variant='solid' />
                                                )}
                                            </View>
                                            <Text className="text-[#63656B] text-[14px] mt-1">{formatNumber(item?.memberCount as string)} Members</Text>
                                        </View>
                                    </BlurView>
                                </ImageBackground>
                            </Pressable>
                            )
                        )}
                    />
                </View>
            );
    };

    return (
        <ScrollView >
            {!searchQuery ? null : (
                <View className="">
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={['All', 'Posts', 'Artistes', 'Tribes']}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        renderItem={({ item }) => (
                            <Pressable
                                key={item}
                                className={`px-6 py-3 my-[16px] ${
                                    (item.toLowerCase() === 'all' && !activeFilter) ||
                                    (activeFilter === item.toLowerCase())
                                        ? 'border-b-2 border-[#FF4D00]'
                                        : ''
                                }`}
                                onPress={() => setActiveFilter(item.toLowerCase() as any)}
                            >
                                <Text className="text-[#f4f4f4] font-PlusJakartaSansMedium text-[16px]">{item}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            )}
          {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator color="#f4f4f4" />
                </View>
            ) : !searchQuery ? (
                <FlatList
                    data={recentSearches}
                    keyExtractor={(item, index) => (typeof item === 'string' ? item : String(index))}
                    contentContainerStyle={{ padding: 16 }}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center pt-8">
                            <Text className="text-[#63656B] text-center">No recent searches</Text>
                        </View>
                    }
                    ListHeaderComponent={
                        recentSearches.length > 0 ? (
                            <Text className="text-[#f4f4f4] text-lg mb-4">Recent Searches</Text>
                        ) : null
                    }
                    renderItem={({ item }) => (
                        <Pressable
                            className="items-center justify-center py-[6px] px-[12px] rounded-[100px] bg-[#202227] mb-2 w-[48%]"
                            onPress={() => handleRecentSearchPress(item)}
                        >
                            <Text className="text-[#f4f4f4] text-[14px]">
                                • {typeof item === 'string' ? item : item?.name}
                            </Text>
                        </Pressable>
                    )}
                />
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 32, marginTop: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {renderPostSection(results.filter(item => item.type === 'post'))}
                    {renderSection('Artistes', results.filter(item => item.type === 'artist'), 'artist')}
                    {renderSection('Bubbling Communities', results.filter(item => item.type === 'community'), 'community')}

                    {results.length === 0 && (
                        <View className="flex-1 justify-center items-center pt-8">
                            <Text className="text-[#63656B] text-center">No results found</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </ScrollView>
    );
};

export default SearchScreen;
