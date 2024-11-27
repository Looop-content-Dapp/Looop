import React from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

type Props = {
  songs: any;
  isLoading: boolean; // New prop to handle loading state
};

const AlbumsAndEps: React.FC<Props> = ({ songs, isLoading }) => {
    const router = useRouter()
  const renderItem = ({ item }: { item: any }) => {
    console.log("albums and ep", item)
    return (
        <Pressable
        onPress={() =>
          router.push({
            pathname: '/musicDetails',
            params: {
              id: item?._id,
              title: item?.title,
              image: item?.artwork?.high,
              artist: item?.artist
              ?.name
            },
          })
        }
        style={styles.albumContainer}
      >
        <Image source={{ uri: item?.artwork?.high }} style={styles.albumImage} />
        <Text numberOfLines={1} style={styles.albumTitle}>
          {item?.title}
        </Text>
        <Text style={styles.songCount}>{item.releaseDate.slice(0, 4)} • {item.metadata.totalTracks} Songs</Text>
      </Pressable>
    )
  };

  const renderSkeleton = () => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 1000 }}
      style={styles.skeletonItem}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Albums & EPs</Text>
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]} // Placeholder array to render skeletons
          horizontal
          renderItem={renderSkeleton}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={songs}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
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
