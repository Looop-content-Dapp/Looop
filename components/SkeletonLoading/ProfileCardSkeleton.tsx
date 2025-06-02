import React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CARD_WIDTH = 140;
const CARD_HEIGHT = 140;

const ProfileCardSkeleton = ({ count = 5 }) => {
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
    <View style={styles.cardContainer}>
      <View style={styles.imageContainer}>
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
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.nameSkeleton} />
        <View style={styles.followersSkeleton} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
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
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 24,
  },
  cardContainer: {
    alignItems: 'center',
    gap: 8,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: CARD_WIDTH / 2,
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
  contentContainer: {
    alignItems: 'center',
    gap: 4,
  },
  nameSkeleton: {
    width: 120,
    height: 20,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
  },
  followersSkeleton: {
    width: 80,
    height: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginTop: 4,
  },
});

export default ProfileCardSkeleton;
