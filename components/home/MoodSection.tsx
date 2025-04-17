import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const moods = [
    {
        id: 1,
        name: 'Chill',
        iconFamily: Ionicons,
        iconName: 'sunny-outline',
        color: '#8C5AFF',
        bgColor: '#929DFF',
    },
    {
        id: 2,
        name: 'Party',
        iconFamily: MaterialCommunityIcons,
        iconName: 'party-popper',
        color: '#FF4B6E',
        bgColor: '#FFAE35',
    },
    {
        id: 3,
        name: 'Workout',
        iconFamily: MaterialIcons,
        iconName: 'sports-gymnastics',
        color: '#2DD881',
        bgColor: '#643EFF',
    },
    {
        id: 4,
        name: 'Relax',
        iconFamily: MaterialCommunityIcons,
        iconName: 'heart-multiple',
        color: '#FF8F5B',
        bgColor: '#FF668B',
    },
    {
        id: 5,
        name: 'Focus',
        iconFamily: Ionicons,
        iconName: 'bulb-outline',
        color: '#FF7A1B',
        bgColor: '#FF7A1B',
    },
    {
        id: 6,
        name: 'Sleep',
        iconFamily: Ionicons,
        iconName: 'moon-outline',
        color: '#00C2FF',
        bgColor: '#00C2FF',
    },
    {
        id: 7,
        name: 'Relax',
        iconFamily: MaterialCommunityIcons,
        iconName: 'meditation',
        color: '#FF8F5B',
        bgColor: '#FF8F5B',
    },
];

const MoodSection = () => {
  return (
    <View className="mb-6">
      <Text className="text-white text-[20px] font-PlusJakartaSansBold mb-4">
        Music for every mood
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 6 }}
      >
        {moods.map((mood) => {
          const IconComponent = mood.iconFamily;
          return (
            <View key={mood.id} className="items-center w-[70px] mr-3">
              <Pressable
                style={{
                  backgroundColor: mood.bgColor,
                }}
                className="w-[70px] h-[70px] rounded-[16px] items-center justify-center"
              >
                <IconComponent name={mood.iconName} size={32} color={"#F4F4F4"} />
              </Pressable>
              <Text
                className="text-white font-PlusJakartaSansBold text-center text-[14px] mt-2"
                style={{ color: mood.color }}
              >
                {mood.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MoodSection;
