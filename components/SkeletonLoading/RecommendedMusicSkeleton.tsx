import React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.32;
const CARD_GAP = 12;

const RecommendedMusicSkeleton = ({ count = 5 }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  const SkeletonCard = () => (
    <View style={styles.cardWrapper}>
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={['#2a2a2a', '#3a3a3a']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </LinearGradient>
        <View style={styles.textContainer}>
          <View style={styles.titleSkeleton} />
          <View style={styles.artistSkeleton} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainerSkeleton} />
      <View style={styles.cardsContainer}>
        {[...Array(count)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 16,
  },
  titleContainerSkeleton: {
    width: 200,
    height: 24,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
  },
  cardContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  gradient: {
    flex: 1,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  textContainer: {
    marginTop: 8,
  },
  titleSkeleton: {
    width: '80%',
    height: 13,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginBottom: 4,
  },
  artistSkeleton: {
    width: '60%',
    height: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
  },
});

export default RecommendedMusicSkeleton;
