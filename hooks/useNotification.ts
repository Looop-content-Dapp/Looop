import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';


interface NotificationPermissions {
  status: Notifications.PermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
}

interface NotificationToken {
  type: 'success' | 'error';
  token: string | null;
  error?: string;
}

interface NotificationHookState {
  expoPushToken: NotificationToken | null;
  notification: Notifications.Notification | null;
  permissions: NotificationPermissions | null;
  loading: boolean;
  error: string | null;
}

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const useNotifications = () => {
  const [state, setState] = useState<NotificationHookState>({
    expoPushToken: null,
    notification: null,
    permissions: null,
    loading: true,
    error: null,
  });

  const registerForPushNotifications = async () => {
    try {
      // Check if device is physical (not simulator)
      if (!Device.isDevice) {
        throw new Error('Push notifications are not supported in simulator');
      }

      // Request permission
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }

      // Get Expo push token
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id', // Replace with your Expo project ID
      });

      // Update permissions state
      const permissionsState = await Notifications.getPermissionsAsync();

      setState(prev => ({
        ...prev,
        expoPushToken: {
          type: 'success',
          token: tokenData.data,
        },
        permissions: {
          status: permissionsState.status,
          granted: permissionsState.granted,
          canAskAgain: permissionsState.canAskAgain,
        },
        loading: false,
        error: null,
      }));

      // Set up notification handling for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        expoPushToken: {
          type: 'error',
          token: null,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  const sendLocalNotification = async (
    title: string,
    body: string,
    data?: Record<string, unknown>
  ) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
        },
        trigger: null, // null means send immediately
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send notification',
      }));
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up notification handlers
    const notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        if (isMounted) {
          setState(prev => ({ ...prev, notification }));
        }
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        if (isMounted) {
          // Handle notification response (e.g., when user taps notification)
          console.log('Notification response:', response);
        }
      }
    );

    // Initialize notifications
    registerForPushNotifications();

    // Cleanup
    return () => {
      isMounted = false;
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return {
    ...state,
    sendLocalNotification,
    registerForPushNotifications,
  };
};

export default useNotifications;
