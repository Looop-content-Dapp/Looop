import { useState } from "react";
import { useRouter } from "expo-router";
import { ID, OAuthProvider } from "react-native-appwrite";
import { account } from "@/appWrite";
import store from "@/redux/store";
import { setUserData } from "@/redux/slices/auth";
import api from "@/config/apiConfig";
import { Alert } from "react-native";

const ENDPOINT = "https://looop-backend.onrender.com";
export type UserRole = "user" | "admin" | "artist";

interface UserPublicMetadata {
  role?: UserRole;
}

/**
 * Custom hook to handle authentication with Clerk.
 */
export const useClerkAuthentication = () => {
  // const { signUp, setActive: setActiveSignUp, isLoaded } = useSignUp();
  const [loading, setLoading] = useState(false);
  // const { signOut } = useAuth();
  // const { user, isSignedIn } = useUser();
  // const { signIn, setActive: setActiveSignIn } = useSignIn();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  // Initialize OAuth strategies
  // const googleOAuth = useOAuth({ strategy: "oauth_google" });
  // const appleOAuth = useOAuth({ strategy: "oauth_apple" });

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
      }
    } catch (err: any) {
      console.error("Error during email sign-up:", err.message);
      console.error(JSON.stringify(err, null, 2));
      setError("Error during email sign-up.");
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
      router.push("../(musicTabs)/(home)/");
      return response.data;
    } catch (err) {
      setLoading(false);
      console.error("Error during sign-in:", err);
    }
  };

  /**
   * Handles Google OAuth sign-up/sign-in using Clerk.
   */
  const handleGoogleSignUp = async () => {
    try {
        // Create OAuth2 session for Google
        const session = account.createOAuth2Session(
            OAuthProvider.Google,
            'YOUR_SUCCESS_URL',  // URL to redirect after successful sign in
            'YOUR_FAILURE_URL',  // URL to redirect after failed sign in
            ['profile', 'email'] // Requested scopes
        );
        console.log("session", session)
        return session;
    } catch (error) {
        console.error('Google Sign In Error:', error);
        throw error;
    }
  };

  /**
   * Handles Apple OAuth sign-up/sign-in using Clerk.
   */
  const handleAppleSignUp = async () => {
    try {
        // Create OAuth2 session for Google
        const session = await account.createOAuth2Session(
            OAuthProvider.Apple,
            'YOUR_SUCCESS_URL',  // URL to redirect after successful sign in
            'YOUR_FAILURE_URL',  // URL to redirect after failed sign in
            ['profile', 'email'] // Requested scopes
        );

        return session;
    } catch (error) {
        console.error('Google Sign In Error:', error);
        throw error;
    }
  };

  /**
   * Handles user sign-out.
   */
  const handleSignOut = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.error('Sign Out Error:', error);
        throw error;
    }
  };

  /**
   * Sets the user's role in Clerk metadata.
   * @param role - The role to assign to the user
   */
  const setUserRole = async (role: UserRole) => {
    // try {
    //   if (!user) throw new Error("No user found");
    //   await user.update({
    //     unsafeMetadata: {
    //       role: role,
    //     },
    //   });
    // } catch (err) {
    //   console.error("Error setting user role:", err);
    //   setError("Error setting user role.");
    // }
  };

  /**
   * Gets the current user's email address.
   * @returns The user's primary email address or null if not found
   */
  const getUserEmail = () => {
    // return user?.primaryEmailAddress?.emailAddress || null;
  };

  /**
   * Gets the current user's role.
   * @returns The user's role or null if not found
   */
  const getUserRole = () => {
    // return (user?.unsafeMetadata?.role as UserRole) || null;
  };

  return {
    error,
    handleEmailSignUp,
    handleEmailSignIn,
    handleGoogleSignUp,
    handleAppleSignUp,
    handleSignOut,
    setUserRole,
    getUserEmail,
    getUserRole,
    userId,
    loading,
  };
};
