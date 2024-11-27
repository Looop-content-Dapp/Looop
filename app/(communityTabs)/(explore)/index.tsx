import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Pressable, Keyboard, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft02Icon, MoreHorizontalIcon, MusicNote03Icon, Search01Icon } from '@hugeicons/react-native';
import CommunityNearYou from '../../../components/CommunityNearYou';
import ArtistYouFollow from '../../../components/ArtistYouFollow';
import SearchResult from '../../../components/SearchResult';
import DraggableButton from '../../../components/Draggable/DraggableButton';

const Feed = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
      setIsSearching(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);


  return (
    <View className="flex-1">
         <ScrollView
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ paddingBottom: 64,}}
       >
         <ArtistYouFollow />
         <View className="gap-y-[24px]">
           <Text className="text-[24px] font-PlusJakartaSansMedium text-Orange/08 font-medium pl-[24px]">
             Explore The World
           </Text>
           <CommunityNearYou />
         </View>
       </ScrollView>
    </View>
  );
};

export default Feed;
