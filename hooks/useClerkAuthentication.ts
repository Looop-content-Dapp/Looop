import { useState } from "react";
import { useRouter } from "expo-router";
import { ID, Account, OAuthProvider } from "react-native-appwrite";
import { account } from "@/appWrite";
import store from "@/redux/store";
import { setClaimId, setUserData } from "@/redux/slices/auth";
import api from "@/config/apiConfig";
import { showToast } from "@/config/ShowMessage";

/**
 * Custom hook to handle authentication with OAuth providers
 */
export const useClerkAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    setLoading(true);
    setError(null);
    try {
      const session = account.createOAuth2Session(
        provider === "google" ? OAuthProvider.Google : OAuthProvider.Apple,
        "looop://(auth)/createpassword",
        "https://example.com/failure",
        ["email", "profile"]
      );
    } catch (err: any) {
      console.error(`Error during ${provider} sign-in:`, err);
      setError(`${provider} sign-in failed`);
      showToast("Failed to sign in with " + provider, "error");
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
        showToast("Verification email sent successfully", "success");
      }
    } catch (err: any) {
      console.error("Error during email sign-up:", err.message);
      console.error(JSON.stringify(err, null, 2));
      setError("Error during email sign-up.");
      showToast("Failed to send verification email", "error");
    }
  };

  const handleEmailSignIn = async (emailAddress: string, password: string) => {
    setLoading(true);
    setError(null);

    try {

        const user =  await account.get()
        // First authenticate with Appwrite
        await account.createEmailToken(user.$id, emailAddress,);

        // Then authenticate with your backend
        const response = await api.post(`/api/user/signin`, {
          email: emailAddress,
          password: password,
        });

        store.dispatch(setUserData(response.data.data));
        store.dispatch(setClaimId(response.data.data.artistClaim))
        showToast('Successfully signed in', 'success');
        router.push("/(musicTabs)/(home)");
        return response.data;
    } catch (err: any) {
      setLoading(false);
      console.error("Error during sign-in:", err);
      
      // Show more specific error messages
      if (err.type === 'user_invalid_credentials') {
        showToast("Invalid email or password", "error");
      } else {
        showToast("Failed to sign in. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await account.getSession('current');
      if (session) {
          await account.deleteSession(session.$id);
          router.replace('/');
          showToast('Successfully logged out', 'success');
      }
  } catch (error) {
      console.error('Error during logout:', error);
      showToast('Failed to logout. Please try again.', 'error');
  }
  };

  const handleDeleteAccount = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Delete all sessions first
      await account.deleteSessions();
      
      // Delete the account
      await account.deleteIdentity(userId);
      
      // Clear local store
      store.dispatch(setUserData(null));
      
      showToast('Account successfully deleted', 'success');
      router.replace('/');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
      showToast('Failed to delete account', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    handleEmailSignUp,
    handleEmailSignIn,
    handleOAuthSignIn,
    handleLogout,     // Add this
    handleDeleteAccount, // Add this
    userId,
    loading
  };
};
