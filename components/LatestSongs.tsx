import { MoreHorizontalIcon } from '@hugeicons/react-native';
import React from 'react';
import { View, FlatList, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

// const songs = [
//   // Example song data
//   { id: '1', title: 'Let Me Know', artist: 'L.A.X, taves & Ayo Maff', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '2', title: 'Close To Me', artist: 'Niphkeys & Zinoleesky', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '3', title: 'Controller (Remix)', artist: 'Onesimus & Joeboy', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '4', title: 'Shout', artist: 'Boy Spyce', image: 'https://i.pinimg.com/564x/5b/d0/1d/5bd01db5bf093de72d108fcc00a05c34.jpg' },
//   { id: '5', title: 'Another Song', artist: 'Artist 5', image: 'https://i.pinimg.com/564x/fe/aa/04/feaa044c8df41f85512825b7c0ab6e80.jpg' },
//   { id: '6', title: 'Next Song', artist: 'Artist 6', image: 'https://i.pinimg.com/564x/fe/67/20/fe67206cf15b569d22493af97a3f4e21.jpg' },
//   { id: '7', title: 'Some Song', artist: 'Artist 7', image: 'https://i.pinimg.com/564x/3a/31/36/3a31366dc35a5c92504f44399b9dcdb7.jpg' },
//   { id: '8', title: 'Cool Song', artist: 'Artist 8', image: 'https://i.pinimg.com/564x/0e/51/0c/0e510c3bd1033a459035b65963aa440d.jpg' },
//   { id: '1', title: 'Let Me Know', artist: 'L.A.X, taves & Ayo Maff', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '2', title: 'Close To Me', artist: 'Niphkeys & Zinoleesky', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '3', title: 'Controller (Remix)', artist: 'Onesimus & Joeboy', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '4', title: 'Shout', artist: 'Boy Spyce', image: 'https://i.pinimg.com/564x/5b/d0/1d/5bd01db5bf093de72d108fcc00a05c34.jpg' },
//   { id: '5', title: 'Another Song', artist: 'Artist 5', image: 'https://i.pinimg.com/564x/fe/aa/04/feaa044c8df41f85512825b7c0ab6e80.jpg' },
//   { id: '6', title: 'Next Song', artist: 'Artist 6', image: 'https://i.pinimg.com/564x/fe/67/20/fe67206cf15b569d22493af97a3f4e21.jpg' },
//   { id: '7', title: 'Some Song', artist: 'Artist 7', image: 'https://i.pinimg.com/564x/3a/31/36/3a31366dc35a5c92504f44399b9dcdb7.jpg' },
//   { id: '8', title: 'Cool Song', artist: 'Artist 8', image: 'https://i.pinimg.com/564x/0e/51/0c/0e510c3bd1033a459035b65963aa440d.jpg' },
//   { id: '1', title: 'Let Me Know', artist: 'L.A.X, taves & Ayo Maff', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '2', title: 'Close To Me', artist: 'Niphkeys & Zinoleesky', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '3', title: 'Controller (Remix)', artist: 'Onesimus & Joeboy', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '4', title: 'Shout', artist: 'Boy Spyce', image: 'https://i.pinimg.com/564x/5b/d0/1d/5bd01db5bf093de72d108fcc00a05c34.jpg' },
//   { id: '5', title: 'Another Song', artist: 'Artist 5', image: 'https://i.pinimg.com/564x/fe/aa/04/feaa044c8df41f85512825b7c0ab6e80.jpg' },
//   { id: '6', title: 'Next Song', artist: 'Artist 6', image: 'https://i.pinimg.com/564x/fe/67/20/fe67206cf15b569d22493af97a3f4e21.jpg' },
//   { id: '7', title: 'Some Song', artist: 'Artist 7', image: 'https://i.pinimg.com/564x/3a/31/36/3a31366dc35a5c92504f44399b9dcdb7.jpg' },
//   { id: '8', title: 'Cool Song', artist: 'Artist 8', image: 'https://i.pinimg.com/564x/0e/51/0c/0e510c3bd1033a459035b65963aa440d.jpg' },
//   { id: '1', title: 'Let Me Know', artist: 'L.A.X, taves & Ayo Maff', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '2', title: 'Close To Me', artist: 'Niphkeys & Zinoleesky', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '3', title: 'Controller (Remix)', artist: 'Onesimus & Joeboy', image: 'https://i.pinimg.com/736x/e9/53/e7/e953e7e1460a46b9507c3a4f9d9a0d07.jpg' },
//   { id: '4', title: 'Shout', artist: 'Boy Spyce', image: 'https://i.pinimg.com/564x/5b/d0/1d/5bd01db5bf093de72d108fcc00a05c34.jpg' },
//   { id: '5', title: 'Another Song', artist: 'Artist 5', image: 'https://i.pinimg.com/564x/fe/aa/04/feaa044c8df41f85512825b7c0ab6e80.jpg' },
//   { id: '6', title: 'Next Song', artist: 'Artist 6', image: 'https://i.pinimg.com/564x/fe/67/20/fe67206cf15b569d22493af97a3f4e21.jpg' },
// ];

const SONGS_PER_ROW = 7;

const groupSongsIntoSections = (data, itemsPerSection) => {
  const sections = [];
  for (let i = 0; i < data.length; i += itemsPerSection) {
    sections.push(data.slice(i, i + itemsPerSection));
  }
  return sections;
};

const SongCard = ({ song, index }) => {
  return (
    <View style={styles.songCard}>
      <View style={styles.songCardLeft}>
        <Text style={styles.indexText}>{index + 1}</Text>
        <Image
          source={{ uri: song.image }}
          style={styles.thumbnail}
        />
      </View>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{song.artist}</Text>
      </View>

      <MoreHorizontalIcon
        size={24}
        color='#FFA776'
        variant='solid'
      />
    </View>
  );
};

const SongSection = ({ songs, startIndex }) => {
  return (
    <View style={styles.section}>
      {songs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          index={startIndex + index}
        />
      ))}
    </View>
  );
};

const LatestSongs = ({ songs = [], loading = false, error = null }) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FFA776" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load songs</Text>
      </View>
    );
  }

  const groupedSongs = groupSongsIntoSections(songs.slice(0, 30), SONGS_PER_ROW);

  return (
    <FlatList
      data={groupedSongs}
      horizontal
      renderItem={({ item, index }) => (
        <SongSection
          songs={item}
          startIndex={index * SONGS_PER_ROW}
        />
      )}
      keyExtractor={(_, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};


const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  section: {
    width: 320, // Fixed width for each vertical section
    marginRight: 24,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  songCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistName: {
    color: '#FFC5A4',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFA776',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsText: {
    color: '#FFA776',
    fontSize: 10,
    marginTop: 2,
  }
});

export default LatestSongs;
