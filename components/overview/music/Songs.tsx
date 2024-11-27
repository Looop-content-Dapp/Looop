import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, FlatList } from 'react-native'
import React, { useState } from 'react'
import { ArrowDown01Icon, Search01Icon } from '@hugeicons/react-native'

const Songs = () => {
    const tracks = [
        { id: '1', name: 'MARCH AM', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '2', name: 'AZAMAN', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '3', name: 'MARCH AM', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '4', name: 'AZAMAN', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '5', name: 'MARCH AM', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '6', name: 'AZAMAN', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '7', name: 'MARCH AM', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '8', name: 'AZAMAN', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '9', name: 'MARCH AM', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
        { id: '10', name: 'AZAMAN', streams: '13,893,382', date: 'Oct 4', cover: 'https://i.pinimg.com/564x/e7/40/3f/e7403f32bb2b50339f575298d3a10011.jpg' },
    ]

    const [searchText, setSearchText] = useState('');
    const [filteredTracks, setFilteredTracks] = useState(tracks);

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filtered = tracks.filter(track => track.name.toLowerCase().includes(text.toLowerCase()));
        setFilteredTracks(filtered);
    };

    const renderListHeader = () => (
        <View>
            <View className='bg-[#12141B] h-[32px] flex-row items-center justify-between px-[16px]'>
                <Text className='text-[14px] font-PlusJakartaSansBold text-Grey/06'>Track name</Text>
                <Text className='text-[14px] font-PlusJakartaSansBold text-Grey/06'>Streams</Text>
                <Text className='text-[14px] font-PlusJakartaSansBold text-Grey/06'>Date</Text>
            </View>
        </View>
    );

    const renderTrack = ({ item }) => (
        <View className='flex-row items-center p-[16px] border-b border-[#12141B]'>
            <View style={styles.trackInfo} className='flex-row items-center'>
                <Image source={{ uri: item.cover }} style={styles.trackImage} />
                <Text className='text-[14px] font-PlusJakartaSansRegular text-[#f4f4f4]'>{item.name}</Text>
            </View>
            <View className='flex-row gap-x-[40px]'>
                <Text className='text-[14px] font-PlusJakartaSansBold text-[#f4f4f4]'>{item.streams}</Text>
                <Text style={styles.trackDate}>{item.date}</Text>
            </View>
        </View>
    );

    return (
        <View>
            <View className='flex-row items-center justify-between'>
                <Text className='text-[20px] font-PlusJakartaSansMedium text-[#787A80]'>{tracks.length} Tracks</Text>
                <TouchableOpacity className='py-[8px] border-2 border-Grey/07 flex-row items-center px-[12px] gap-x-[4px] rounded-[10px]'>
                    <Text className='text-[14px] font-PlusJakartaSansMedium text-[#D2D3D5]'>30 Days</Text>
                    <ArrowDown01Icon size={24} color='#787A80' />
                </TouchableOpacity>
            </View>

            <View style={styles.searchInput} className='flex-row items-center gap-x-[8px] py-[16px] my-[24px]'>
                <Search01Icon size={16} color='#787A80' />
                <TextInput
                    placeholder="Search for a track"
                    placeholderTextColor="#888"
                    value={searchText}
                    onChangeText={handleSearch}
                />
            </View>

            <FlatList
                data={filteredTracks}
                keyExtractor={(item) => item.id}
                renderItem={renderTrack}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderListHeader}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    searchInput: {
        backgroundColor: '#0A0B0F',
        color: 'white',
        padding: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    trackImage: {
        width: 50,
        height: 50,
        borderRadius: 4,
        marginRight: 16,
    },
    trackInfo: {
        flex: 1,
    },
    trackDate: {
        color: '#888',
    }
});

export default Songs
