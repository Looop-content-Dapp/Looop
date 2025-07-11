import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { persistStore, persistReducer } from "redux-persist";

import authReducer from "./slices/auth";
import playerReducer from "./slices/PlayerSlice";
import miscReducer from "./slices/miscelleaneous";
import searchReducer from "./slices/searchSlice";
import reactotron from "@/ReactotronConfig";
import notificationsReducer from './slices/notifications';

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["player"],
};

const persistAuthConfig = {
  key: "authentication",
  storage: AsyncStorage,
};

const persistMiscConfig = {
  key: "misc",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, playerReducer);
const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedMiscReducer = persistReducer(persistMiscConfig, miscReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    player: persistedReducer,
    misc: persistedMiscReducer,
    search: searchReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: (getDefaultEnhancers) => {
    if (__DEV__) {
      const enhancer = reactotron.createEnhancer!();
      return getDefaultEnhancers().concat(enhancer);
    }
    return getDefaultEnhancers();
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
