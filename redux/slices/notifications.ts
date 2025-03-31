import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string[]>) => {
      const notificationIds = new Set(action.payload);
      state.notifications = state.notifications.map(notification => {
        if (notificationIds.has(notification._id)) {
          return { ...notification, isRead: true };
        }
        return notification;
      });
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
  },
});

export const { setNotifications, addNotification, markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;
