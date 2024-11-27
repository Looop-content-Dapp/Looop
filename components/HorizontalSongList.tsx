import React from 'react';
import { View, FlatList, Image, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Make sure you install expo-linear-gradient

const DATA = [
  {
    id: '1',
    rank: 1,
    title: 'MMS',
    artist: 'Asake, Wizkid',
    imageUrl: 'https://example.com/mms.jpg', // Replace with actual image URLs
    streams: 8,
  },
  {
    id: '2',
    rank: 2,
    title: 'Awolowo',
    artist: 'Fido',
    imageUrl: 'https://example.com/awolowo.jpg',
    streams: 9,
  },
  {
    id: '3',
    rank: 3,
    title: 'JUJU',
    artist: 'Smur Lee, ODUMODUBLVCK',
    imageUrl: 'https://example.com/juju.jpg',
    streams: 10,
  },
  {
    id: '4',
    rank: 4,
    title: 'Active',
    artist: 'Asake, Travis Scott',
    imageUrl: 'https://example.com/active.jpg',
    streams: 11,
  },
  {
    id: '5',
    rank: 5,
    title: 'Higher',
    artist: 'Burna Boy',
    imageUrl: 'https://example.com/higher.jpg',
    streams: 12,
  },
  {
    id: '6',
    rank: 6,
    title: 'Stronger',
    artist: 'Young John',
    imageUrl: 'https://example.com/stronger.jpg',
    streams: 13,
  },
  {
    id: '7',
    rank: 7,
    title: 'Worldwide',
    artist: 'Asake',
    imageUrl: 'https://example.com/worldwide.jpg',
    streams: 14,
  },
  // Add more data as needed
];

const HorizontalSongList = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer} className='flex-row'>
      <Text style={styles.rank}>{item.rank}</Text>
      <Image source={{ uri: item.imageUrl }} style={styles.albumCover} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
      </View>
      <Text style={styles.streamCount}>{item.streams}</Text>
      <TouchableOpacity style={styles.moreOptions}>
        <Text style={styles.moreOptionsText}>•••</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF7F50', '#000000']}
      style={styles.gradientBackground}
    >
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 20, // Rounded corners like in the image
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40, // Adjust width to fit each item horizontally like in the image
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    width: 30, // Fixed width for rank number
    textAlign: 'center',
  },
  albumCover: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  songTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  artistName: {
    fontSize: 12,
    color: '#bbb',
  },
  streamCount: {
    fontSize: 14,
    color: '#fff',
    marginRight: 10,
  },
  moreOptions: {
    paddingLeft: 10,
  },
  moreOptionsText: {
    fontSize: 18,
    color: '#bbb',
  },
});

export default HorizontalSongList;
