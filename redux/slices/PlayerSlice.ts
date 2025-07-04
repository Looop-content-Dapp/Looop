import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import TrackPlayer from 'react-native-track-player';

// Add these imports at the top
interface AlbumInfo {
  title: string;
  type: "album" | "single" | "ep";
  coverImage: string;
}

interface TrackData {
  _id: string;
  fileUrl: string;
  duration: number;
}

interface ExtendedTrack {
  _id: string;
  title: string;
  artist: { name: string };
  songData: TrackData;
  release: { artwork: { high: string } };
}

interface PlayerState {
  track: ExtendedTrack | null;
  currentTrackId: string | null;
  albumInfo: AlbumInfo | null;
  playlist: ExtendedTrack[] | null;
  currentIndex: number;
  shuffle: boolean;
  repeat: boolean;
  queue: ExtendedTrack[];
  isPlaying: boolean;  // Add this new property
}

const initialState: PlayerState = {
  track: null,
  currentTrackId: null,
  albumInfo: null,
  playlist: null,
  currentIndex: -1,
  shuffle: false,
  repeat: false,
  queue: [] as ExtendedTrack[],
  isPlaying: false,  // Add this new property
};

export const shufflePlaylist = createAsyncThunk(
  'player/shufflePlaylist',
  async (_, { getState, dispatch }) => {
    const state = getState() as { player: PlayerState };
    const { playlist, currentTrackId } = state.player;

    if (!playlist || !currentTrackId) return;

    // Keep current track and shuffle the rest
    const currentTrack = playlist.find(t => t._id === currentTrackId);
    const remainingTracks = playlist.filter(t => t._id !== currentTrackId);

    // Shuffle remaining tracks
    for (let i = remainingTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingTracks[i], remainingTracks[j]] = [remainingTracks[j], remainingTracks[i]];
    }

    // Reconstruct playlist with current track at current position
    const currentIndex = state.player.currentIndex;
    const shuffledPlaylist = [
      ...remainingTracks.slice(0, currentIndex),
      currentTrack!,
      ...remainingTracks.slice(currentIndex)
    ];

    return shuffledPlaylist;
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack: (state, action: PayloadAction<{
      track: ExtendedTrack;
      albumInfo: AlbumInfo;
      playlist?: ExtendedTrack[];
    }>) => {
      state.track = action.payload.track;
      state.currentTrackId = action.payload.track._id;
      state.albumInfo = action.payload.albumInfo;
      if (action.payload.playlist) {
        state.playlist = action.payload.playlist;
        state.currentIndex = state.playlist.findIndex(
          (t) => t._id === action.payload.track._id
        );
      }
    },
    pauseTrack: (state) => {
      // Keep track info but update playing state in component
    },
    toggleShuffleMode: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeatMode: (state) => {
      state.repeat = !state.repeat;
      // Repeat mode will be handled in the hook
    },
    setPlaylist: (state, action: PayloadAction<ExtendedTrack[]>) => {
      state.playlist = action.payload;
    },
    updateCurrentIndex: (state, action: PayloadAction<number>) => {
      state.currentIndex = action.payload;
    },
    addToQueue: (state, action: PayloadAction<ExtendedTrack>) => {
      state.queue.push(action.payload);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    updateQueue: (state, action: PayloadAction<ExtendedTrack[]>) => {
      state.queue = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setQueue: (state, action: PayloadAction<ExtendedTrack[]>) => {
        state.queue = action.payload;
      },
  },
  extraReducers: (builder) => {
    builder.addCase(shufflePlaylist.fulfilled, (state, action) => {
      if (action.payload) {
        state.playlist = action.payload;
      }
    });
  },
});

export const {
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
  setQueue
} = playerSlice.actions;

export default playerSlice.reducer;
