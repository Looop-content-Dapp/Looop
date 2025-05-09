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
  channel: "google" | "apple" | "xion" | "argent";
  email?: string;
  token?: string;
  walletAddress?: string
}

export const useAuth = () => {
  const verifyOAuthToken = async (payload: OAuthPayload): Promise<OAuthResponse> => {
    try {
      const response = await api.post("/api/oauth/auth", payload);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Re-throw to be caught by mutation error handler
    }
  };

  const { mutate: authenticateUser, isPending, error } = useMutation({
    mutationFn: verifyOAuthToken,
    onSuccess: (response, variables) => {
      console.log('OAuth mutation succeeded:', response)
      if (!response.data) {
        console.error("Invalid response format:", response);
        return;
      }

      if (response.data.isNewUser) {
        console.log("New user detected, redirecting to user details:", response.data.user)

        router.replace({
          pathname: "/(auth)/userDetail",
          params: {
            email: response.data.user.email,
            oauthId: response.data.user._id,
            isOAuth: "true",
            oauthProvider: variables.channel,
            walletAddress: variables.walletAddress
          },
        });
      } else {
        console.log("Existing user detected, redirecting to music tabs:", response.data)
        store.dispatch(setUserData(response.data));
        router.replace("/(musicTabs)");
      }
    },
    onError: (error: any) => {
      console.error("OAuth verification failed:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      // You might want to show an error message to the user here
    },
  });

  return {
    authenticateUser,
    isPending,
    error,
  };
};
