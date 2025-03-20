import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { useState, useCallback, useEffect } from "react";
import { AuthRequest, AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./useAuth";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { authenticateUser, isPending } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "776440951072-v1ncd4jb1o8arac8f541p0ghrv24v4ro.apps.googleusercontent.com",
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  }) as [
    AuthRequest | null,
    AuthSessionResult | null,
    (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>
  ];

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        try {
          const { authentication } = response;
          if (!authentication?.idToken) {
            throw new Error("No ID token received from Google");
          }

          const decoded = jwtDecode(authentication.idToken);
          // @ts-expect-error: email is not part of the JWT spec
          const email = decoded.email;

          if (!email) {
            throw new Error("No email found in Google token");
          }

          await authenticateUser({
            channel: "google",
            email,
            token: authentication.idToken,
          });
        } catch (error) {
          console.error("Google Auth Processing Error:", error);
        } finally {
          setLoading(false);
        }
      } else if (response !== null) {
        console.error("Google Auth failed:", response);
        setLoading(false);
      }
    };

    if (loading && response !== null) {
      handleResponse();
    }
  }, [response, loading, authenticateUser]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (error) {
      console.error("Google Auth Error:", error);
      setLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    loading,
    isAuthenticating: isPending,
  };
};

export const useAppleAuth = () => {
  const [loading, setLoading] = useState(false);
  const { authenticateUser, isPending } = useAuth();

  const handleAppleSignIn = useCallback(async () => {
    setLoading(true);
    try {
      if (!await AppleAuthentication.isAvailableAsync()) {
        throw new Error("Apple Sign-In is not available on this device.");
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple Sign-In");
      }

      const decoded = jwtDecode(credential.identityToken);
      // @ts-expect-error: email is not part of the JWT
      const email = decoded.email;

      if (!email) {
        throw new Error("No email found in Apple token");
      }

      await authenticateUser({
        channel: "apple",
        email,
        token: credential.identityToken,
      });
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
    loading,
    isAuthenticating: isPending,
  };
};
