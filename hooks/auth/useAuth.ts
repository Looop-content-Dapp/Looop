import { showToast } from "@/components/ShowMessage";
import api from "@/config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  useAuthActions } from "@/stores/hooks";
import { useMutation } from "@tanstack/react-query";
import { router, useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "@/stores";

// Updated interface to match the new mobile OAuth response
interface MobileOAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    isNewUser: boolean;
    user: {
      id: string;
      email: string;
      name: string;
      username: string;
      emailVerified: boolean;
      image: string | null;
    };
  };
}

// Updated payload interface for mobile OAuth
interface AuthenticateUserParams {
  channel: 'google' | 'apple';
  email: string;
  token: string;
}

export const useAppAuth = () => {
   const setUserData = useAuthStore((state) => state.setUserData);
  const setAuthToken = useAuthStore((state) => state.setToken);

  // New authenticateUser function following the mobile OAuth integration guide
  const authenticateUser = async (params: AuthenticateUserParams) => {
    try {
      const { channel, email, token } = params;

      const endpoint = channel === 'google'
        ? '/auth/mobile/google'
        : '/auth/mobile/apple';

      const response = await api.post(endpoint, {
        channel,
        email,
        token
      });

      const data = response.data as MobileOAuthResponse;

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.data?.token) {
        // Store the JWT token
        setAuthToken(data.data.token);
        setUserData(data.data.user);
        return data.data;
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error: any) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const {
    mutate: authenticateUserMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: authenticateUser,
    onSuccess: (response) => {
      console.log("Mobile OAuth authentication succeeded:", response);

      if (response.isNewUser) {
        console.log(
          "New user detected, redirecting to user details:",
          response.user
        );

        router.replace({
          pathname: "/(settingUp)",
          params: {
            email: response.user.email,
            oauthId: response.user.id,
            isOAuth: "true",
            oauthProvider: 'mobile', // Updated to indicate mobile OAuth
          },
        });
      } else {
        console.log(
          "Existing user detected, redirecting to music tabs:",
          response
        );
        setUserData(response.user);
        router.replace("/(musicTabs)");
      }
    },
    onError: (error: any) => {
      console.error("Mobile OAuth verification failed:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      showToast(error.message || "Authentication failed. Please try again.", "error");
    },
  });

  return {
    authenticateUser: authenticateUserMutation,
    isPending,
    error,
  };
};

/**
 * Custom hook to handle authentication with OAuth providers
 */
export const useClerkAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setUserData = useAuthStore((state) => state.setUserData);
  const setAuthToken = useAuthStore((state) => state.setToken);
  const clearAuthState = useAuthActions().clearAuth;

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/logout');
      setAuthToken(null);
      setUserData(null);
      router.dismissTo("/");
    } catch (error) {
      console.error("Error during logout:", error);
      showToast("Failed to logout. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/api/user/delete", { confirmDelete: true });
      // Clear local store
      clearAuthState();
      router.replace("/");
    } catch (err: any) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account");
      showToast("Failed to delete account", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    handleLogout,
    handleDeleteAccount,
    loading,
  };
};
