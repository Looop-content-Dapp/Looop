import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchState {
  recentSearches: string[];
}

interface SearchActions {
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (search: string) => void;
}

type SearchStore = SearchState & SearchActions;

const initialState: SearchState = {
  recentSearches: [],
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      addRecentSearch: (search) => {
        const trimmedSearch = search.trim();
        if (!trimmedSearch) return;
        
        set((state) => {
          // Remove if already exists
          const filteredSearches = state.recentSearches.filter(
            item => item !== trimmedSearch
          );
          
          // Add to beginning of array
          const newSearches = [trimmedSearch, ...filteredSearches];
          
          // Keep only 5 items
          if (newSearches.length > 5) {
            newSearches.pop();
          }
          
          return { recentSearches: newSearches };
        });
      },
      
      clearRecentSearches: () => set({ recentSearches: [] }),
      
      removeRecentSearch: (search) => {
        set((state) => ({
          recentSearches: state.recentSearches.filter(item => item !== search)
        }));
      },
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);

// Export the store instance for direct access if needed
export const searchStore = useSearchStore;