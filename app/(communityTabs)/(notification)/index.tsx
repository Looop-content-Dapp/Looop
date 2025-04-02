import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { useAppSelector } from '@/redux/hooks';
import { Avatar } from 'react-native-elements';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationItem from '@/components/NotificationItem';


const NotificationScreen = () => {
    const navigation = useNavigation();
    const { userdata } = useAppSelector((state) => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    const {
        notifications,
        isLoading,
        unreadCount,
        markSingleAsRead,
        markAllAsRead
    } = useNotifications(userdata?._id || '');

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Text className='text-[#f4f4f4] text-[24px] font-PlusJakartaSansMedium'>
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Text>
            ),
            headerRight: () => (
                <Avatar
                    source={{
                        uri: userdata?.profileImage ||
                            "https://i.pinimg.com/564x/bc/7a/0c/bc7a0c399990de122f1b6e09d00e6c4c.jpg",
                    }}
                    size={40}
                    rounded
                    onPress={() => router.push("/(profile)")}
                    avatarStyle={{
                        borderWidth: 2,
                        borderColor: "#f4f4f4",
                    }}
                />
            ),
            title: ""
        });
    }, [unreadCount]);

    const onRefresh = async () => {
        setRefreshing(true);
        // Add refresh logic here
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#ff6b00" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#040405]">
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <NotificationItem
                        item={item}
                        onPress={() => markSingleAsRead(item._id)}
                    />
                )}
                keyExtractor={(item) => item._id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#ff6b00']}
                        tintColor="#ff6b00"
                    />
                }
                ListEmptyComponent={
                    <View className="flex-1 justify-center items-center mt-[50%]">
                        <Text className="text-[#787A80] text-[16px] font-PlusJakartaSansMedium">
                            No notifications yet
                        </Text>
                    </View>
                }
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
            />
        </View>
    );
};

export default NotificationScreen;
