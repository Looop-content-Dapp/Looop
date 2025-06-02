import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  recentSearches: string[];
}

const initialState: SearchState = {
  recentSearches: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const search = action.payload.trim();
      if (!search) return;

      // Remove if already exists
      state.recentSearches = state.recentSearches.filter(item => item !== search);

      // Add to beginning of array
      state.recentSearches.unshift(search);

      // Keep only 5 items
      if (state.recentSearches.length > 5) {
        state.recentSearches.pop();
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const { addRecentSearch, clearRecentSearches } = searchSlice.actions;
export default searchSlice.reducer;
