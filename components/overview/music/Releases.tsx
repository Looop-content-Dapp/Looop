import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native'
import React from 'react'
import ReleaseCard from '../../cards/ArtistReleaseCard';
import { useArtistMusic } from '@/hooks/useArtistMusic';

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Image
      source={require('@/assets/images/ghost.png')}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>No releases yet</Text>
    <Text style={styles.emptyText}>Upload your first release to start exploring</Text>
  </View>
);

const Releases = () => {
  const { data, isLoading } = useArtistMusic();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A187B5" />
      </View>
    );
  }

  if (!data?.data.releases.items?.length) {
    return <EmptyState />;
  }

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data?.data.releases.items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ReleaseCard
            id={item._id}
            title={item.title}
            type={item.type}
            date={new Date(item.releaseDate).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
            coverImage={item.artwork}
            streams={0}
            tracks={[]}
          />
        )}
        contentContainerStyle={{rowGap: 32}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Releases;
