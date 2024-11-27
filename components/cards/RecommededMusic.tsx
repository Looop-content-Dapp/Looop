import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const CARD_GAP = 16; // Increased gap between cards

const RecommededMusic = ({ data, isLoading, title = "Recommended For You" }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Utility function to truncate text
  const truncateText = (text: string, limit: number) => {
    return text?.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  const renderExplicitBadge = () => (
    <View style={styles.explicitBadges}>
      <Text style={styles.explicitText}>E</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.cardsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          decelerationRate="fast"
        >
          {data.map((item, index) => (
            <View key={index} style={styles.cardWrapper}>
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
              >
                {/* Album/Track Artwork */}
                <Image
                  source={{ uri: item.release.artwork.high || item.cover }}
                  style={styles.artwork}
                  resizeMode="cover"
                />

                {/* Title and Artist Info */}
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text
                      numberOfLines={1}
                      style={styles.title}
                    >
                      {truncateText(item.title, 10)}
                    </Text>
                    {item.isExplicit && renderExplicitBadge()}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={styles.artist}
                  >
                    {item.artist?.name || item.artist}
                  </Text>
                </View>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16, // Padding on both sides
    gap: CARD_GAP, // This creates space between cards
  },
  cardWrapper: {
    marginRight: CARD_GAP, // Explicit gap between cards
  },
  card: {
    width: CARD_WIDTH,
  },
  artwork: {
    width: CARD_WIDTH,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  textContainer: {
    marginTop: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  artist: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  explicitBadges: {
    backgroundColor: '#999',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  explicitText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default RecommededMusic;
