import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserData, AuthState, AuthActions, AuthStore } from '../types/authTypes';

const initialState: AuthState = {
  userdata: null,
  authToken: null,
  claimId: null,
  artistId: null,
  channel: null,
  settingdone: false,
  preferences: {
    favoriteGenres: [],
    language: 'en',
    notifications: {
      email: true,
      push: true,
    },
    currency: 'USD',
    chain: 'XION',
    theme: 'light',
    displayMode: 'comfortable',
  }
};

export const useAuthStore = create<AuthStore & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserData: (userdata) => set({ userdata }),

      setToken: (authToken) => set({ authToken }),

      setClaimId: (claimId) => set({ claimId }),

      setArtistId: (artistId) => set({ artistId }),

      setChannel: (channel) => set({ channel }),
      setSettingDone: (settingdone) => set({ settingdone }),
      logout: () => {
        set(initialState);
      },

      clearAuth: () => {
        set(initialState);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist all auth data including JWT authToken
      partialize: (state) => ({
        userdata: state.userdata,
        authToken: state.authToken,
        claimId: state.claimId,
        artistId: state.artistId,
        channel: state.channel,
        settingdone: state.settingdone,
        preferences: state.preferences,
      }),
    }
  )
);

// Export the store instance for direct access if needed
export const authStore = useAuthStore;
