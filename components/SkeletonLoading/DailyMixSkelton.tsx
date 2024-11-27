import React from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.70;
const CARD_HEIGHT = 350;

const DailyMixSkeleton = ({ count = 3 }) => {
  // Animation value for shimmer effect
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    // Create shimmer animation
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
        <View style={styles.contentContainer}>
          <View style={styles.titleSkeleton} />
          <View style={styles.descriptionSkeleton} />
          <View style={styles.footerSkeleton} />
        </View>
      </LinearGradient>
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
    marginBottom: 20,
  },
  titleContainerSkeleton: {
    // width: 200,
    // height: 32,
    // backgroundColor: '#2a2a2a',
    // borderRadius: 8,
    // marginBottom: 20,
    // marginHorizontal: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
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
    padding: 20,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  titleSkeleton: {
    width: '80%',
    height: 24,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginBottom: 8,
  },
  descriptionSkeleton: {
    width: '60%',
    height: 14,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    marginBottom: 16,
  },
  footerSkeleton: {
    width: '40%',
    height: 14,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
  },
});

export default DailyMixSkeleton;
