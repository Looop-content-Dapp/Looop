import React, { useState } from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti'; // Import Moti for skeleton loading
import { PlayIcon, PauseIcon } from '@hugeicons/react-native'; // Import PlayIcon icon from huge-icons
import { SkeletonLoader } from '../shared/SkeletonLoader';

type Props = {
  songs: any;
  isLoading: boolean;
};

const Hottest: React.FC<Props> = ({ songs, isLoading }) => {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    const handlePress = (item: any, index: number) => {
      if (playingIndex === index) {
        setPlayingIndex(null); // Pause if already playing
      } else {
        setPlayingIndex(index); // Play the selected song
      }
      console.log(playingIndex === index ? 'Pausing:' : 'Playing:', item.title);
    };

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        const isPlaying = playingIndex === index;

        return (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>
              <Pressable onPress={() => handlePress(item, index)}>
                <Image
                  source={{ uri: item?.release?.artwork?.high }}
                  style={styles.image}
                  blurRadius={1.5}
                />
                <View style={styles.overlay} />
                <MotiView
                  style={styles.playIconContainer}
                  animate={{
                    scale: isPlaying ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    loop: isPlaying,
                    type: 'timing',
                    duration: 1000,
                  }}
                >
                  {isPlaying ? (
                    <PauseIcon size={40} color="#FFFFFF" variant='solid' />
                  ) : (
                    <PlayIcon size={40} color="#FFFFFF" variant='solid' />
                  )}
                </MotiView>
              </Pressable>
              <Text className='font-TankerRegular' style={styles.number}>#{index + 1}</Text>
            </View>
            <View>
              <Text numberOfLines={1} className='text-[#f4f4f4] text-[16px] font-PlusJakartaSansBold'>{item?.title}</Text>
              <Text className='text-[12px] font-PlusJakartaSansBold text-[#A5A6AA]'>{item?.analytics?.totalStreams.toLocaleString()}</Text>
            </View>
          </View>
        );
      };

  const renderSkeleton = () => (
    <View style={styles.itemContainer}>
      <SkeletonLoader width={152} height={170} />
      <View style={styles.skeletonTextContainer}>
        <SkeletonLoader width={120} height={16} borderRadius={4} />
        <SkeletonLoader width={80} height={12} borderRadius={4} />
      </View>
    </View>
  );

  // Update styles
  const styles = StyleSheet.create({
    container: {
      gap: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 8,
      marginLeft: 8,
      color: '#fff', // Adjust color as needed
    },
    flatListContent: {
      paddingHorizontal: 8,
    },
    itemContainer: {
      marginHorizontal: 8,
      rowGap: 12,
      width: 152,
      height: 250,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: 170,
      borderRadius: 24,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      borderRadius: 24,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.45)', // Add dark overlay
      borderRadius: 24,
    },
    playIconContainer: {
      position: 'absolute',
      top: '50%',
      left: '40%',
      transform: [{ translateX: -20 }, { translateY: -20 }],
      right: "50%"
    },
    number: {
      position: 'absolute',
      top: 8,
      left: 8,
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
    },
    skeletonItem: {
      width: 152,
      height: 250,
      backgroundColor: '#ccc',
      borderRadius: 24,
      marginHorizontal: 8,
    },
    skeletonTextContainer: {
      gap: 8,
      marginTop: 12,
    },
  });

  return (
    <View style={styles.container}>
        {songs.length > 0 && (
             <Text style={styles.header}>Hottest Releases</Text>
        )}
      {isLoading ? (
        <FlatList
          data={[1, 2, 3]} // Placeholder array to render skeletons
          horizontal
          renderItem={renderSkeleton}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      ) : (
        <FlatList
          data={songs}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft: 8,
    color: '#fff', // Adjust color as needed
  },
  flatListContent: {
    paddingHorizontal: 8,
  },
  itemContainer: {
    marginHorizontal: 8,
    rowGap: 12,
    width: 152,
    height: 250,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 170,
    borderRadius: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Add dark overlay
    borderRadius: 24,
  },
  playIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    right: "50%"
  },
  number: {
    position: 'absolute',
    top: 8,
    left: 8,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  skeletonItem: {
    width: 152,
    height: 250,
    backgroundColor: '#ccc',
    borderRadius: 24,
    marginHorizontal: 8,
  },
});

export default Hottest;
