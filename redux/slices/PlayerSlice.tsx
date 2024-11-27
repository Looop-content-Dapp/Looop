import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '../../utils/types';

interface PlayerState {
  isPlaying: boolean;
  track: Track | null;
  currentTrackId: string | null;
  queue: Track[];
  shuffle: boolean;
  repeat: boolean;
  recentlyPlayed: Track[];
  albumInfo: {
    title: string;
    type: 'album' | 'single' | 'ep';
    coverImage: string;
  } | null;
  previousTracks: Track[];
  currentIndex: number;
  playlist: Track[];
}

const initialState: PlayerState = {
  isPlaying: false,
  track: null,
  currentTrackId: null,
  queue: [],
  shuffle: false,
  repeat: false,
  recentlyPlayed: [],
  albumInfo: null,
  previousTracks: [],
  currentIndex: 0,
  playlist: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack(state, action: PayloadAction<{
      track: Track;
      albumInfo: {
        title: string;
        type: 'album' | 'single' | 'ep';
        coverImage: string;
      };
      playlist?: Track[];
    }>) {
      const { track, albumInfo, playlist } = action.payload;
      state.track = { ...track, streams: track.streams ?? 0 };
      state.currentTrackId = track._id;
      state.isPlaying = true;
      state.albumInfo = albumInfo;

      if (playlist) {
        state.playlist = playlist;
        state.currentIndex = playlist.findIndex(t => t._id === track._id);
      }

      state.recentlyPlayed.unshift({ ...track, streams: track.streams ?? 0 });
      if (state.recentlyPlayed.length > 10) {
        state.recentlyPlayed.pop();
      }
    },
    pauseTrack: state => {
      state.isPlaying = false;
    },
    toggleShuffle: state => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: state => {
      state.repeat = !state.repeat;
    },
    addToQueue: (state, action: PayloadAction<Track>) => {
      state.queue.push(action.payload);
    },
    clearQueue: state => {
      state.queue = [];
    },
    playFirstOrRandomTrack(state, action: PayloadAction<Track[]>) {
      if (action.payload.length === 0) return;

      let trackToPlay: Track;
      if (state.shuffle) {
        const randomIndex = Math.floor(Math.random() * action.payload.length);
        trackToPlay = action.payload[randomIndex];
      } else {
        trackToPlay = action.payload[0];
      }

      state.track = { ...trackToPlay, streams: trackToPlay.streams ?? 0 };
      state.currentTrackId = trackToPlay._id;
      state.isPlaying = true;

      state.recentlyPlayed.unshift({ ...trackToPlay, streams: trackToPlay.streams ?? 0 });
      if (state.recentlyPlayed.length > 10) {
        state.recentlyPlayed.pop();
      }
    },
    playNextTrack: state => {
      if (state.queue.length > 0) {
        const nextTrack = state.queue.shift()!;
        state.previousTracks.push(state.track!);
        state.track = nextTrack;
        state.currentTrackId = nextTrack._id;
        state.isPlaying = true;
        return;
      }

      if (state.playlist.length === 0) return;

      let nextIndex;
      if (state.shuffle) {
        const availableIndices = Array.from(
          { length: state.playlist.length },
          (_, i) => i
        ).filter(i => i !== state.currentIndex);
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        nextIndex = state.currentIndex + 1;
        if (nextIndex >= state.playlist.length) {
          nextIndex = state.repeat ? 0 : state.currentIndex;
        }
      }

      if (nextIndex !== state.currentIndex) {
        if (state.track) {
          state.previousTracks.push(state.track);
        }
        state.currentIndex = nextIndex;
        state.track = state.playlist[nextIndex];
        state.currentTrackId = state.track._id;
        state.isPlaying = true;
      }
    },
    playPreviousTrack: state => {
      if (state.previousTracks.length > 0) {
        const previousTrack = state.previousTracks.pop()!;
        if (state.track) {
          state.queue.unshift(state.track);
        }
        state.track = previousTrack;
        state.currentTrackId = previousTrack._id;
        state.isPlaying = true;
        if (state.playlist.length > 0) {
          state.currentIndex = state.playlist.findIndex(t => t._id === previousTrack._id);
        }
        return;
      }

      if (state.playlist.length === 0) return;

      let previousIndex = state.currentIndex - 1;
      if (previousIndex < 0) {
        previousIndex = state.repeat ? state.playlist.length - 1 : 0;
      }

      if (previousIndex !== state.currentIndex) {
        state.currentIndex = previousIndex;
        state.track = state.playlist[previousIndex];
        state.currentTrackId = state.track._id;
        state.isPlaying = true;
      }
    },
    setPlaylist: (state, action: PayloadAction<Track[]>) => {
      state.playlist = action.payload;
      state.currentIndex = 0;
    },
  },
});

export const {
  playTrack,
  pauseTrack,
  toggleShuffle,
  toggleRepeat,
  addToQueue,
  clearQueue,
  playFirstOrRandomTrack,
  playNextTrack,
  playPreviousTrack,
  setPlaylist,
} = playerSlice.actions;

export default playerSlice.reducer;
