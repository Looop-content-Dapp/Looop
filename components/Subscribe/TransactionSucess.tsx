import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { CheckmarkBadge01Icon } from '@hugeicons/react-native';

interface TransactionSuccessProps {
    communityName: string;
    onClose: () => void;
    tribePass: {
      collectibleImage: string;
      collectibleName: string;
    };
  }

  const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
    communityName,
    onClose,
    tribePass
  }) => {
  // Animation values
  const checkmarkScale = new Animated.Value(0);
  const contentOpacity = new Animated.Value(0);
  const cardScale = new Animated.Value(0.9);

  useEffect(() => {
    // Start animations immediately when component mounts
    Animated.sequence([
      Animated.spring(checkmarkScale, {
        toValue: 1,
        damping: 15,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        damping: 12,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (!tribePass?.collectibleImage || !tribePass?.collectibleName) {
    console.warn('Missing tribePass data:', tribePass);
    return null;
  }
  

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: checkmarkScale }] }]}>
        <View style={styles.checkmarkBadge}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </Animated.View>

      {/* Success Text */}
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>Tribe pass minted</Text>
        <Text style={styles.successText}>Successfully</Text>
      </View>

      {/* Stacked Cards */}
      <Animated.View
        style={[
          styles.cardsContainer,
          {
            opacity: contentOpacity,
            transform: [{ scale: cardScale }]
          }
        ]}
      >
    {/* Background Card */}
    <View style={[styles.card, styles.backgroundCard]}>
            <Image
              source={{ uri: tribePass?.collectibleImage}}
              style={styles.passImage}
              resizeMode="cover"
            />
            <View style={styles.cardOverlay}>
              <Text style={styles.passName}>{tribePass.collectibleName}</Text>
            </View>
          </View>

        {/* Front Card */}
        <View style={[styles.card, styles.frontCard]}>
        <Image
          source={{ uri: tribePass.collectibleImage }}
          style={styles.passImage}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay}>
          <Text style={styles.passName}>{tribePass.collectibleName}</Text>
        </View>
      </View>
      </Animated.View>


      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={onClose}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmarkBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#45F42E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 28,
    color: '#D2D3D5',
    fontFamily: 'PlusJakartaSansRegular',
    marginBottom: 4,
  },
  successText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSansBold',
  },
  cardsContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '95%',
    aspectRatio: 0.75,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'absolute',
    backgroundColor:"#12141B",
    padding: 8,

  },
  backgroundCard: {
    transform: [
      { translateX: -40 },
      { rotate: '8deg' },
      { scale: 0.95 }
    ],
    opacity: 0.7,
    left: '25%',
  },
  frontCard: {
    transform: [
      { rotate: '-5deg' }
    ],
    zIndex: 1,
  },
  passImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  passName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'PlusJakartaSansBold',
  },
  continueButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#A187B5',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 34,
  },
  continueText: {
    color: '#12141B',
    fontSize: 16,
    fontFamily: 'PlusJakartaSansSemiBold',
  },
});

export default TransactionSuccess;
