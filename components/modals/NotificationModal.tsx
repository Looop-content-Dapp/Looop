import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, Dimensions, PanResponder, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationModalProps {
    visible: boolean;
    type: 'success' | 'error' | 'info';  // Added 'info' type
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
    const iconName = type === 'success' ? 'checkmark-circle' :
                    type === 'error' ? 'alert-circle' :
                    'information-circle';

    const backgroundColor = type === 'success' ? '#E8F5E9' :
                          type === 'error' ? '#FFF2F2' :
                          '#F5F5F5';  // Light gray for info

    const iconColor = type === 'success' ? '#4CAF50' :
                     type === 'error' ? '#FF6B6B' :
                     '#2196F3';  // Blue for info

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
                zIndex: 9000,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8
            }}
            {...panResponder.panHandlers}
        >
            <View
                style={{
                    backgroundColor,
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Ionicons
                    name={iconName}
                    size={24}
                    color={iconColor}
                    style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: type === 'success' ? '#1B5E20' : type === 'error' ? '#FF6B6B' : '#f4f4f4',
                        marginBottom: 2
                    }}>
                        {title}
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: type === 'success' ? '#2E7D32' : type === 'error' ? '#FF6B6B' : '#787A80',
                        opacity: type === 'success' ? 0.8 : 0.8
                    }}>
                        {message}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={hideNotification}
                    style={{
                        padding: 4,
                        marginLeft: 12
                    }}
                >
                    <Ionicons
                        name="close"
                        size={24}
                        color={type === 'success' ? '#4CAF50' : '#FF6B6B'}
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default NotificationModal;
