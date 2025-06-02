import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/apiConfig';
import { useAppDispatch } from '@/redux/hooks';
import { markAsRead, setNotifications } from '@/redux/slices/notifications';

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

interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    current: number;
    total: number;
    hasMore: boolean;
  };
}

export const useNotifications = (userId: string) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery<NotificationResponse>({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/notifications/user/${userId}`);
      dispatch(setNotifications(data.data.notifications));
      return data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get unread count
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications-unread', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/notifications/user/${userId}/unread`);
      return data.data.count;
    },
  });

  // Mark notifications as read
  const markNotificationsAsRead = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const { data } = await api.post(`/api/notifications/user/${userId}/read`, {
        notificationIds,
      });
      dispatch(markAsRead(notificationIds));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications-unread', userId]);
    },
  });

  // Mark single notification as read
  const markSingleAsRead = useCallback(
    async (notificationId: string) => {
      await markNotificationsAsRead.mutateAsync([notificationId]);
    },
    [markNotificationsAsRead]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (notificationsData?.notifications) {
      const unreadIds = notificationsData.notifications
        .filter(n => !n.isRead)
        .map(n => n._id);
      if (unreadIds.length > 0) {
        await markNotificationsAsRead.mutateAsync(unreadIds);
      }
    }
  }, [notificationsData, markNotificationsAsRead]);

  return {
    notifications: notificationsData?.notifications || [],
    pagination: notificationsData?.pagination,
    unreadCount,
    isLoading,
    markSingleAsRead,
    markAllAsRead,
  };
};
