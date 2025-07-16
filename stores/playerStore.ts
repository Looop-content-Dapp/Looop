import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlbumInfo, ExtendedTrack } from '@/types/player';

interface PlayerState {
  track: ExtendedTrack | null;
  currentTrackId: string | null;
  albumInfo: AlbumInfo | null;
  playlist: ExtendedTrack[] | null;
  currentIndex: number;
  shuffle: boolean;
  repeat: boolean;
  queue: ExtendedTrack[];
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  loading: boolean;
  error: string | null;
}

interface PlayerActions {
  playTrack: (payload: {
    track: ExtendedTrack;
    albumInfo: AlbumInfo;
    playlist?: ExtendedTrack[];
  }) => void;
  pauseTrack: () => void;
  toggleShuffleMode: () => void;
  toggleRepeatMode: () => void;
  setPlaylist: (playlist: ExtendedTrack[]) => void;
  updateCurrentIndex: (index: number) => void;
  addToQueue: (track: ExtendedTrack) => void;
  clearQueue: () => void;
  updateQueue: (queue: ExtendedTrack[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setQueue: (queue: ExtendedTrack[]) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  shufflePlaylist: () => void;
  resetPlayer: () => void;
}

type PlayerStore = PlayerState & PlayerActions;

const initialState: PlayerState = {
  track: null,
  currentTrackId: null,
  albumInfo: null,
  playlist: null,
  currentIndex: -1,
  shuffle: false,
  repeat: false,
  queue: [],
  isPlaying: false,
  volume: 1,
  muted: false,
  loading: false,
  error: null,
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      playTrack: (payload) => {
        const { track, albumInfo, playlist } = payload;
        set((state) => {
          const newState: Partial<PlayerState> = {
            track,
            currentTrackId: track._id,
            albumInfo,
            isPlaying: true,
          };
          
          if (playlist) {
            newState.playlist = playlist;
            newState.currentIndex = playlist.findIndex((t) => t._id === track._id);
          }
          
          return newState;
        });
      },
      
      pauseTrack: () => set({ isPlaying: false }),
      
      toggleShuffleMode: () => set((state) => ({ shuffle: !state.shuffle })),
      
      toggleRepeatMode: () => set((state) => ({ repeat: !state.repeat })),
      
      setPlaylist: (playlist) => set({ playlist }),
      
      updateCurrentIndex: (currentIndex) => set({ currentIndex }),
      
      addToQueue: (track) => set((state) => ({ 
        queue: [...state.queue, track] 
      })),
      
      clearQueue: () => set({ queue: [] }),
      
      updateQueue: (queue) => set({ queue }),
      
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      
      setQueue: (queue) => set({ queue }),
      
      setVolume: (volume) => set({ 
        volume, 
        muted: volume === 0 ? true : false 
      }),
      
      setMuted: (muted) => set({ muted }),
      
      shufflePlaylist: () => {
        const state = get();
        const { playlist, currentTrackId } = state;
        
        if (!playlist || !currentTrackId) return;
        
        // Keep current track and shuffle the rest
        const currentTrack = playlist.find((t) => t._id === currentTrackId);
        const remainingTracks = playlist.filter((t) => t._id !== currentTrackId);
        
        // Shuffle remaining tracks
        for (let i = remainingTracks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingTracks[i], remainingTracks[j]] = [
            remainingTracks[j],
            remainingTracks[i],
          ];
        }
        
        // Reconstruct playlist with current track at current position
        const currentIndex = state.currentIndex;
        const shuffledPlaylist = [
          ...remainingTracks.slice(0, currentIndex),
          currentTrack!,
          ...remainingTracks.slice(currentIndex),
        ];
        
        set({ playlist: shuffledPlaylist });
      },
      
      resetPlayer: () => set(initialState),
    }),
    {
      name: 'player-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist player state
      partialize: (state) => ({
        track: state.track,
        currentTrackId: state.currentTrackId,
        albumInfo: state.albumInfo,
        playlist: state.playlist,
        currentIndex: state.currentIndex,
        shuffle: state.shuffle,
        repeat: state.repeat,
        queue: state.queue,
        volume: state.volume,
        muted: state.muted,
      }),
    }
  )
);

// Export the store instance for direct access if needed
export const playerStore = usePlayerStore;

// Export store state getter for compatibility
export const getPlayerState = () => usePlayerStore.getState();

// Export store actions for direct access
export const playerActions = {
  playTrack: (payload: Parameters<PlayerStore['playTrack']>[0]) => usePlayerStore.getState().playTrack(payload),
  pauseTrack: () => usePlayerStore.getState().pauseTrack(),
  toggleShuffleMode: () => usePlayerStore.getState().toggleShuffleMode(),
  toggleRepeatMode: () => usePlayerStore.getState().toggleRepeatMode(),
  setPlaylist: (playlist: ExtendedTrack[]) => usePlayerStore.getState().setPlaylist(playlist),
  updateCurrentIndex: (index: number) => usePlayerStore.getState().updateCurrentIndex(index),
  addToQueue: (track: ExtendedTrack) => usePlayerStore.getState().addToQueue(track),
  clearQueue: () => usePlayerStore.getState().clearQueue(),
  updateQueue: (queue: ExtendedTrack[]) => usePlayerStore.getState().updateQueue(queue),
  setIsPlaying: (isPlaying: boolean) => usePlayerStore.getState().setIsPlaying(isPlaying),
  setQueue: (queue: ExtendedTrack[]) => usePlayerStore.getState().setQueue(queue),
  setVolume: (volume: number) => usePlayerStore.getState().setVolume(volume),
  setMuted: (muted: boolean) => usePlayerStore.getState().setMuted(muted),
  shufflePlaylist: () => usePlayerStore.getState().shufflePlaylist(),
  resetPlayer: () => usePlayerStore.getState().resetPlayer(),
};