import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, Dimensions, PanResponder, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationModalProps {
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose: () => void;
    position?: 'top' | 'bottom';
    duration?: number;
}

const NotificationModal = ({
    visible,
    type,
    title,
    message,
    onClose,
    position = 'top',
    duration = 3000
}: NotificationModalProps) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');
    const iconName = type === 'success' ? 'checkmark-circle' : 'alert-circle';
    const iconColor = type === 'success' ? '#4CAF50' : '#FF6B00';

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const direction = position === 'top' ? gestureState.dy : -gestureState.dy;
                if (direction > 0) return;
                slideAnim.setValue(direction);
            },
            onPanResponderRelease: (_, gestureState) => {
                const direction = position === 'top' ? gestureState.dy : -gestureState.dy;
                if (direction < -50) {
                    hideNotification();
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true
                    }).start();
                }
            }
        })
    ).current;

    const showNotification = () => {
        Animated.spring(slideAnim, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    };

    const hideNotification = () => {
        Animated.timing(slideAnim, {
            toValue: -1,
            duration: 200,
            useNativeDriver: true
        }).start(() => onClose());
    };

    useEffect(() => {
        if (visible) {
            showNotification();
            const timer = setTimeout(hideNotification, duration);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const translateY = slideAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [
            position === 'top' ? -200 : height,
            position === 'top' ? 50 : height - 150,
            position === 'top' ? 50 : height - 150
        ]
    });

    if (!visible) return null;

    return (
        <Animated.View
            style={{
                transform: [{ translateY }],
                position: 'absolute',
                left: 20,
                right: 20,
                zIndex: 1000
            }}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity
                className="bg-[#202227] rounded-[12px] p-[16px] flex-row items-center shadow-lg"
                activeOpacity={0.9}
                onPress={hideNotification}
            >
                <Ionicons name={iconName} size={24} color={iconColor} style={{ marginRight: 12 }} />
                <View className="flex-1">
                    <Text className="text-[16px] font-PlusJakartaSansBold text-[#f4f4f4]">
                        {title}
                    </Text>
                    <Text className="text-[14px] font-PlusJakartaSansMedium text-[#787A80]">
                        {message}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default NotificationModal;
