import React from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

interface Song {
  _id: string;
  metadata: {
    totalTracks: number;
    genre: string[];
    label: string;
  };
  analytics: {
    totalStreams: number;
    saves: number;
    shares: number;
    popularityScore: number;
  };
  artist: {
    _id: string;
    name: string;
    image: string;
  };
  title: string;
  type: string;
  artwork: {
    high: string;
    medium: string;
    low: string;
    thumbnail: string;
  };
  releaseDate: string;
}

type Props = {
  songs: Song[];
  isLoading: boolean;
};

const AlbumsAndEps: React.FC<Props> = ({ songs, isLoading }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: Song }) => {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/musicDetails',
            params: {
              id: item._id,
              title: item.title,
              image: item.artwork.high,
              artist: item.artist.name
            },
          })
        }
        style={styles.albumContainer}
      >
        <Image
          source={{ uri: item.artwork.high }}
          style={styles.albumImage}
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        <Text numberOfLines={1} style={styles.albumTitle}>
          {item.title}
        </Text>
        <Text style={styles.songCount}>
          {new Date(item.releaseDate).getFullYear()} • {item.metadata.totalTracks} Songs
        </Text>
      </Pressable>
    );
  };

  const renderSkeleton = () => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 1000 }}
      style={styles.skeletonItem}
    />
  );

  // Filter out duplicate albums based on title
  // Modify the uniqueSongs calculation to handle undefined/null
  const uniqueSongs = songs?.reduce((acc: Song[], current) => {
    const x = acc.find(item => item.title === current.title);
    if (!x) {
      return acc.concat([current]);
    }
    return acc;
  }, []) || [];
  return (
    <View style={styles.container}>
      {uniqueSongs.length > 0 && (
        <Text style={styles.header}>Albums & EPs</Text>
      )}

      {isLoading ? (
        <FlatList
          data={[1, 2, 3]}
          horizontal
          renderItem={renderSkeleton}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <FlatList
        data={uniqueSongs}
        horizontal
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item._id}
        // style={{ height: 250 }} // Matches albumContainer height
      />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingLeft: 14,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 8,
    color: '#fff',
  },
  albumContainer: {
    marginHorizontal: 8,
    width: 199,
    height: 250,
  },
  albumImage: {
    width: '100%',
    height: 199,
    borderRadius: 24,
    backgroundColor: '#2a2a2a', // Add background color for image loading
  },
  albumTitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#f4f4f4',
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 12,
    color: 'gray',
  },
  skeletonItem: {
    width: 199,
    height: 250,
    backgroundColor: '#ccc',
    borderRadius: 24,
    marginHorizontal: 8,
  },
});

export default AlbumsAndEps;
