import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Notification {
  _id: string;
  userId: string;
  type: 'like' | 'follow' | 'mention' | 'release' | 'system' | 'artist_claim';
  title: string;
  message: string;
  data: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
}

interface NotificationsActions {
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationIds: string[]) => void;
  clearNotifications: () => void;
  markAllAsRead: () => void;
}

type NotificationsStore = NotificationsState & NotificationsActions;

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setNotifications: (notifications) => {
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      },
      
      addNotification: (notification) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications];
          const unreadCount = notification.isRead 
            ? state.unreadCount 
            : state.unreadCount + 1;
          
          return {
            notifications: newNotifications,
            unreadCount,
          };
        });
      },
      
      markAsRead: (notificationIds) => {
        set((state) => {
          const notificationIdsSet = new Set(notificationIds);
          const updatedNotifications = state.notifications.map(notification => {
            if (notificationIdsSet.has(notification._id)) {
              return { ...notification, isRead: true };
            }
            return notification;
          });
          
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
          
          return {
            notifications: updatedNotifications,
            unreadCount,
          };
        });
      },
      
      clearNotifications: () => set(initialState),
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      },
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist notifications for privacy/performance reasons
      // Only persist if specifically needed
      partialize: () => ({}),
    }
  )
);

// Export the store instance for direct access if needed
export const notificationsStore = useNotificationsStore;