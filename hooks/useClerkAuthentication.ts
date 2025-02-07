import { useState } from "react";
import { useRouter } from "expo-router";
import { ID, Account, OAuthProvider } from "react-native-appwrite";
import { account } from "@/appWrite";
import store from "@/redux/store";
import { setClaimId, setUserData } from "@/redux/slices/auth";

import { showToast } from "@/config/ShowMessage";

/**
 * Custom hook to handle authentication with OAuth providers
 */
export const useClerkAuthentication = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [session, setSession] = useState<any>(null);

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

  const handleEmailSignIn = async (emailAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const sessionToken = await account.createEmailToken(
        ID.unique(),
        emailAddress
      );
      setSession(sessionToken);
    } catch (err: any) {
      setLoading(false);
      console.error("Error during sign-in:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await account.getSession("current");
      if (session) {
        await account.deleteSession(session.$id);
        router.replace("/");
        showToast("Successfully logged out", "success");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      showToast("Failed to logout. Please try again.", "error");
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

      showToast("Account successfully deleted", "success");
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
    handleEmailSignUp,
    handleEmailSignIn,
    handleOAuthSignIn,
    handleLogout, // Add this
    handleDeleteAccount, // Add this
    userId,
    loading,
    session,
  };
};