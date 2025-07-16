// Example usage of the usePlayer hook
// This file demonstrates how to use the player store and hooks

import { usePlayer, usePlayerActions } from '@/stores/hooks';
import { ExtendedTrack, AlbumInfo } from '@/types/player';

// Example component showing how to use the player hooks
export const PlayerExample = () => {
  // Get player state
  const {
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
  } = usePlayer();

  // Get player actions
  const {
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
  } = usePlayerActions();

  // Example functions showing how to use the actions
  const handlePlayTrack = (track: ExtendedTrack, albumInfo: AlbumInfo, playlist?: ExtendedTrack[]) => {
    playTrack({ track, albumInfo, playlist });
  };

  const handlePause = () => {
    pauseTrack();
  };

  const handleToggleShuffle = () => {
    toggleShuffleMode();
  };

  const handleToggleRepeat = () => {
    toggleRepeatMode();
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleAddToQueue = (track: ExtendedTrack) => {
    addToQueue(track);
  };

  const handleClearQueue = () => {
    clearQueue();
  };

  const handleReset = () => {
    resetPlayer();
  };

  // Return JSX or use the state/actions as needed
  return {
    // Player state
    playerState: {
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
    },
    // Player actions
    playerActions: {
      handlePlayTrack,
      handlePause,
      handleToggleShuffle,
      handleToggleRepeat,
      handleVolumeChange,
      handleAddToQueue,
      handleClearQueue,
      handleReset,
    },
  };
};

// Direct store access example (for advanced use cases)
import { usePlayerStore } from '@/stores/playerStore';

export const DirectStoreExample = () => {
  // Direct access to the store
  const playerStore = usePlayerStore();
  
  // You can access state directly
  const currentTrack = playerStore.track;
  const isPlaying = playerStore.isPlaying;
  
  // You can call actions directly
  const playTrack = (track: ExtendedTrack, albumInfo: AlbumInfo) => {
    playerStore.playTrack({ track, albumInfo });
  };
  
  return {
    currentTrack,
    isPlaying,
    playTrack,
  };
};

// Selector-based usage for performance optimization
export const OptimizedPlayerExample = () => {
  // Only subscribe to specific parts of the state
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const currentTrack = usePlayerStore(state => state.track);
  const volume = usePlayerStore(state => state.volume);
  
  // Get only the actions you need
  const playTrack = usePlayerStore(state => state.playTrack);
  const pauseTrack = usePlayerStore(state => state.pauseTrack);
  const setVolume = usePlayerStore(state => state.setVolume);
  
  return {
    isPlaying,
    currentTrack,
    volume,
    playTrack,
    pauseTrack,
    setVolume,
  };
};