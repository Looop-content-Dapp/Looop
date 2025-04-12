import React from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SkeletonLoader } from '../shared/SkeletonLoader';

type Props = {
  songs: any;
  isLoading: boolean
};

const Singles: React.FC<Props> = ({ songs, isLoading }) => {
  const router = useRouter()

  const renderItem = ({ item }: { item: any }) => {
    console.log("single item: ", item)
    return (
        <Pressable
        onPress={() => router.push({ pathname: "/(musicTabs)/_screens/musicDetails",  params: {
            id: item?._id,
            title: item?.title,
            artist: item?.artist?.name,
            image: item?.artwork.high,
          }})} className="w-[150px] h-[250px] mx-2 my-[24px]">
          <Image source={{ uri: item?.artwork.high }} className="w-full h-[199px] rounded-[24px]" />
          <Text className="mt-2 text-[16px] font-PlusJakartaSansBold text-[#f4f4f4f4]">{item?.title}</Text>
          <Text className="text-[12px] text-[#A5A6AA]">{item.releaseDate.slice(0, 4)}</Text>
        </Pressable>
    )
  }

  const renderSkeleton = () => (
    <View style={styles.singleContainer}>
      <SkeletonLoader width={150} height={199} />
      <View style={styles.skeletonTextContainer}>
        <SkeletonLoader width={130} height={16} borderRadius={4} />
        <SkeletonLoader width={70} height={12} borderRadius={4} />
      </View>
    </View>
  );

  // Update styles
  const styles = StyleSheet.create({
    singleContainer: {
      width: 150,
      height: 250,
      marginHorizontal: 8,
      marginVertical: 24,
    },
    skeletonTextContainer: {
      gap: 8,
      marginTop: 12,
    },
    skeletonItem: {
        width: 199,
        height: 250,
        backgroundColor: '#ccc',
        borderRadius: 24,
        marginHorizontal: 8,
      },
  })

  return (
    <View className='gap-y-[16px] pl-[14px]'>

    {isLoading ? (
        <FlatList
          data={[1, 2, 3]} // Placeholder array to render skeletons
          horizontal
          renderItem={renderSkeleton}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={songs}
          horizontal
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
        />
      )}
     {/* <Text className="text-[20px] font-PlusJakartaSansBold text-Grey/04 my-2 ml-2">Singles</Text>
      <FlatList
        data={songs}
        horizontal
        keyExtractor={(item) => item?.title}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        className="px-2"
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
    skeletonItem: {
        width: 199,
        height: 250,
        backgroundColor: '#ccc',
        borderRadius: 24,
        marginHorizontal: 8,
      },
})

export default Singles;
