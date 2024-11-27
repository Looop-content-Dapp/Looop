// Feed.tsx

import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext } from 'react';
import { MusicNote03Icon } from '@hugeicons/react-native';
import { AppStateContext } from '../../../providers/AppContext';
import { feed } from '../../../utils';
import PostCard from '../../../components/cards/PostCard';
import { router } from 'expo-router';
import Header from '../../../components/Header';
import DraggableButton from '../../../components/Draggable/DraggableButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const Feed = () => {
  return (
    <View style={{ flex: 1, minHeight: '100%', marginTop: 32 }}>
      <FlatList
        data={feed}
        renderItem={({ item }) => <PostCard item={item} />}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => {
            return (
                <View className='h-1 bg-Grey/07 flex-1'/>
            )
        }}
        contentContainerStyle={{
            rowGap: 20,
            marginHorizontal: 4,
            alignContent: "center",
            justifyContent: "center",
            paddingBottom: 32
        }}
      />
    </View>
  );
};

export default Feed;
