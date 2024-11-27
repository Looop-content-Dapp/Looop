import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView
} from 'react-native';

const PlaylistCard = ({ title, coverUrl, songsCount, listeners, totalStreams }) => {
  return (
    <TouchableOpacity style={styles.cardContainer}>
      <Image source={{ uri: coverUrl }} style={styles.coverImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <View>
          <Text style={styles.infoText}>Songs on playlist: <Text style={styles.infoHighlight}>{songsCount}</Text></Text>
          <Text style={styles.infoText}>Listeners: <Text style={styles.infoHighlight}>{listeners.toLocaleString()}</Text></Text>
          <Text style={styles.infoText}>Total streams: <Text style={styles.infoHighlight}>{totalStreams.toLocaleString()}</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const SectionFooter = () => (
  <TouchableOpacity style={styles.sectionFooter}>
    <Text style={styles.seeAllButton}>See all</Text>
  </TouchableOpacity>
);

const Playlists = () => {
  const sections = [
    {
      title: "Algorithmic",
      data: [
        {
          title: "Can't Get Enough",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 2,
          listeners: 21437382,
          totalStreams: 811272860
        },
        {
          title: "The Off Radar",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 2,
          listeners: 21437382,
          totalStreams: 811272860
        },
        {
          title: "HipHop Essentials",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 2,
          listeners: 21437382,
          totalStreams: 811272860
        }
      ]
    },
    {
      title: "Listener playlists",
      data: [
        {
          title: "Top Hits 2023",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 3,
          listeners: 18765432,
          totalStreams: 723456789
        },
        {
          title: "Chill Vibes",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 4,
          listeners: 15678901,
          totalStreams: 567890123
        },
        {
          title: "Workout Mix",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 5,
          listeners: 12345678,
          totalStreams: 456789012
        }
      ]
    },
    {
      title: "Looop editorials",
      data: [
        {
          title: "New Releases",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 6,
          listeners: 9876543,
          totalStreams: 345678901
        },
        {
          title: "Throwback Thursdays",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 7,
          listeners: 7654321,
          totalStreams: 234567890
        },
        {
          title: "Indie Discoveries",
          coverUrl: "https://i.pinimg.com/736x/00/8f/2a/008f2ab2e4af832c63df61ddaa558016.jpg",
          songsCount: 8,
          listeners: 5432109,
          totalStreams: 123456789
        }
      ]
    }
  ];

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
});

export default Playlists;
