import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { HeadphonesIcon, UserGroupIcon } from '@hugeicons/react-native';

interface EarningsProps {
  timeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const Earnings: React.FC<EarningsProps> = ({ timeFrame, onTimeFrameChange }) => {
  const earningsData = [
    {
      title: 'Music streams',
      amount: '$11,382.38',
      icon: <HeadphonesIcon size={24} color="#FFFFFF" />,
      bgColor: '#FF7A00'
    },
    {
      title: 'Tribe subscriptions',
      amount: '$11,382.38',
      icon: <UserGroupIcon size={24} color="#FFFFFF" />,
      bgColor: '#8E44AD'
    }
  ];

  return (
    <View className="px-4 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-xl font-PlusJakartaSansBold">Earnings</Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-[#787A80] mr-2">{timeFrame}</Text>
          <Text className="text-[#787A80]">▼</Text>
        </TouchableOpacity>
      </View>

      {earningsData.map((item, index) => (
        <View key={index} className="bg-[#0A0B0F] rounded-xl p-4 mb-3 flex-row items-center">
          <View className={`w-12 h-12 rounded-xl mr-4 items-center justify-center`} style={{ backgroundColor: item.bgColor }}>
            {item.icon}
          </View>
          <View className="flex-1">
            <Text className="text-[#787A80] text-sm font-PlusJakartaSansMedium">{item.title}</Text>
            <Text className="text-white text-lg font-PlusJakartaSansBold">{item.amount}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default Earnings;
