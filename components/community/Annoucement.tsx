import { View, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { feed } from '../../utils';
import PostCard from '../cards/PostCard';

const Annnoucement = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate the loading of data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate a delay for fetching the data
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false); 
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF6D1B" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={feed}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => (
          <View className="h-1 bg-Grey/07 flex-1" />
        )}
        contentContainerStyle={{
          rowGap: 20,
          marginHorizontal: 4,
          alignContent: 'center',
          justifyContent: 'center',
          marginBottom: 120,
        }}
      />
    </View>
  );
};

export default Annnoucement;
