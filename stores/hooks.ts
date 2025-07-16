import { useAuthStore } from './authStore';
import { usePlayerStore } from './playerStore';
import { useNotificationsStore } from './notificationsStore';
import { useSearchStore } from './searchStore';
import { useMiscStore } from './miscStore';

// Compatibility hooks that mimic Redux patterns
// These provide a similar API to useAppSelector for easier migration

// Auth selectors
export const useAuth = () => {
  const userdata = useAuthStore(state => state.userdata);
  const authToken = useAuthStore(state => state.authToken);
  const settingDone = useAuthStore(state => state.settingdone);
  const claimId = useAuthStore(state => state.claimId);
  const artistId = useAuthStore(state => state.artistId);
  const channel = useAuthStore(state => state.channel);

  return { userdata, authToken, settingDone, claimId, artistId, channel };
};

export const useAuthActions = () => {
  const setUserData = useAuthStore(state => state.setUserData);
  const setToken = useAuthStore(state => state.setToken);
  const setClaimId = useAuthStore(state => state.setClaimId);
  const setArtistId = useAuthStore(state => state.setArtistId);
  const setChannel = useAuthStore(state => state.setChannel);
  const logout = useAuthStore(state => state.logout);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const setSettingDone = useAuthStore(state => state.setSettingDone);

  return {
    setUserData,
    setToken,
    setClaimId,
    setArtistId,
    setChannel,
    logout,
    clearAuth,
    setSettingDone,
  };
};

// Player selectors
export const usePlayer = () => {
  const track = usePlayerStore(state => state.track);
  const currentTrackId = usePlayerStore(state => state.currentTrackId);
  const albumInfo = usePlayerStore(state => state.albumInfo);
  const playlist = usePlayerStore(state => state.playlist);
  const currentIndex = usePlayerStore(state => state.currentIndex);
  const shuffle = usePlayerStore(state => state.shuffle);
  const repeat = usePlayerStore(state => state.repeat);
  const queue = usePlayerStore(state => state.queue);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const volume = usePlayerStore(state => state.volume);
  const muted = usePlayerStore(state => state.muted);
  const loading = usePlayerStore(state => state.loading);
  const error = usePlayerStore(state => state.error);

  return {
    track,
    currentTrackId,
    albumInfo,
    playlist,
    currentIndex,
    shuffle,
    repeat,
    queue,
    isPlaying,
    volume,
    muted,
    loading,
    error,
  };
};

export const usePlayerActions = () => {
  const playTrack = usePlayerStore(state => state.playTrack);
  const pauseTrack = usePlayerStore(state => state.pauseTrack);
  const toggleShuffleMode = usePlayerStore(state => state.toggleShuffleMode);
  const toggleRepeatMode = usePlayerStore(state => state.toggleRepeatMode);
  const setPlaylist = usePlayerStore(state => state.setPlaylist);
  const updateCurrentIndex = usePlayerStore(state => state.updateCurrentIndex);
  const addToQueue = usePlayerStore(state => state.addToQueue);
  const clearQueue = usePlayerStore(state => state.clearQueue);
  const updateQueue = usePlayerStore(state => state.updateQueue);
  const setIsPlaying = usePlayerStore(state => state.setIsPlaying);
  const setQueue = usePlayerStore(state => state.setQueue);
  const setVolume = usePlayerStore(state => state.setVolume);
  const setMuted = usePlayerStore(state => state.setMuted);
  const shufflePlaylist = usePlayerStore(state => state.shufflePlaylist);
  const resetPlayer = usePlayerStore(state => state.resetPlayer);

  return {
    playTrack,
    pauseTrack,
    toggleShuffleMode,
    toggleRepeatMode,
    setPlaylist,
    updateCurrentIndex,
    addToQueue,
    clearQueue,
    updateQueue,
    setIsPlaying,
    setQueue,
    setVolume,
    setMuted,
    shufflePlaylist,
    resetPlayer,
  };
};

// Notifications selectors
export const useNotifications = () => {
  const notifications = useNotificationsStore(state => state.notifications);
  const unreadCount = useNotificationsStore(state => state.unreadCount);

  return { notifications, unreadCount };
};

export const useNotificationsActions = () => {
  const setNotifications = useNotificationsStore(state => state.setNotifications);
  const addNotification = useNotificationsStore(state => state.addNotification);
  const markAsRead = useNotificationsStore(state => state.markAsRead);
  const clearNotifications = useNotificationsStore(state => state.clearNotifications);
  const markAllAsRead = useNotificationsStore(state => state.markAllAsRead);

  return {
    setNotifications,
    addNotification,
    markAsRead,
    clearNotifications,
    markAllAsRead,
  };
};

// Search selectors
export const useSearch = () => {
  const recentSearches = useSearchStore(state => state.recentSearches);

  return { recentSearches };
};

export const useSearchActions = () => {
  const addRecentSearch = useSearchStore(state => state.addRecentSearch);
  const clearRecentSearches = useSearchStore(state => state.clearRecentSearches);
  const removeRecentSearch = useSearchStore(state => state.removeRecentSearch);

  return {
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
};

// Misc selectors
export const useMisc = () => {
  const onBoarded = useMiscStore(state => state.onBoarded);

  return { onBoarded };
};

export const useMiscActions = () => {
  const updateOnBoarded = useMiscStore(state => state.updateOnBoarded);
  const setOnBoarded = useMiscStore(state => state.setOnBoarded);
  const resetMisc = useMiscStore(state => state.resetMisc);

  return {
    updateOnBoarded,
    setOnBoarded,
    resetMisc,
  };
};

// Legacy compatibility hooks (to ease migration)
export const useAppSelector = <T>(selector: (state: any) => T): T => {
  // This is a compatibility layer - in practice, you should use the specific store hooks above
  const authState = useAuthStore();
  const playerState = usePlayerStore();
  const notificationsState = useNotificationsStore();
  const searchState = useSearchStore();
  const miscState = useMiscStore();

  const combinedState = {
    auth: authState,
    player: playerState,
    notifications: notificationsState,
    search: searchState,
    misc: miscState,
  };

  return selector(combinedState);
};

// Legacy dispatch compatibility
export const useAppDispatch = () => {
  // Return an object with all actions for compatibility
  const authActions = useAuthActions();
  const playerActions = usePlayerActions();
  const notificationsActions = useNotificationsActions();
  const searchActions = useSearchActions();
  const miscActions = useMiscActions();

  return {
    ...authActions,
    ...playerActions,
    ...notificationsActions,
    ...searchActions,
    ...miscActions,
  };
};
