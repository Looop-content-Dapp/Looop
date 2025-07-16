import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MiscState {
  onBoarded: boolean;
}

interface MiscActions {
  updateOnBoarded: () => void;
  setOnBoarded: (onBoarded: boolean) => void;
  resetMisc: () => void;
}

type MiscStore = MiscState & MiscActions;

const initialState: MiscState = {
  onBoarded: false,
};

export const useMiscStore = create<MiscStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      updateOnBoarded: () => set({ onBoarded: true }),
      
      setOnBoarded: (onBoarded) => set({ onBoarded }),
      
      resetMisc: () => set(initialState),
    }),
    {
      name: 'misc-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        onBoarded: state.onBoarded,
      }),
    }
  )
);

// Export the store instance for direct access if needed
export const miscStore = useMiscStore;