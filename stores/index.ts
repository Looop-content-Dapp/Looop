import { authStore } from './authStore';
import { notificationsStore } from './notificationsStore';
import { searchStore } from './searchStore';
import { miscStore } from './miscStore';
import { playerStore } from './playerStore';

// Export all stores
export { useAuthStore } from './authStore';
export { usePlayerStore } from './playerStore';
export { useNotificationsStore } from './notificationsStore';
export { useSearchStore } from './searchStore';
export { useMiscStore } from './miscStore';

// Export convenience hooks
export { useAuth, useAuthActions } from './hooks';
export { usePlayer, usePlayerActions } from './hooks';
export { useNotifications, useNotificationsActions } from './hooks';
export { useSearch, useSearchActions } from './hooks';
export { useMisc, useMiscActions } from './hooks';

// Combined store type for compatibility (if needed)
export interface RootState {
  auth: ReturnType<typeof authStore.getState>;
  player: ReturnType<typeof playerStore.getState>;
  notifications: ReturnType<typeof notificationsStore.getState>;
  search: ReturnType<typeof searchStore.getState>;
  misc: ReturnType<typeof miscStore.getState>;
}

// Helper function to get all store states (for debugging)
export const getAllStoreStates = (): RootState => ({
  auth: authStore.getState(),
  player: playerStore.getState(),
  notifications: notificationsStore.getState(),
  search: searchStore.getState(),
  misc: miscStore.getState(),
});
