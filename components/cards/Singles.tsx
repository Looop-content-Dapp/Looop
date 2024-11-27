import React from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { Songs, Album, EP } from '../../utils/types';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

type Props = {
  songs: any;
  isLoading: boolean
};

const Singles: React.FC<Props> = ({ songs, isLoading }) => {
  const router = useRouter()

  const renderItem = ({ item }: { item: any }) => {
    console.log("singles", item)
    return (
        <Pressable
        onPress={() => router.push({ pathname: "/musicDetails",  params: {
            id: item?.id,
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
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ loop: true, type: 'timing', duration: 1000 }}
      style={styles.skeletonItem}
    />
  );

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
