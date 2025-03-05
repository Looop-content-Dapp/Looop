import { useState, useEffect, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

interface TwitterUserData {
  id: string;
  username: string;
  name: string;
  verified: boolean;
  profile_image_url?: string;
}

interface TwitterVerificationResult {
  isVerified: boolean;
  userData: TwitterUserData | null;
}

const useTwitterVerification = () => {
  const [verificationResult, setVerificationResult] = useState<TwitterVerificationResult>({
    isVerified: false,
    userData: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const TWITTER_CLIENT_ID = process.env.EXPO_PUBLIC_TWITTER_CLIENT_ID;
  const TWITTER_CLIENT_SECRET = process.env.EXPO_PUBLIC_TWITTER_CLIENT_SECRET;

  const TWITTER_REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: "looop",
    path: "twitter-auth",
  });

  const discovery = {
    authorizationEndpoint: "https://twitter.com/i/oauth2/authorize",
    tokenEndpoint: "https://api.twitter.com/2/oauth2/token",
    revocationEndpoint: "https://api.twitter.com/2/oauth2/revoke",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: TWITTER_CLIENT_ID || "",
      redirectUri: TWITTER_REDIRECT_URI,
      scopes: ["users.read"],
      state: Math.random().toString(36).substring(7),
      clientSecret: TWITTER_CLIENT_SECRET,
    },
    discovery
  );

  const verifyTwitterAccount = useCallback(async (code: string) => {
    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      setError("Missing Twitter client ID or secret. Please configure environment variables.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Exchange authorization code for access token
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: TWITTER_REDIRECT_URI,
          code_verifier: request?.codeVerifier || "",
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(`Failed to get access token: ${tokenResponse.status} - ${errorData.error_description || "Unknown error"}`);
      }

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        throw new Error(tokenData.error_description || "Failed to get access token");
      }

      // Fetch user details
      const userResponse = await fetch(
        "https://api.twitter.com/2/users/me?user.fields=verified,profile_image_url",
        {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(`Failed to get user data: ${userResponse.status} - ${errorData.error || "Unknown error"}`);
      }

      const userData = await userResponse.json();

      if (userData.data) {
        setVerificationResult({
          isVerified: userData.data.verified || false,
          userData: {
            id: userData.data.id,
            username: userData.data.username,
            name: userData.data.name,
            verified: userData.data.verified || false,
            profile_image_url: userData.data.profile_image_url,
          },
        });
      } else {
        throw new Error("Unable to retrieve user data from Twitter API");
      }
    } catch (error: any) {
      console.error("Twitter verification error:", error); // Log detailed error
      setError(`Verification error: ${error.message}`);
      setVerificationResult({
        isVerified: false,
        userData: null,
      });
    } finally {
      setLoading(false);
    }
  }, [TWITTER_CLIENT_ID, TWITTER_CLIENT_SECRET, TWITTER_REDIRECT_URI, discovery.tokenEndpoint, request?.codeVerifier]);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      verifyTwitterAccount(code);
    } else if (response?.type === "error") {
      console.error("Authentication error:", response.error); // Log auth error
      setError(`Authentication error: ${response.error}`);
    }
  }, [response, verifyTwitterAccount]);

  const startVerification = useCallback(() => {
    if (request) {
      promptAsync();
    }
  }, [request, promptAsync]);

  const resetVerification = useCallback(() => {
    setVerificationResult({
      isVerified: false,
      userData: null,
    });
    setError(null);
  }, []);

  return {
    ...verificationResult,
    loading,
    error,
    startVerification,
    resetVerification,
  };
};

export default useTwitterVerification;