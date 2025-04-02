import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useContext, useLayoutEffect } from 'react';
import { router, useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import { Avatar } from 'react-native-elements';

const index = () => {
    const naviagtion = useNavigation()
    const { userdata } = useAppSelector((state) => state.auth)

    useLayoutEffect(() => {
        naviagtion.setOptions({
           headerLeft: () => <Text className='text-[#f4f4f4] text-[24px] font-PlusJakartaSansMedium'>Tribes</Text>,
           headerRight: () =>  <Avatar
           source={{
             uri:
               userdata?.profileImage
                 ? userdata?.profileImage
                 : "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
           }}
           size={40}
           rounded
           onPress={() => router.push("/(profile)") }
           avatarStyle={{
             borderWidth: 2,
             borderColor: "#f4f4f4",
           }}
         />,
         title: ""
        })
    })
  return (
    <View style={{ flex: 1, minHeight: '100%' }}>

    </View>
  );
};

export default index;
