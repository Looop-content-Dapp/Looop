import { View, Text, TextInput, TouchableOpacity, FlatList, Image, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { AppBackButton } from '@/components/app-components/back-btn';
import { Link05Icon, Search01Icon, UserAdd01Icon } from '@hugeicons/react-native';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '@/context/NotificationContext';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import * as Contacts from 'expo-contacts';
import { useAppSelector } from '@/redux/hooks';
import api from '@/config/apiConfig';

interface User {
  _id: string;
  username: string;
  fullname: string;
  profileImage: string | null;
  bio: string | null;
  email: string;
  role: string;
  referralCode: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

const AddFriends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [tab, setTab] = useState<'all' | 'contacts'>('all');
  const navigation = useNavigation();
  const router = useRouter();
  const { userdata } = useAppSelector((state) => state.auth);

  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/api/user');
      return response.data.data.filter((user: User) => user._id !== userdata?._id);
    },
  });

  // Load contacts
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.Name],
        });
        setContacts(data);
      }
    })();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.emails?.[0]?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send friend request
  const { showNotification } = useNotification();
  const handleAddFriend = async (friendId: string) => {
    try {
      await api.post(`/api/user/friend/${userdata?._id}/${friendId}`);
      showNotification({
        type: 'success',
        title: 'Friend Request Sent',
        message: 'Your friend request has been sent successfully!'
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      showNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to send friend request. Please try again.'
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <AppBackButton name="Add Friends" onBackPress={() => router.back()} />
      ),
    });
  }, [navigation]);

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/(profile)/userProfileView',
        params: { userId: item._id }
      })}
      className="flex-row items-center justify-between p-4 border-b border-[#2A2B32]">
      <View className="flex-row items-center gap-x-3">
        <Image
          source={{ uri: item.profileImage || 'https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg' }}
          className="w-12 h-12 rounded-full"
        />
        <View>
          <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">{item.fullname || item.username}</Text>
          <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">{item.email.slice(0, 12)}...{item.email.slice(15, 20)}</Text>
          <View className="flex-row items-center gap-x-2 mt-1">
            {item.isPremium && (
              <View className="bg-[#FF6D1B] px-2 py-0.5 rounded">
                <Text className="text-[12px] text-[#f4f4f4] font-PlusJakartaSansMedium">Premium</Text>
              </View>
            )}
            <Text className="text-[12px] text-[#787A80] font-PlusJakartaSansMedium">{item.role}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          handleAddFriend(item._id);
        }}
        className="bg-[#FF6D1B] px-4 py-2 rounded-[8px]"
      >
        <Text className="text-[14px] text-[#f4f4f4] font-PlusJakartaSansMedium">Add Friend</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );


  const renderContactItem = ({ item }: { item: Contacts.Contact }) => (
    <View className="flex-row items-center justify-between p-4 border-b border-[#2A2B32]">
      <View className="flex-row items-center gap-x-3">
        <View className="w-12 h-12 rounded-full bg-[#2A2B32] items-center justify-center">
          <Text className="text-[20px] text-[#f4f4f4] font-PlusJakartaSansBold">
            {item.name?.[0]?.toUpperCase()}
          </Text>
        </View>
        <View>
          <Text className="text-[16px] text-[#f4f4f4] font-PlusJakartaSansBold">{item.name}</Text>
          <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">
            {item.emails?.[0]?.email || 'No email'}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-[#2A2B32] px-4 py-2 rounded-[8px]"
      >
        <Text className="text-[14px] text-[#787A80] font-PlusJakartaSansMedium">Invite</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1">
      <View className="p-4">
        <View className="flex-row items-center bg-[#202227] rounded-[12px] px-4 py-3 mb-4">
          <Search01Icon size={24} color="#63656B" variant="solid" />
          <TextInput
            placeholder="Search users or contacts"
            placeholderTextColor="#63656B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-[16px] text-[#f4f4f4] font-PlusJakartaSansMedium"
          />
        </View>

        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setTab('all')}
            className={`flex-1 py-2 ${tab === 'all' ? 'border-b-2 border-[#FF6D1B]' : ''}`}
          >
            <Text
              className={`text-center text-[16px] font-PlusJakartaSansMedium ${tab === 'all' ? 'text-[#f4f4f4]' : 'text-[#787A80]'}`}
            >
              All Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('contacts')}
            className={`flex-1 py-2 ${tab === 'contacts' ? 'border-b-2 border-[#FF6D1B]' : ''}`}
          >
            <Text
              className={`text-center text-[16px] font-PlusJakartaSansMedium ${tab === 'contacts' ? 'text-[#f4f4f4]' : 'text-[#787A80]'}`}
            >
              Contacts
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'contacts' && (
          <ImageBackground
            source={require("@/assets/images/friends.png")}
            style={{ width: wp("90%") }}
            className="h-[160px] rounded-[24px] pt-[40px] pl-[20px] overflow-hidden mb-[32px] mt-[16px] mx-auto"
          >
            <View className="">
              <Text className="text-[20px] font-PlusJakartaSansBold text-Grey/07 leading-[30px]">
                Looop is fun-er with friends
              </Text>
              <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07 leading-[30px]">
                Invite friends and unlock future rewards!
              </Text>
            </View>
            <View className="absolute right-6 bottom-4">
              <TouchableOpacity className="item bg-[#fff] px-[16px] py-[12px] flex-row items-center rounded-[24px] gap-x-[8px]">
                <Link05Icon size={16} color="#0A0B0F" variant="stroke" />
                <Text className="text-[14px] font-PlusJakartaSansMedium text-Grey/07">
                  Invite friends
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}

        <FlatList
          data={tab === 'all' ? filteredUsers : filteredContacts}
          renderItem={tab === 'all' ? renderUserItem : renderContactItem}
          keyExtractor={(item) => item._id || item.id || ''}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default AddFriends;
