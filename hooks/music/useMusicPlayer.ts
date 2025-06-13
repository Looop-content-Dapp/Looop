import { useQuery } from "@/hooks/core/useQuery";
import { useLibrary } from "@/hooks/music/useLibrary";
import { useAppSelector } from "@/redux/hooks";
import {
  addToQueue,
  pauseTrack,
  playTrack,
  setIsPlaying,
  setMuted,
  setPlaylist,
  setQueue,
  setVolume,
  toggleRepeatMode,
  toggleShuffleMode,
  updateCurrentIndex,
} from "@/redux/slices/PlayerSlice";
import { RootState } from "@/redux/store";
import {
  AlbumInfo,
  ExtendedTrack,
  FormattedTrack,
  MusicPlayerState,
  StreamData,
} from "@/types/player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { useDispatch } from "react-redux";
import useUserInfo from "../user/useUserInfo";

const PLAYBACK_TRACKING_TIMEOUT = 60000; // 1 minute in milliseconds
const SEEK_THRESHOLD = 3; // seconds before track restart on previous

const storeCurrentTrack = async (
  track: ExtendedTrack,
  albumInfo: AlbumInfo
) => {
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

const formatTrack = (
  track: ExtendedTrack,
  albumInfo: AlbumInfo
): FormattedTrack => ({
  id: track._id,
  url: track.songData.fileUrl,
  title: track.title || "Unknown Title",
  artist: track.artist?.name || "Unknown Artist",
  artwork: albumInfo.coverImage,
  duration: track.songData.duration,
  album: albumInfo.title,
  genre: track.genre?.[0] || "",
  date: new Date().toISOString(),
});

const useMusicPlayer = () => {
  const dispatch = useDispatch();
  const {
    getTracksFromId,
    saveAlbum,
    likeSong,
    getLikedSongs,
    getSavedAlbums,
  } = useQuery();
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const {
    queue,
    shuffle,
    repeat,
    track: currentTrack,
    currentTrackId,
    albumInfo,
    playlist,
    currentIndex,
    volume,
    muted,
    isPlaying,
  } = useAppSelector((state: RootState) => state.player);

  const { userdata } = useAppSelector((state: RootState) => state.auth);

  const [state, setState] = useState<MusicPlayerState>({
    tracks: [],
    isAlbumPlaying: false,
    currentPlayingIndex: -1,
    isLiked: false,
    isSaved: false,
    loading: true,
    error: null,
  });

  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);

  const userInfo = useUserInfo();
  const { streamSong } = useLibrary(userdata?._id);

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
        progressUpdateEventInterval: 1,
      });
    };
    setupPlayer();

    const playbackStateListener = async (event: { state: State }) => {
      if (event.state === State.Playing) {
        dispatch(setIsPlaying(true));
      } else if (
        event.state === State.Paused ||
        event.state === State.Stopped
      ) {
        dispatch(setIsPlaying(false));
      }
    };

    const activeTrackChangedListener = async (event: { index?: number }) => {
      if (event.index !== undefined) {
        const track = await TrackPlayer.getTrack(event.index);
        if (track && playlist) {
          const nextTrack = playlist.find((t) => t._id === track.id);
          if (nextTrack && albumInfo) {
            setState((prev) => ({
              ...prev,
              currentPlayingIndex: event.index ?? -1,
            }));
            dispatch(playTrack({ track: nextTrack, albumInfo, playlist }));
          }
        }
      }
    };

    const queueEndedListener = async () => {
      if (repeat) {
        const firstTrack = await TrackPlayer.getTrack(0);
        if (firstTrack && playlist) {
          await TrackPlayer.skip(0);
          await TrackPlayer.play();
        }
      }
    };

    const setupListeners = () => {
      const listeners = [
        TrackPlayer.addEventListener(
          Event.PlaybackState,
          playbackStateListener
        ),
        TrackPlayer.addEventListener(
          Event.PlaybackActiveTrackChanged,
          activeTrackChangedListener
        ),
        TrackPlayer.addEventListener(
          Event.PlaybackQueueEnded,
          queueEndedListener
        ),
      ];

      return () => {
        listeners.forEach((listener) => listener.remove());
      };
    };

    return setupListeners();
  }, [dispatch, playlist, albumInfo, repeat]);

  const play = useCallback(
    async (
      track: ExtendedTrack,
      albumInfo: AlbumInfo,
      playlist?: ExtendedTrack[]
    ) => {
      try {
        console.log("play called", { track, albumInfo, playlist, userdata });
        if (!userdata?._id) {
          console.warn("No user ID, cannot play");
          return;
        }

        setLoadingTrackId(track._id);
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
            dispatch(setIsPlaying(true));
            setLoadingTrackId(null);
            return;
          }
        }

        await TrackPlayer.reset();

        if (playlist) {
          const formattedPlaylist = playlist.map((t) =>
            formatTrack(t, albumInfo)
          );
          await TrackPlayer.add(formattedPlaylist);
          await TrackPlayer.skip(trackIndex);
        } else {
          await TrackPlayer.add(formatTrack(track, albumInfo));
        }

        await TrackPlayer.play();
        dispatch(setIsPlaying(true));
        await storeCurrentTrack(track, albumInfo);

        const streamingTimeout = setTimeout(async () => {
          try {
            const streamData: StreamData = {
              trackId: track.songData._id,
              userId: userdata._id,
              network: userInfo?.network || undefined,
              device: userInfo?.device,
              location: userInfo?.location,
              timestamp: Date.now(),
            };
            await streamSong(streamData);
          } catch (error) {
            console.error("Error recording stream:", error);
          }
        }, PLAYBACK_TRACKING_TIMEOUT);

        const streamingCleanup = TrackPlayer.addEventListener(
          Event.PlaybackTrackChanged,
          () => clearTimeout(streamingTimeout)
        );

        setState((prev) => ({
          ...prev,
          isAlbumPlaying: true,
          currentPlayingIndex: trackIndex,
          error: null,
          loading: false,
        }));

        return () => {
          clearTimeout(streamingTimeout);
          streamingCleanup.remove();
        };
      } catch (error) {
        console.error("Error playing track:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to play track",
          loading: false,
          isAlbumPlaying: false,
        }));
        dispatch(setIsPlaying(false));
      } finally {
        setLoadingTrackId(null);
      }
    },
    [dispatch, userdata?._id, userInfo, streamSong]
  );

  const pause = useCallback(async () => {
    try {
      await TrackPlayer.pause();
      dispatch(setIsPlaying(false));
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
      const currentIndex = await TrackPlayer.getCurrentTrack();

      if (
        queue.length === 0 ||
        currentIndex === null ||
        currentIndex === undefined
      )
        return;

      let nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        if (repeat) {
          nextIndex = 0;
        } else {
          return;
        }
      }

      await TrackPlayer.skip(nextIndex);
      await TrackPlayer.play();
      dispatch(updateCurrentIndex(nextIndex));
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  }, [dispatch, repeat]);

  const previous = useCallback(async () => {
    try {
      const queue = await TrackPlayer.getQueue();
      const currentIndex = await TrackPlayer.getCurrentTrack();
      const position = await TrackPlayer.getProgress().then(
        (progress) => progress.position
      );

      if (currentIndex === null || currentIndex === undefined || !queue.length)
        return;

      if (position > SEEK_THRESHOLD) {
        await TrackPlayer.seekTo(0);
        return;
      }

      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = repeat ? queue.length - 1 : 0;
      }

      await TrackPlayer.skip(prevIndex);
      await TrackPlayer.play();
      dispatch(updateCurrentIndex(prevIndex));
    } catch (error) {
      console.error("Error skipping to previous:", error);
    }
  }, [dispatch, repeat]);

  const toggleShuffle = useCallback(async () => {
    try {
      dispatch(toggleShuffleMode());

      if (!shuffle) {
        const queue = await TrackPlayer.getQueue();
        const currentTrack = await TrackPlayer.getActiveTrackIndex();

        if (!currentTrack || currentTrack === null || !queue.length) return;

        const currentTrackData = queue[currentTrack];
        const remainingTracks = queue.filter(
          (_, index) => index !== currentTrack
        );
        const shuffledTracks = [...remainingTracks].sort(
          () => Math.random() - 0.5
        );
        const newQueue = [currentTrackData, ...shuffledTracks];

        await TrackPlayer.reset();
        await TrackPlayer.add(newQueue);
        await TrackPlayer.skip(0);

        if (isPlaying) {
          await TrackPlayer.play();
        }

        dispatch(setQueue(newQueue as ExtendedTrack[]));
      }
    } catch (error) {
      console.error("Error toggling shuffle:", error);
    }
  }, [dispatch, shuffle, isPlaying]);

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

  const setPlayerVolume = useCallback(
    async (value: number) => {
      try {
        await TrackPlayer.setVolume(value);
        dispatch(setVolume(value));
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    },
    [dispatch]
  );

  const toggleMute = useCallback(async () => {
    try {
      const newMutedState = !muted;
      await TrackPlayer.setVolume(newMutedState ? 0 : volume);
      dispatch(setMuted(newMutedState));
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  }, [dispatch, muted, volume]);

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
        setState((prev) => ({
          ...prev,
          tracks,
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
    [getTracksFromId, userdata?._id]
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

  const updateQueue = useCallback(
    async (newQueue: ExtendedTrack[]) => {
      try {
        if (!albumInfo) return;

        dispatch(setQueue(newQueue));
        await TrackPlayer.reset();

        const formattedTracks = newQueue.map((track) =>
          formatTrack(track, albumInfo)
        );
        await TrackPlayer.add(formattedTracks);

        if (isPlaying) {
          await TrackPlayer.play();
        }
      } catch (error) {
        console.error("Error updating queue:", error);
      }
    },
    [dispatch, albumInfo, isPlaying]
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
    volume,
    muted,
    currentTime: progress.position,
    duration: progress.duration,
    buffering:
      playbackState.state === State.Buffering ||
      playbackState.state === State.Loading,
    loadingTrackId,
    queue,
    play,
    pause,
    stop,
    next,
    previous,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    setVolume: setPlayerVolume,
    toggleMute,
    loadAlbumData,
    handleLike,
    updateQueue,
    updatePlaylist: useCallback(
      (tracks: ExtendedTrack[]) => dispatch(setPlaylist(tracks)),
      [dispatch]
    ),
    addToQueue: useCallback(
      async (track: ExtendedTrack) => {
        if (!albumInfo) return;
        dispatch(addToQueue(track));
        await TrackPlayer.add(formatTrack(track, albumInfo));
      },
      [dispatch, albumInfo]
    ),
    getStoredTrack: useCallback(async () => await getStoredTrack(), []),
  };
};

export default useMusicPlayer;
