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

const CommunityCard = ({ artist, onFollow, isFollowing }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: artist.imageUrl }}
      style={styles.artistImage}
    />
    <Text style={styles.artistName}>{artist.name}</Text>
    <View style={styles.statsContainer}>
      <Text style={styles.statsText}>{artist.followers} followers</Text>
      <Text style={styles.dotSeparator}>•</Text>
      <Text style={styles.statsText}>{artist.tribestars}M Tribestars</Text>
    </View>
    <TouchableOpacity
      style={[
        styles.followButton,
        isFollowing && styles.followingButton
      ]}
      onPress={() => onFollow(artist.id)}
    >
      <Text style={styles.followButtonText}>
        {isFollowing ? 'Following' : 'Follow'}
      </Text>
    </TouchableOpacity>
  </View>
);

const CommunitySection = ({ section, onFollow, followingArtists }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{section.title}</Text>
    <FlatList
      horizontal
      data={section.data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <CommunityCard
          artist={item}
          onFollow={onFollow}
          isFollowing={followingArtists.includes(item.id)}
        />
      )}
      contentContainerStyle={styles.artistList}
    />
  </View>
);

const CommunitySectionList = ({ sections, onFollow, followingArtists }) => (
  <SectionList
    sections={sections}
    keyExtractor={(item) => item.id}
    renderSectionHeader={({ section }) => (
      <CommunitySection
        section={section}
        onFollow={onFollow}
        followingArtists={followingArtists}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsText: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  dotSeparator: {
    color: '#A0A0A0',
    marginHorizontal: 6,
  },
  followButton: {
    backgroundColor: '#8E44AD',
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

export default CommunitySectionList;
