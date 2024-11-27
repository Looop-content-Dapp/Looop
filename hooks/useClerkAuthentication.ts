import { useState } from 'react';
import { useAuth, useSignUp, useOAuth, useUser, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Account, ID } from 'react-native-appwrite';
import { account, client } from '../appWrite';

export type UserRole = 'user' | 'admin' | 'artist';

interface UserPublicMetadata {
  role?: UserRole;
}

/**
 * Custom hook to handle authentication with Clerk.
 */
export const useClerkAuthentication = () => {
  const { signUp, setActive: setActiveSignUp, isLoaded } = useSignUp();
  const { signOut } = useAuth();
  const { user, isSignedIn } = useUser();
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("")

  // Initialize OAuth strategies
  const googleOAuth = useOAuth({ strategy: 'oauth_google' });
  const appleOAuth = useOAuth({ strategy: 'oauth_apple' });

  /**
   * Handles email sign-up using Clerk.
   * @param emailAddress - The user's email address.
   * @param username - The desired username
   */
  const handleEmailSignUp = async (emailAddress: string) => {
    try {
        if (!isLoaded) {
            return
          }
          const sessionToken = await account.createEmailToken(
            ID.unique(),
           emailAddress,
        );
        console.log("sessionToken", sessionToken)
        const userId = sessionToken.userId;
        if(userId){
            setUserId(userId)
        }
    } catch (err: any) {
      console.error('Error during email sign-up:', err.message);
      console.error(JSON.stringify(err, null, 2))
      setError('Error during email sign-up.');
    }
  };

  /**
   * Handles email sign-in using Clerk.
   * @param emailAddress - The user's email address.
   */
  const handleEmailSignIn = async (emailAddress: string) => {
    try {
      await signIn?.create({
        identifier: emailAddress,
      });
      router.navigate('/(musicTabs)');
    } catch (err) {
      console.error('Error during email sign-in:', err);
      setError('Error during email sign-in.');
    }
  };

  /**
   * Handles Google OAuth sign-up/sign-in using Clerk.
   */
  const handleGoogleSignUp = async () => {
    try {
      const response = await googleOAuth.startOAuthFlow();
      if (response.createdSessionId) {
        if (setActiveSignUp) {
          await setActiveSignUp({ session: response.createdSessionId });
          // After successful sign-up, set default role
          await setUserRole('user');
          router.navigate('/(musicTabs)');
        }
      }
    } catch (err) {
      console.error('Google Sign Up Error:', err);
      setError('Google Sign Up Error');
    }
  };

  /**
   * Handles Apple OAuth sign-up/sign-in using Clerk.
   */
  const handleAppleSignUp = async () => {
    try {
      const response = await appleOAuth.startOAuthFlow();
      if (response.createdSessionId) {
        if (setActiveSignUp) {
          await setActiveSignUp({ session: response.createdSessionId });
          // After successful sign-up, set default role
          await setUserRole('user');
          router.navigate('/(musicTabs)');
        }
      }
    } catch (err) {
      console.error('Apple Sign Up Error:', err);
      setError('Apple Sign Up Error');
    }
  };

  /**
   * Handles user sign-out.
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      router.navigate('/(auth)');
    } catch (err) {
      console.error('Sign Out Error:', err);
      setError('Error signing out.');
    }
  };

  /**
   * Sets the user's role in Clerk metadata.
   * @param role - The role to assign to the user
   */
  const setUserRole = async (role: UserRole) => {
    try {
      if (!user) throw new Error('No user found');

      await user.update({
        unsafeMetadata: {
          role: role
        }
      });
    } catch (err) {
      console.error('Error setting user role:', err);
      setError('Error setting user role.');
    }
  };

  /**
   * Gets the current user's email address.
   * @returns The user's primary email address or null if not found
   */
  const getUserEmail = (): string | null => {
    return user?.primaryEmailAddress?.emailAddress || null;
  };

  /**
   * Gets the current user's role.
   * @returns The user's role or null if not found
   */
  const getUserRole = (): UserRole | null => {
    return (user?.unsafeMetadata?.role as UserRole) || null;
  };

  return {
    isSignedIn,
    error,
    handleEmailSignUp,
    handleEmailSignIn,
    handleGoogleSignUp,
    handleAppleSignUp,
    handleSignOut,
    setUserRole,
    getUserEmail,
    getUserRole,
    user,
    userId
  };
};
