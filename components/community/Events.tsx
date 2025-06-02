import { View, Text } from 'react-native';
import React from 'react';

const Events = () => {
  return (
    <View className="flex-1 justify-center items-center p-4 mt-[40%]">
      <View className="bg-[#12141B] p-4 rounded-lg">
        <Text className="text-white text-lg font-bold text-center">Coming Soon!</Text>
        <Text className="text-white/60 text-sm text-center mt-2">
          Event features are currently under development. Stay tuned for exciting community events!
        </Text>
      </View>
    </View>
  );
};

export default Events;
