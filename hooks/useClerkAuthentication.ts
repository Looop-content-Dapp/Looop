import { useState } from "react";
import { useRouter } from "expo-router";
import { ID, Account, OAuthProvider } from "react-native-appwrite";
import { account } from "@/appWrite";
import store from "@/redux/store";
import { setUserData } from "@/redux/slices/auth";
import api from "@/config/apiConfig";
import { showToast } from "@/config/ShowMessage";

const ENDPOINT = "https://looop-backend.onrender.com";
export type UserRole = "user" | "admin" | "artist";

/**
 * Custom hook to handle authentication with OAuth providers
 */
export const useClerkAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setError(null);
    try {
      const session = await account.createOAuth2Session(
        provider === 'google' ? OAuthProvider.Google : OAuthProvider.Apple,
        'https://example.com/success',
        'https://example.com/failure',
        ['email', 'profile']
      );

      if (session) {
        // Get user profile after successful OAuth login
        const user = await account.get();

        // Send user data to backend
        const response = await api.post(`/api/user/oauth-signin`, {
          email: user.email,
          provider: provider,
          providerUserId: user.$id
        });

        store.dispatch(setUserData(response.data.data));
        showToast(`Successfully signed in with ${provider}`, 'success');
        router.push("../(musicTabs)/(home)/");
        return response.data;
      }

    } catch (err: any) {
      console.error(`Error during ${provider} sign-in:`, err);
      setError(`${provider} sign-in failed`);
      showToast('Failed to sign in with ' + provider, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (emailAddress: string) => {
    try {
      const sessionToken = await account.createEmailToken(
        ID.unique(),
        emailAddress
      );
      console.log("sessionToken", sessionToken);
      const userId = sessionToken.userId;
      if (userId) {
        setUserId(userId);
        showToast('Verification email sent successfully', 'success');
      }
    } catch (err: any) {
      console.error("Error during email sign-up:", err.message);
      console.error(JSON.stringify(err, null, 2));
      setError("Error during email sign-up.");
      showToast('Failed to send verification email', 'error');
    }
  };

  const handleEmailSignIn = async (emailAddress: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/api/user/signin`, {
        email: emailAddress,
        password: password,
      });
      setLoading(false);
      store.dispatch(setUserData(response.data.data));
      showToast('Successfully signed in', 'success');
      router.push("../(musicTabs)/(home)/");
      return response.data;
    } catch (err) {
      setLoading(false);
      console.error("Error during sign-in:", err);
      showToast('Invalid email or password', 'error');
    }
  };

  return {
    error,
    handleEmailSignUp,
    handleEmailSignIn,
    handleOAuthSignIn,
    userId,
    loading,
  };
};
