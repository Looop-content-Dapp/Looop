import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { user } from '../utils/ArstsisArr';
import { Avatar } from 'react-native-elements';
import { router } from 'expo-router';
import { Notification02Icon } from '@hugeicons/react-native';

type Props = {
    title: string
}

const Header = ({title}: Props) => {
  return (
    <View className="flex-1" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, height: 74, paddingRight: 24}}>
    <Text style={{ fontSize: 20, color: '#f4f4f4', fontFamily: 'PlusJakartaSansBold' }}>
    {title}
    </Text>
    <View className="flex-row items-center gap-x-[20px]">
      <TouchableOpacity onPress={() => router.navigate("/notification")}>
      <Notification02Icon size={24} color="#787A80" variant="stroke" />
      </TouchableOpacity>

    <Avatar
      source={{ uri: "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg" }}
      size={40}
      rounded
      onPress={() => router.push("/(profile)")}
    />
    </View>

  </View>
  );
};

export default Header;
