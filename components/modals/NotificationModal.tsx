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
    const iconName = type === 'success' ? 'checkmark-circle' : type === 'error' ? 'alert-circle' : 'information-circle';
    const iconColor = type === 'success' ? '#FFFFFF' : type === 'error' ? '#FFFFFF' : '#FFFFFF';
    const backgroundColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#FF6B6B' : '#202227'; 

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
                style={{
                    backgroundColor, // Apply dynamic background color
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 5
                }}
                activeOpacity={0.9}
                onPress={hideNotification}
            >
                <Ionicons name={iconName} size={24} color={iconColor} style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: type === 'success' ? '#FFFFFF' : type === 'error' ? '#FFFFFF' : '#f4f4f4' }}>
                        {title}
                    </Text>
                    <Text style={{ fontSize: 14, color: type === 'success' ? '#FFFFFF' : type === 'error' ? '#FFFFFF' : '#787A80' }}>
                        {message}
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export default NotificationModal;
