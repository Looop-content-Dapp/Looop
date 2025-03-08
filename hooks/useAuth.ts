import api from "@/config/apiConfig";
import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/auth";
import store from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";

interface OAuthResponse {
  status: string;
  message: string;
  data: {
    user: {
      email: string;
      profileImage: string | null;
      bio: string | null;
      isPremium: boolean;
      tel: string | null;
      role: string;
      wallets: {
        starknet: string | null;
        xion: string | null;
      };
      oauthTokens: any[];
      referralCount: number;
      referralCodeUsed: string[];
      _id: string;
    };
    isNewUser: boolean;
  };
}

interface OAuthPayload {
  channel: "google" | "apple";
  email: string;
  token: string;
}

export const useAuth = () => {
  const verifyOAuthToken = async (payload: OAuthPayload): Promise<OAuthResponse> => {
    console.log('Attempting OAuth verification with payload:', payload)
    const response = await api.post("/api/oauth/auth", payload);
    console.log("Auth response", response.data)
    return response.data;
  };

  const { mutate: authenticateUser, isPending, error } = useMutation({
    mutationFn: verifyOAuthToken,
    onSuccess: (response) => {
      console.log('OAuth mutation succeeded:', response)
      if (response.data.isNewUser) {
        console.log("New user detected, redirecting to user details:", response.data.user)
        router.navigate({
          pathname: "/(auth)/userDetail",
          params: {
            email: response.data.user.email,
            oauthId: response.data.user._id,
            isOAuth: "true",
          },
        });
      } else {
        console.log("Existing user detected, redirecting to music tabs:", response.data.user)
        store.dispatch(setUserData(response.data.user));
        router.navigate("/(musicTabs)");
      }
    },
    onError: (error: any) => {
      console.error("OAuth verification failed:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    },
  });

  return {
    authenticateUser,
    isPending,
    error,
  };
};
