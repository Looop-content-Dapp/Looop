import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { Search01Icon } from '@hugeicons/react-native';
import CommunityNearYou from '../../../components/CommunityNearYou';
import ArtistYouFollow from '../../../components/ArtistYouFollow';

const Feed = () => {
    const navigation = useNavigation();

    const handleSearchPress = () => {
        router.push('/(communityTabs)/(explore)/search');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "",
            headerLeft: () => (
                <View className="flex-row items-center gap-x-[16px] pr-[24px]">
                    <Text className="text-[#f4f4f4] font-PlusJakartaSansBold text-[20px]">
                        Discover Tribes
                    </Text>
                </View>
            ),
            headerRight: () => (
                <Pressable
                    onPress={handleSearchPress}
                    className="flex-row items-center gap-x-[16px] pr-[24px]"
                >
                    <Search01Icon size={32} color='#63656B' variant='solid' />
                </Pressable>
            ),
        });
    }, []);


  return (
    <View className="flex-1 pl-[16px]">
         <ScrollView
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ paddingBottom: 64,}}
       >
         <ArtistYouFollow />
         <View className="gap-y-[24px]">
           <CommunityNearYou />
         </View>
       </ScrollView>
    </View>
  );
};

export default Feed;
