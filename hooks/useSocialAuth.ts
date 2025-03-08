import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { useState, useCallback } from "react";
import { AuthRequest, AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./useAuth";

// Complete WebBrowser auth session
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { authenticateUser } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "776440951072-v1ncd4jb1o8arac8f541p0ghrv24v4ro.apps.googleusercontent.com",
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  }) as [
    AuthRequest | null,
    AuthSessionResult | null,
    (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>
  ];

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
    const result = await  promptAsync();
      if (response?.type === 'success' && result.type === "success") {
        const { authentication } = response;
        console.log("Google Auth:", authentication)
        if (authentication?.idToken) {
          const decoded = jwtDecode(authentication.idToken);
          const email = decoded.email;
          authenticateUser({
            channel: "google",
            email,
            token: authentication.idToken,
          });
        } else {
          console.error("Google Auth: No access token received.");
        }
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    loading
  };
};

export const useAppleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { authenticateUser } = useAuth();

  const handleAppleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      if (!await AppleAuthentication.isAvailableAsync()) {
        console.error("Apple Sign-In is not available on this device.");
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        const decoded = jwtDecode(credential.identityToken);
        const email = decoded.email;
        authenticateUser({
          channel: "apple",
          email,
          token: credential.identityToken,
        });
      } else {
        console.error("No identity token received from Apple Sign-In");
      }
    } catch (e: unknown) {
      const error = e as { code?: string; message?: string };
      if (error.code !== "ERR_CANCELED") {
        console.error("Apple Sign In Error Details:", {
          code: error.code,
          message: error.message,
          stack: (e as Error).stack,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [authenticateUser]);

  return {
    handleAppleSignIn,
    loading
  };
};
