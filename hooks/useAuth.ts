import api from "@/config/apiConfig";
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
    const response = await api.post("/api/oauth/auth", payload);
    return response.data;
  };

  const { mutate: authenticateUser, isPending, error } = useMutation({
    mutationFn: verifyOAuthToken,
    onSuccess: (response) => {
      if (response.data.isNewUser) {
        // Route to userDetail page for new users
        router.navigate({
          pathname: "/(auth)/userDetail",
          params: {
            email: response.data.user.email,
            oauthId: response.data.user._id,
            isOAuth: true,
          },
        });
      } else {
        // Handle existing user login
        // You might want to store the user data in your app's state management
        // and redirect to the main app screen

        router.navigate("/(musicTabs)");
      }
    },
    onError: (error) => {
      console.error("OAuth verification failed:", error);
    },
  });

  return {
    authenticateUser,
    isPending,
    error,
  };
};
