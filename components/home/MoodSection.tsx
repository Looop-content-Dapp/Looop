import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const moods = [
    {
        id: 1,
        name: 'Chill',
        iconFamily: Ionicons,
        iconName: 'sunny-outline',
        color: '#1DF4F4',
        bgColor: '#1DF4F4',
    },
    {
        id: 2,
        name: 'Party',
        iconFamily: MaterialCommunityIcons,
        iconName: 'party-popper',
        color: '#FFF01A',
        bgColor: '#FFF01A',
    },
    {
        id: 3,
        name: 'Workout',
        iconFamily: MaterialIcons,
        iconName: 'sports-gymnastics',
        color: '#A3DA3F',
        bgColor: '#A3DA3F',
    },
    {
        id: 4,
        name: 'Relax',
        iconFamily: MaterialCommunityIcons,
        iconName: 'heart-multiple',
        color: '#FF6F61',
        bgColor: '#FF6F61',
    },
    {
        id: 5,
        name: 'Focus',
        iconFamily: Ionicons,
        iconName: 'bulb-outline',
        color: '#0072F5',
        bgColor: '#0072F5',
    },
    {
        id: 6,
        name: 'Sleep',
        iconFamily: Ionicons,
        iconName: 'moon-outline',
        color: '#5A00A1',
        bgColor: '#5A00A1',
    },
    {
        id: 7,
        name: 'Relax',
        iconFamily: MaterialCommunityIcons,
        iconName: 'meditation',
        color: '#005F73',
        bgColor: '#005F73',
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
                <IconComponent name={mood.iconName} size={32} color={"#fff"} />
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
