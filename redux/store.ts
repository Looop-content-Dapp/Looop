// redux/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for React Native
import { persistStore, persistReducer } from "redux-persist";

import AuthSlice from "./slices/auth";
import PlayerSlice from "./slices/PlayerSlice";

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Combine your reducers (if you have more, add them here)
const rootReducer = combineReducers({
  player: PlayerSlice,
  authenticate: AuthSlice,
});

// Configure persist settings
const persistConfig = {
  key: "root",
  storage: AsyncStorage, // Use AsyncStorage for React Native
  whitelist: ["player"], // Only persist the player slice
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore non-serializable properties in state
        ignoredPaths: ["player.recentlyPlayed"],
      },
    }),
});

// Export the persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
