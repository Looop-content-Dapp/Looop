import { useState } from "react";
import { useRouter } from "expo-router";
import { Account, ID } from "react-native-appwrite";
import { account } from "@/appWrite";
import store from "@/redux/store";
import { setUserData } from "@/redux/slices/auth";
import api from "@/config/apiConfig";

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
    // try {
    //   const response = await googleOAuth.startOAuthFlow();
    //   if (response.createdSessionId) {
    //     if (setActiveSignUp) {
    //       await setActiveSignUp({ session: response.createdSessionId });
    //       // After successful sign-up, set default role
    //       await setUserRole("user");
    //       router.navigate("/(musicTabs)");
    //     }
    //   }
    // } catch (err) {
    //   console.error("Google Sign Up Error:", err);
    //   setError("Google Sign Up Error");
    // }
  };

  /**
   * Handles Apple OAuth sign-up/sign-in using Clerk.
   */
  const handleAppleSignUp = async () => {
    // try {
    //   const response = await appleOAuth.startOAuthFlow();
    //   if (response.createdSessionId) {
    //     if (setActiveSignUp) {
    //       await setActiveSignUp({ session: response.createdSessionId });
    //       // After successful sign-up, set default role
    //       await setUserRole("user");
    //       router.navigate("/(musicTabs)");
    //     }
    //   }
    // } catch (err) {
    //   console.error("Apple Sign Up Error:", err);
    //   setError("Apple Sign Up Error");
    // }
  };

  /**
   * Handles user sign-out.
   */
  const handleSignOut = async () => {
    // try {
    //   await signOut();
    //   router.navigate("/(auth)");
    // } catch (err) {
    //   console.error("Sign Out Error:", err);
    //   setError("Error signing out.");
    // }
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
