import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Notification } from '@/hooks/useNotifications';

interface NotificationItemProps {
    item: Notification;
    onPress: () => void;
}

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
    return (
        <TouchableOpacity
            className={`p-4 ${!item.isRead ? 'bg-[#1D2029]' : 'bg-[#040405]'}`}
            onPress={onPress}
        >
            <View className="flex-row items-center space-x-3">
                <View className="flex-1">
                    <Text className={`text-[16px] font-PlusJakartaSansMedium ${item.isRead ? 'text-[#787A80]' : 'text-[#f4f4f4]'}`}>
                        {item.title}
                    </Text>
                    <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
                        {item.message}
                    </Text>
                </View>
                {!item.isRead && (
                    <View className="w-2 h-2 bg-[#ff6b00] rounded-full" />
                )}
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;
