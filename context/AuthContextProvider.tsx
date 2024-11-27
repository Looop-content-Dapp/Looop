// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '../hooks/useQuery';
import { useClerkAuthentication } from '../hooks/useClerkAuthentication';
import { useUser } from '@clerk/clerk-expo';
import { account } from '../appWrite';

interface User {
  _id: string;
  email: string;
  username: string;
  profileImage: string;
  bio: string;
  isPremium: boolean;
  tel?: number;
  following: number;
  friendsCount: number;
  artistPlayed: number;
  faveArtists: any[];
  preferences: any[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
  signOut: () => Promise<void>;
  firstTimeUser: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUserData: async () => {},
  signOut: async () => {},
  firstTimeUser: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstTimeUser, setFirstTimeUser] = useState(false)
  const router = useRouter();
  const { user: signedUser } = useUser();

  const { getUserByEmail, storeUserId } = useQuery();
  const { handleSignOut } = useClerkAuthentication();

  const checkAndFetchUser = async (email: string): Promise<{ user: User | null; isNewBackendUser: boolean; isRecentlyCreated: boolean }> => {
    try {
      const response = await getUserByEmail(email);

      if (response.data) {
        // Check if the user was created in the last minute
        const userCreationTime = new Date(response.data.createdAt).getTime();
        const currentTime = new Date().getTime();
        const oneMinute = 60 * 1000; // milliseconds
        const isRecentlyCreated = currentTime - userCreationTime < oneMinute;

        setFirstTimeUser(isRecentlyCreated)

        return {
          user: response.data,
          isNewBackendUser: false,
          isRecentlyCreated
        };
      }

      setFirstTimeUser(false)
      return {
        user: null,
        isNewBackendUser: true,
        isRecentlyCreated: false
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {
        user: null,
        isNewBackendUser: false,
        isRecentlyCreated: false
      };
    }
  };

  const refreshUserData = async () => {
    const user = await account.get()
    try {
      if (!user.email) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const { user: fetchedUser, isNewBackendUser, isRecentlyCreated } =
        await checkAndFetchUser(user.email);

      if (fetchedUser) {
        setUser(fetchedUser);
        setIsAuthenticated(true);
        await storeUserId(fetchedUser._id);

        // If user exists in backend and was created more than a minute ago,
        // they've already set up their account
        if (!isRecentlyCreated) {
          router.navigate('/(musicTabs)');
        } else {
          // User exists but was just created, needs to set up their account
          router.navigate('/(settingUp)/');
        }
      } else if (isNewBackendUser) {
        // User doesn't exist in backend yet
        setUser(null);
        setIsAuthenticated(false);
        router.navigate('/(auth)/createPassword');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        router.navigate('/(auth)');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setUser(null);
      setIsAuthenticated(false);
      router.navigate('/(auth)/createPassword');
    }
  };

  const signOut = async () => {
    try {
      await handleSignOut();
      setUser(null);
      setIsAuthenticated(false);
      router.navigate('/(auth)');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       setIsLoading(true);
//       try {
//         if (signedUser?.emailAddresses[0]?.emailAddress) {
//           await refreshUserData();
//         } else {
//           router.navigate('/(auth)');
//         }
//       } catch (error) {
//         console.error('Error initializing auth:', error);
//         router.navigate('/(auth)');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [signedUser]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    refreshUserData,
    signOut,
    firstTimeUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
