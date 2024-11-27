import React from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { MotiView } from 'moti'; // Import Moti for skeleton loading

type Props = {
  songs: any;
  isLoading: boolean;
};

const Hottest: React.FC<Props> = ({ songs, isLoading }) => {

    const renderItem = ({ item, index }: { item: any; index: number }) => {
       console.log("item", item)
        return (
          <View style={styles.itemContainer}>
            <View style={styles.imageContainer}>

              <Pressable >
             <Image
               source={{ uri: item?.release?.artwork?.high }}
               style={styles.image}
                blurRadius={1.5}
             />

              <View style={styles.overlay} />
              </Pressable>
              <Text style={styles.number}>#{index + 1}</Text>
            </View>
            <View>
            <Text numberOfLines={1} className='text-[#f4f4f4] text-[16px] font-PlusJakartaSansBold'>{item?.title}</Text>
            <Text className='text-[12px] font-PlusJakartaSansBold text-[#A5A6AA]'>{item?.analytics?.totalStreams.toLocaleString()}</Text>
            </View>
          </View>
        );
      };

  const renderSkeleton = () => (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 1000 }}
      style={styles.skeletonItem}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hottest Releases</Text>
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
    gap: 12,
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
  number: {
    position: 'absolute',
    top: 8,
    left: 8,
    color: 'white',
    fontSize: 18,
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
