import NotificationModal from '@/components/modals/NotificationModal';
import React, { createContext, useContext, useState } from 'react';

type NotificationType = {
    visible: boolean;
    type: 'success' | 'error' | 'info'; // Add 'info' type
    title: string;
    message: string;
    position?: 'top' | 'bottom';
};

interface NotificationContextType {
    showNotification: (notification: Omit<NotificationType, 'visible'>) => void;
    hideNotification: () => void;
    notification: NotificationType;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notification, setNotification] = useState<NotificationType>({
        visible: false,
        type: 'success',
        title: '',
        message: '',
        position: 'top'
    });

    const showNotification = (params: Omit<NotificationType, 'visible'>) => {
        setNotification({ ...params, visible: true });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, visible: false }));
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification, notification }}>
            {children}
            <NotificationModal
                {...notification}
                onClose={hideNotification}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
