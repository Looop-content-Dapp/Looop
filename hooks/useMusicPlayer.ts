import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addToQueue,
  pauseTrack,
  playTrack,
  toggleRepeat,
  toggleShuffle,
  setPlaylist,
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
import { RootState } from "@/redux/store";

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

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const setupPlayer = async () => {
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
      });
    };
    setupPlayer();

    const playbackStateListener = async (event: { state: State }) => {
      if (event.state === State.Playing) {
        setIsPlaying(true);
      } else if (event.state === State.Paused || event.state === State.Stopped) {
        setIsPlaying(false);
      }
    };

    const activeTrackChangedListener = async (event: { index?: number }) => {
      if (event.index !== undefined) {
        const track = await TrackPlayer.getTrack(event.index);
        if (track && playlist) {
          const nextTrack = playlist.find((t) => t._id === track.id);
          if (nextTrack && albumInfo) {
            dispatch(playTrack({ track: nextTrack, albumInfo, playlist }));
            setState((prev) => ({
              ...prev,
              currentPlayingIndex: event.index ?? -1,
            }));
          }
        }
      }
    };

    TrackPlayer.addEventListener(Event.PlaybackState, playbackStateListener);
    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, activeTrackChangedListener);

    return () => {
    //   TrackPlayer.remove(Event.PlaybackState);
    //   TrackPlayer.remove(Event.PlaybackActiveTrackChanged);
    };
  }, [dispatch, playlist, albumInfo]);

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
        setIsPlaying(true);
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
      setIsPlaying(false);
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
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error("Error skipping to next:", error);
    }
  }, []);

  const previous = useCallback(async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error("Error skipping to previous:", error);
    }
  }, []);

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
    toggleShuffle: useCallback(() => dispatch(toggleShuffle()), [dispatch]),
    toggleRepeat: useCallback(async () => {
      dispatch(toggleRepeat());
      await TrackPlayer.setRepeatMode(repeat ? RepeatMode.Off : RepeatMode.Track);
    }, [dispatch, repeat]),
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
