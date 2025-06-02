import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useArtistMusic } from '@/hooks/useArtistMusic';

// Add the missing components
const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const SectionFooter = () => (
  <TouchableOpacity style={styles.sectionFooter}>
    <Text style={styles.seeAllButton}>See all</Text>
  </TouchableOpacity>
);

const PlaylistCard = ({ title, coverImage, totalTracks, followerCount, totalStreams }) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <Image source={{ uri: coverImage }} style={styles.coverImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View>
          <Text style={styles.infoText}>Songs on playlist: <Text style={styles.infoHighlight}>{totalTracks}</Text></Text>
          <Text style={styles.infoText}>Listeners: <Text style={styles.infoHighlight}>{followerCount.toLocaleString()}</Text></Text>
          <Text style={styles.infoText}>Total streams: <Text style={styles.infoHighlight}>{totalStreams?.toLocaleString()}</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Image
      source={require('@/assets/images/ghost.png')}
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>No playlists yet</Text>
    <Text style={styles.emptyText}>Apply for your music to be added to Editorial Playlist, or when music is added to playlist you will see them here.</Text>
  </View>
);

const Playlists = () => {
  const { data, isLoading } = useArtistMusic();

  const sections = useMemo(() => {
    if (!data?.data.playlists.items) return [];
    return [
      {
        title: "All Playlists",
        data: data.data.playlists.items
      }
    ];
  }, [data]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A187B5" />
      </View>
    );
  }

  if (!data?.data.playlists.items?.length) {
    return <EmptyState />;
  }

  const renderItem = ({ item, index, section }) => {
    if (index === 0) {
      return (
        <>
          <SectionHeader title={section.title} />
          <PlaylistCard {...item} />
        </>
      );
    }
    if (index === section.data.length - 1) {
      return (
        <>
          <PlaylistCard {...item} />
          <SectionFooter />
        </>
      );
    }
    return <PlaylistCard {...item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections.flatMap(section =>
          section.data.map((item, index) => ({
            ...item,
            sectionTitle: section.title,
            isFirstInSection: index === 0,
            isLastInSection: index === section.data.length - 1
          }))
        )}
        renderItem={({ item }) => renderItem({
          item,
          index: item.isFirstInSection ? 0 : (item.isLastInSection ? item.sectionTitle.data?.length - 1 : 1),
          section: { title: item.sectionTitle, data: sections.find(s => s.title === item.sectionTitle).data }
        })}
        keyExtractor={(item, index) => `${item.sectionTitle}-${index}`}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coverImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 24,
  },
  title: {
    color: '#f4f4f4',
    fontSize: 20,
    fontFamily: 'PlusJakartaSansMedium',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSansRegular',
    color: '#787A80',
  },
  infoHighlight: {
    color: '#F4F4F4',
    fontFamily: 'PlusJakartaSansBold',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#f4f4f4',
    fontSize: 20,
    fontFamily: 'PlusJakartaSansMedium',
  },
  sectionFooter: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  seeAllButton: {
    color: 'gray',
    fontFamily: 'PlusJakartaSansRegular',
  },
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

export default Playlists;
