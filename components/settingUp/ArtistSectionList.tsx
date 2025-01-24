import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SectionList,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const ArtistCard = ({ artist, onFollow, isFollowing }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: artist.profileImage }}
      style={styles.artistImage}
    />
    <Text style={styles.artistName}>{artist.name}</Text>
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>{artist.tribestars} Tribestars</Text>
      <Text style={styles.tribeText}>{artist.tribeName}</Text>
    </View>
    <TouchableOpacity
      style={[
        styles.followButton,
        isFollowing && styles.followingButton
      ]}
      onPress={() => onFollow(artist.id)}
    >
      <Text style={styles.followButtonText}>
        {isFollowing ? 'Following' : 'Join Tribe'}
      </Text>
    </TouchableOpacity>
  </View>
);

const ArtistSection = ({ section, onFollow, followingArtists }) => {
  if (!section?.artists?.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{section.genreName}</Text>
      <FlatList
        horizontal
        data={section.artists}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <ArtistCard
            artist={item}
            onFollow={onFollow}
            isFollowing={followingArtists.includes(item.id)}
          />
        )}
        contentContainerStyle={styles.artistList}
      />
    </View>
  );
};

const ArtistSectionList = ({ sections = [], onFollow, followingArtists = [] }) => (
  <SectionList
    sections={sections}
    keyExtractor={(item, index) => item?.id || index.toString()}
    renderSectionHeader={({ section }) => (
   <>
      {/* <ArtistSection
        section={section}
        onFollow={onFollow}
        followingArtists={followingArtists}
      /> */}
      <Text className='text-[20px] text-[#fff]'>Hello world</Text>
   </>
    )}
    renderItem={() => null}
    stickySectionHeadersEnabled={false}
    showsVerticalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  artistList: {
    paddingHorizontal: 8,
  },
  card: {
    width: width * 0.4,
    marginHorizontal: 8,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  artistName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  tribeText: {
    fontSize: 12,
    color: '#808080',
  },
  followButton: {
    backgroundColor: '#FF6D1B',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#555555',
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ArtistSectionList;
