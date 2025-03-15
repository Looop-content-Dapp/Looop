import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const CARD_GAP = 16; // Increased gap between cards

const RecommededMusic = ({ data, isLoading, title = "Recommended For You" }) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text className="text-[#F4F4F4] text-[20px] leading-[22px] tracking-[-0.69px] font-PlusJakartaSansBold px-4 mb-4">{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Utility function to truncate text
  const truncateText = (text: string, limit: number) => {
    return text?.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  // Helper function to get the image URL from different possible structures
  const getImageUrl = (item: any) => {
    if (item.release?.artwork?.cover_image?.high) {
      return item.release.artwork.cover_image.high;
    } else if (item.release?.artwork?.high) {
      return item.release.artwork.high;
    } else if (item.cover) {
      return item.cover;
    } else if (item.artist?.profileImage) {
      return item.artist.profileImage;
    }
    return 'https://via.placeholder.com/300'; // Fallback image
  };

  const renderExplicitBadge = () => (
    <View style={styles.explicitBadges}>
      <Text style={styles.explicitText}>E</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text className="text-[#F4F4F4] text-[20px] leading-[22px] tracking-[-0.69px] font-PlusJakartaSansBold px-4 mb-4">{title}</Text>
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
                onPress={() => {
                  router.push({
                    pathname: `/track/${item._id}`,
                    params: {
                      id: item._id,
                      title: item.title,
                      artist: typeof item.artist === 'string' ? item.artist : item.artist?.name,
                      artwork: getImageUrl(item),
                    }
                  });
                }}
              >
                {/* Album/Track Artwork */}
                <Image
                  source={{ uri: getImageUrl(item) }}
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
                      {truncateText(item.title, 15)}
                    </Text>
                    {item.isExplicit && renderExplicitBadge()}
                  </View>
                  <View style={styles.artistRow}>
                    <Text
                      numberOfLines={1}
                      style={styles.artist}
                    >
                      {typeof item.artist === 'string' ? item.artist : item.artist?.name}
                    </Text>
                    {item.release?.type && (
                      <Text style={styles.typeLabel}>
                        {item.release.type}
                      </Text>
                    )}
                  </View>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    gap: CARD_GAP,
  },
  cardWrapper: {
    marginRight: CARD_GAP,
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
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  artist: {
    fontSize: 14,
    color: '#999',
  },
  typeLabel: {
    fontSize: 14,
    color: '#999',
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'capitalize',
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
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecommededMusic;
