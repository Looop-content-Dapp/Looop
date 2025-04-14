import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addToQueue,
  pauseTrack,
  playTrack,
  setPlaylist,
  updateCurrentIndex,
  shufflePlaylist,
  toggleShuffleMode,
  toggleRepeatMode,
  setIsPlaying,
} from "../redux/slices/PlayerSlice";
import { useQuery } from "./useQuery";
import { useAppSelector } from "@/redux/hooks";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Event,
  RepeatMode,
  Capability,
} from "react-native-track-player";
import { RootState, AppDispatch } from "@/redux/store";

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
  release: { artwork: { high: string  } };
}

interface MusicPlayerState {
  tracks: ExtendedTrack[];
  isAlbumPlaying: boolean;
  currentPlayingIndex: number;
  isLiked: boolean;
  isSaved: boolean;
  loading: boolean;
  error: string | null;
}

const storeCurrentTrack = async (track: ExtendedTrack, albumInfo: AlbumInfo) => {
  try {
    await AsyncStorage.setItem("currentTrack", JSON.stringify(track));
    await AsyncStorage.setItem("albumInfo", JSON.stringify(albumInfo));
  } catch (error) {
    console.error("Error storing track:", error);
  }
};

const getStoredTrack = async () => {
  try {
    const track = await AsyncStorage.getItem("currentTrack");
    const album = await AsyncStorage.getItem("albumInfo");
    return {
      track: track ? JSON.parse(track) : null,
      albumInfo: album ? JSON.parse(album) : null,
    };
  } catch (error) {
    console.error("Error retrieving track:", error);
    return { track: null, albumInfo: null };
  }
};

const useMusicPlayer = () => {
  const dispatch = useDispatch();
  const { getTracksFromId, saveAlbum, likeSong, getLikedSongs, getSavedAlbums } =
    useQuery();
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const shuffle = useAppSelector((state: RootState) => state.player.shuffle);
  const repeat = useAppSelector((state: RootState) => state.player.repeat);
  const currentTrack = useAppSelector((state: RootState) => state.player.track);
  const currentTrackId = useAppSelector(
    (state: RootState) => state.player.currentTrackId
  );
  const albumInfo = useAppSelector(
    (state: RootState) => state.player.albumInfo
  );
  const playlist = useAppSelector((state: RootState) => state.player.playlist);
  const currentIndex = useAppSelector(
    (state: RootState) => state.player.currentIndex
  );
  const { userdata } = useAppSelector(
    (state: { auth: { userdata: any } }) => state.auth
  );

  const [state, setState] = useState<MusicPlayerState>({
    tracks: [],
    isAlbumPlaying: false,
    currentPlayingIndex: -1,
    isLiked: false,
    isSaved: false,
    loading: true,
    error: null,
  });

  // Remove this line
  // const [isPlaying, setIsPlaying] = useState(false);

  // Add this selector
  const isPlaying = useAppSelector((state: RootState) => state.player.isPlaying);

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        // Add these options for better control
        jumpInterval: 15,
        progressUpdateEventInterval: 1,
      });
    };
    setupPlayer();

    const playbackStateListener = async (event: { state: State }) => {
      if (event.state === State.Playing) {
        dispatch(setIsPlaying(true));  // Update this
      } else if (event.state === State.Paused || event.state === State.Stopped) {
        dispatch(setIsPlaying(false));  // Update this
      }
    };

    const activeTrackChangedListener = async (event: { index?: number }) => {
      if (event.index !== undefined) {
        const track = await TrackPlayer.getTrack(event.index);
        if (track && playlist) {
          const nextTrack = playlist.find((t) => t._id === track.id);
          if (nextTrack && albumInfo) {
            // Update state before dispatching action
            setState((prev) => ({
              ...prev,
              currentPlayingIndex: event.index ?? -1,
            }));
            dispatch(playTrack({ track: nextTrack, albumInfo, playlist }));
          }
        }
      }
    };

    // Add queue ended listener
    const queueEndedListener = async () => {
      if (repeat) {
        const firstTrack = await TrackPlayer.getTrack(0);
        if (firstTrack && playlist) {
          await TrackPlayer.skip(0);
          await TrackPlayer.play();
        }
      }
    };

    TrackPlayer.addEventListener(Event.PlaybackState, playbackStateListener);
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, activeTrackChangedListener);
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, queueEndedListener);

    return () => {
    //   TrackPlayer.remove([
    //     Event.PlaybackState,
    //     Event.PlaybackActiveTrackChanged,
    //     Event.PlaybackQueueEnded,
    //   ]);
    };
  }, [dispatch, playlist, albumInfo, repeat]);

  // Add a new state for tracking loading states of individual tracks
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);

  const play = useCallback(
    async (track: ExtendedTrack, albumInfo: AlbumInfo, playlist?: ExtendedTrack[]) => {
      try {
        if (!userdata?._id) return;

        // Set loading state for this specific track
        setLoadingTrackId(track._id);

        // Immediately dispatch the track to update UI
        dispatch(playTrack({ track, albumInfo, playlist }));

        const trackIndex = playlist?.findIndex((t) => t._id === track._id) ?? 0;

        const currentState = await TrackPlayer.getPlaybackState();
        if (currentState.state === State.Playing) {
          await TrackPlayer.pause();
        }

        const queue = await TrackPlayer.getQueue();
        const isInQueue = queue.some((t) => t.id === track._id);

        if (isInQueue) {
          const index = queue.findIndex((t) => t.id === track._id);
          if (index !== -1) {
            await TrackPlayer.skip(index);
            await TrackPlayer.play();
            setIsPlaying(true);
            setLoadingTrackId(null);
            return;
          }
        }

        await TrackPlayer.reset();

        const formattedTrack = {
          id: track._id,
          url: track.songData.fileUrl,
          title: track.title || "Unknown Title",
          artist: track.artist?.name || "Unknown Artist",
          artwork: albumInfo.coverImage,
          duration: track.songData.duration,
          album: albumInfo.title,
          genre: "",
          date: new Date().toISOString(),
        };

        if (playlist) {
          const formattedPlaylist = playlist.map((t) => ({
            id: t._id,
            url: t.songData.fileUrl,
            title: t.title || "Unknown Title",
            artist: t.artist?.name || "Unknown Artist",
            artwork: albumInfo.coverImage,
            duration: t.songData.duration,
            album: albumInfo.title,
            genre: "",
            date: new Date().toISOString(),
          }));
          await TrackPlayer.add(formattedPlaylist);
          await TrackPlayer.skip(trackIndex);
        } else {
          await TrackPlayer.add(formattedTrack);
        }

        await TrackPlayer.play();
        dispatch(setIsPlaying(true));  // Update this
        await storeCurrentTrack(track, albumInfo);

        setState((prev) => ({
          ...prev,
          isAlbumPlaying: true,
          currentPlayingIndex: trackIndex,
          error: null,
          loading: false,
        }));
      } catch (error) {
        console.error("Error playing track:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to play track",
          loading: false,
          isAlbumPlaying: false,
        }));
        setIsPlaying(false);
      } finally {
        setLoadingTrackId(null);
      }
    },
    [dispatch, userdata?._id, albumInfo, playlist]
  );

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
      dispatch(setIsPlaying(false));  // Update this
      dispatch(pauseTrack());
      setState((prev) => ({ ...prev, isAlbumPlaying: false }));
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  }, [dispatch]);

  const stop = useCallback(async () => {
    try {
      await TrackPlayer.reset();
      dispatch(pauseTrack());
      setState((prev) => ({
        ...prev,
        isAlbumPlaying: false,
      }));
    } catch (error) {
      console.error("Error stopping track:", error);
    }
  }, [dispatch]);

  const next = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getActiveTrackIndex();

      // Changed condition to check if queue is empty or currentIndex is invalid
      if (queue.length === 0 || currentIndex === null || currentIndex === undefined) return;

      // Calculate next index based on shuffle state
      let nextIndex = currentIndex;
      if (shuffle) {
        const availableIndices = Array.from(
          { length: queue.length },
          (_, i) => i
        ).filter(i => i !== currentIndex);
        nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        nextIndex = (currentIndex + 1) % queue.length;
      }

      // Update UI immediately
      if (playlist && playlist.length > 0) {
        const nextTrack = playlist[nextIndex];
        if (nextTrack && albumInfo) {
          dispatch(playTrack({ track: nextTrack, albumInfo, playlist }));
          dispatch(updateCurrentIndex(nextIndex));
        }
      }

      await TrackPlayer.skip(nextIndex);
      const playerState = await TrackPlayer.getState();
      if (playerState !== State.Playing) {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  }, [dispatch, playlist, albumInfo, shuffle]);

  const previous = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getActiveTrackIndex();
      const position = await TrackPlayer.getProgress().then((progress) => progress.position);

      if (!currentIndex || currentIndex === null || !queue.length) return;

      // If current position > 3 seconds, restart track
      if (position > 3) {
        await TrackPlayer.seekTo(0);
        return;
      }

      // Calculate previous index
      const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;

      // Update UI immediately
      if (playlist) {
        const prevTrack = playlist[prevIndex];
        if (prevTrack && albumInfo) {
          dispatch(playTrack({ track: prevTrack, albumInfo, playlist }));
          dispatch(updateCurrentIndex(prevIndex));
        }
      }

      await TrackPlayer.skip(prevIndex);
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error skipping to previous:", error);
    }
  }, [dispatch, playlist, albumInfo]);

  const toggleShuffle = useCallback(async () => {
    try {
      dispatch(toggleShuffleMode());
      if (!shuffle) {
        await (dispatch as AppDispatch)(shufflePlaylist()).unwrap();

        // Update TrackPlayer queue
        const currentTrack = await TrackPlayer.getActiveTrackIndex();
        if (currentTrack && currentTrack !== null && playlist) {
          await TrackPlayer.reset();
          const formattedTracks = playlist.map(track => ({
            id: track._id,
            url: track.songData.fileUrl,
            title: track.title || "Unknown Title",
            artist: track.artist?.name || "Unknown Artist",
            artwork: albumInfo?.coverImage,
            duration: track.songData.duration,
            album: albumInfo?.title,
          }));
          await TrackPlayer.add(formattedTracks);
          await TrackPlayer.skip(currentTrack);
          if (isPlaying) {
            await TrackPlayer.play();
          }
        }
      }
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  }, [dispatch, shuffle, playlist, albumInfo, isPlaying]);

  const toggleRepeat = useCallback(async () => {
    try {
      dispatch(toggleRepeatMode());
      const newRepeatMode = repeat ? RepeatMode.Off : RepeatMode.Track;
      await TrackPlayer.setRepeatMode(newRepeatMode);
    } catch (error) {
      console.error("Error toggling repeat:", error);
    }
  }, [dispatch, repeat]);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  }, []);

  const loadAlbumData = useCallback(
    async (albumId: string, type: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        if (!userdata?._id) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }
        const fetchedTracks = await getTracksFromId(albumId);
        if (!fetchedTracks?.data?.tracks) {
          throw new Error("Failed to fetch tracks");
        }
        const tracks = fetchedTracks.data.tracks as ExtendedTrack[];
        const [likedSongs, savedAlbums] = await Promise.all([
          getLikedSongs(userdata?._id).catch(() => []),
          getSavedAlbums(userdata?._id).catch(() => []),
        ]);
        setState((prev) => ({
          ...prev,
          tracks,
          isLiked:
            Array.isArray(likedSongs) &&
            likedSongs.some((song) => song._id === albumId),
          isSaved:
            type === "album" &&
            Array.isArray(savedAlbums) &&
            savedAlbums.some((album) => album._id === albumId),
          loading: false,
        }));
      } catch (error) {
        console.error("Error loading album data:", error);
        setState((prev) => ({
          ...prev,
          tracks: [],
          isLiked: false,
          isSaved: false,
          loading: false,
        }));
      }
    },
    [getTracksFromId, getLikedSongs, getSavedAlbums, userdata?._id]
  );

  const handleLike = useCallback(
    async (id: string, type: string) => {
      try {
        if (!userdata?._id) return;
        if (type === "album") {
          await Promise.all([
            saveAlbum(userdata?._id, id),
            likeSong(userdata?._id, id),
          ]);
          setState((prev) => ({ ...prev, isSaved: true, isLiked: true }));
        } else {
          await likeSong(userdata?._id, id);
          setState((prev) => ({ ...prev, isLiked: true }));
        }
      } catch (error) {
        console.error("Error liking/saving:", error);
      }
    },
    [saveAlbum, likeSong, userdata?._id]
  );

  return {
    ...state,
    isPlaying,
    shuffle,
    repeat,
    currentTrack,
    currentTrackId,
    albumInfo,
    playlist,
    currentIndex,
    currentTime: progress.position,
    duration: progress.duration,
    buffering:
    playbackState.state !== undefined &&
    (playbackState.state === State.Buffering || playbackState.state === State.Loading),
    seekTo,
    play,
    pause,
    stop,
    loadAlbumData,
    handleLike,
    toggleShuffle,
    toggleRepeat,
    addToQueue: useCallback(
      async (track: ExtendedTrack) => {
        if (!albumInfo) return;
        dispatch(addToQueue(track));
        await TrackPlayer.add({
          id: track._id,
          url: track.songData.fileUrl,
          title: track.title || "Unknown Title",
          artist: track.artist?.name || "Unknown Artist",
          artwork: albumInfo.coverImage,
          duration: track.songData.duration,
          album: albumInfo.title,
          genre: "",
          date: new Date().toISOString(),
        });
      },
      [dispatch, albumInfo]
    ),
    next,
    previous,
    updatePlaylist: useCallback(
      (tracks: ExtendedTrack[]) => dispatch(setPlaylist(tracks)),
      [dispatch]
    ),
    getStoredTrack: useCallback(async () => await getStoredTrack(), []),
    loadingTrackId, // Add this to the return object
  };
};

export default useMusicPlayer;
