import { useCallback, useRef, useState, useEffect } from "react";
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
import { Track } from "../utils/types";
import { useQuery } from "./useQuery";
import { useAppSelector } from "@/redux/hooks";
import { Audio, AVPlaybackStatus } from "expo-av";

interface AlbumInfo {
  title: string;
  type: "album" | "single" | "ep" | "track";
  coverImage: string;
}

interface TrackData {
  _id: string;
  fileUrl: string;
  duration: number;
}

interface ExtendedTrack extends Track {
  songData: TrackData;
}

interface PlayerState {
  isPlaying: boolean;
  shuffle: boolean;
  repeat: boolean;
  track: ExtendedTrack | null;
  currentTrackId: string | null;
  albumInfo: AlbumInfo | null;
  playlist: ExtendedTrack[];
  currentIndex: number;
  currentTime: number;
  duration: number;
  buffering: boolean;
  volume: number;
}

interface MusicPlayerState {
  tracks: ExtendedTrack[];
  isAlbumPlaying: boolean;
  currentPlayingIndex: number;
  isLiked: boolean;
  isSaved: boolean;
  loading: boolean;
  error: string | null;
  sound: Audio.Sound | null;
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

import { RootState } from "@/redux/store";

// Define types for play and onPlaybackStatusUpdate
type PlayFunction = (track: ExtendedTrack, albumInfo: AlbumInfo, playlist?: ExtendedTrack[]) => Promise<void>;
type PlaybackStatusUpdateFunction = (status: AVPlaybackStatus) => void;

const useMusicPlayer = () => {
  const dispatch = useDispatch();
  const { getTracksFromId, saveAlbum, likeSong, getLikedSongs, getSavedAlbums } = useQuery();
  const [playerState, setPlayerState] = useState({
    currentTime: 0,
    duration: 0,
    buffering: false,
  });
  const soundRef = useRef<Audio.Sound | null>(null);

  const isPlaying = useAppSelector((state: RootState) => state.player.isPlaying);
  const shuffle = useAppSelector((state: RootState) => state.player.shuffle);
  const repeat = useAppSelector((state: RootState) => state.player.repeat);
  const currentTrack = useAppSelector((state: RootState) => state.player.track);
  const currentTrackId = useAppSelector((state: RootState) => state.player.currentTrackId);
  const albumInfo = useAppSelector((state: RootState) => state.player.albumInfo);
  const playlist = useAppSelector((state: RootState) => state.player.playlist);
  const currentIndex = useAppSelector((state: RootState) => state.player.currentIndex);
  const { userdata } = useAppSelector((state: { auth: { userdata: any } }) => state.auth);

  const [state, setState] = useState<MusicPlayerState>({
    tracks: [],
    isAlbumPlaying: false,
    currentPlayingIndex: -1,
    isLiked: false,
    isSaved: false,
    loading: true,
    error: null,
    sound: null,
  });

  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (state.sound) {
        state.sound.unloadAsync();
      }
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    };
  }, []);

  const next = useCallback(async () => {
    if (!playlist || !currentTrack || !albumInfo) return;
    const currentIndex = playlist.findIndex((track) => track._id === currentTrack._id);
    let nextIndex = currentIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
      while (nextIndex === currentIndex && playlist.length > 1) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      }
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    await play(playlist[nextIndex], albumInfo, playlist);
  }, [playlist, currentTrack, albumInfo, shuffle, play]);

  const onPlaybackStatusUpdate: PlaybackStatusUpdateFunction = useCallback(
    (status) => {
      if (!status.isLoaded) return;
      setPlayerState({
        currentTime: status.positionMillis / 1000,
        duration: status.durationMillis ? status.durationMillis / 1000 : 0,
        buffering: status.isBuffering,
      });
      if (status.didJustFinish) {
        if (repeat) {
          soundRef.current?.replayAsync();
        } else {
          next();
        }
      }
    },
    [repeat, next]
  );

 // Update the play function to handle transitions better
const play = useCallback(
    async (track: ExtendedTrack, albumInfo: AlbumInfo, playlist?: ExtendedTrack[]) => {
      try {
        if (!userdata?._id) return;

        // Only stop and unload if we're playing a different track
        if (soundRef.current && currentTrack?._id !== track._id) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Don't create new sound instance if the same track is already playing
        if (currentTrack?._id === track._id && soundRef.current) {
          await soundRef.current.playAsync();
          return;
        }

        // Clear any existing timeouts
        if (streamTimeoutRef.current) {
          clearTimeout(streamTimeoutRef.current);
        }

        dispatch(playTrack({ track, albumInfo, playlist }));
        setState(prev => ({
          ...prev,
          isAlbumPlaying: true,
          currentPlayingIndex: playlist?.findIndex(t => t._id === track._id) ?? -1,
        }));

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: track.songData.fileUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );

        soundRef.current = newSound;
        await storeCurrentTrack(track, albumInfo);

        setState(prev => ({
          ...prev,
          sound: newSound,
          error: null,
          loading: false,
        }));
      } catch (error) {
        console.error("Error playing track:", error);
        setState(prev => ({
          ...prev,
          error: "Failed to play track",
          loading: false,
          isAlbumPlaying: false,
        }));
      }
    },
    [dispatch, userdata?._id, onPlaybackStatusUpdate, currentTrack]
  );

  useEffect(() => {
    return () => {
      // Don't stop playback on component unmount
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    };
  }, []);


  const pause = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      dispatch(pauseTrack());
      setState((prev) => ({ ...prev, isAlbumPlaying: false }));
    } catch (error) {
      console.error("Error pausing track:", error);
    }
  }, [dispatch]);

  const seekTo = useCallback(async (seconds: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(seconds * 1000);
      }
    } catch (error) {
      console.error("Error seeking:", error);
    }
  }, []);

  const previous = useCallback(async () => {
    if (!playlist || !currentTrack || !albumInfo) return;
    const currentIndex = playlist.findIndex((track) => track._id === currentTrack._id);
    let prevIndex = currentIndex;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
      while (prevIndex === currentIndex && playlist.length > 1) {
        prevIndex = Math.floor(Math.random() * playlist.length);
      }
    } else {
      prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    }
    await play(playlist[prevIndex], albumInfo, playlist);
  }, [playlist, currentTrack, albumInfo, shuffle, play]);

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
          isLiked: Array.isArray(likedSongs) && likedSongs.some((song) => song._id === albumId),
          isSaved: type === "album" && Array.isArray(savedAlbums) && savedAlbums.some((album) => album._id === albumId),
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
          await Promise.all([saveAlbum(userdata?._id, id), likeSong(userdata?._id, id)]);
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

  const stop = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      dispatch(pauseTrack());
      setState(prev => ({
        ...prev,
        isAlbumPlaying: false,
        sound: null
      }));
    } catch (error) {
      console.error("Error stopping track:", error);
    }
  }, [dispatch]);

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
    currentTime: playerState.currentTime,
    duration: playerState.duration,
    buffering: playerState.buffering,
    seekTo,
    play,
    pause,
    stop,
    loadAlbumData,
    handleLike,
    toggleShuffle: useCallback(() => dispatch(toggleShuffle()), [dispatch]),
    toggleRepeat: useCallback(() => dispatch(toggleRepeat()), [dispatch]),
    addToQueue: useCallback((track: ExtendedTrack) => dispatch(addToQueue(track)), [dispatch]),
    next,
    previous,
    updatePlaylist: useCallback((tracks: ExtendedTrack[]) => dispatch(setPlaylist(tracks)), [dispatch]),
    getStoredTrack: useCallback(async () => await getStoredTrack(), []),
  };
};

export default useMusicPlayer;
