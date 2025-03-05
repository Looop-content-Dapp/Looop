import { useCallback, useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addToQueue,
  pauseTrack,
  playTrack,
  toggleRepeat,
  toggleShuffle,
  playNextTrack,
  playPreviousTrack,
  setPlaylist,
} from "../redux/slices/PlayerSlice";
import { Track } from "../utils/types";
import { useRouter } from "expo-router";
import { useQuery } from "./useQuery";
import { useAppSelector } from "@/redux/hooks";

interface AlbumInfo {
  title: string;
  type: "album" | "single" | "ep";
  coverImage: string;
}

interface MusicPlayerState {
  tracks: Track[];
  isAlbumPlaying: boolean;
  currentPlayingIndex: number;
  isLiked: boolean;
  isSaved: boolean;
  loading: boolean;
}

const useMusicPlayer = () => {
  const dispatch = useDispatch();
  const {
    streamSong,
    retrieveUserId,
    getTracksFromId,
    saveAlbum,
    likeSong,
    getLikedSongs,
    getSavedAlbums,
  } = useQuery();

  // Redux state
  const isPlaying = useAppSelector((state) => state.player.isPlaying);
  const shuffle = useSelector((state) => state.player.shuffle);
  const repeat = useSelector((state) => state.player.repeat);
  const currentTrack = useSelector((state) => state.player.track);
  const currentTrackId = useSelector((state) => state.player.currentTrackId);
  const queue = useSelector((state) => state.player.queue);
  const albumInfo = useSelector((state) => state.player.albumInfo);
  const playlist = useSelector((state) => state.player.playlist);
  const currentIndex = useSelector((state) => state.player.currentIndex);
  const { userdata} = useAppSelector((auth) => auth.auth)

  // Local state
  const [state, setState] = useState<MusicPlayerState>({
    tracks: [],
    isAlbumPlaying: false,
    currentPlayingIndex: -1,
    isLiked: false,
    isSaved: false,
    loading: true,
  });

  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storeCurrentTrack = async (track: Track, albumInfo: AlbumInfo) => {
    try {
      await AsyncStorage.setItem("currentTrack", JSON.stringify(track));
      await AsyncStorage.setItem("albumInfo", JSON.stringify(albumInfo));
    } catch (error) {
      console.error("Error saving current track:", error);
    }
  };

  const getStoredTrack = async () => {
    try {
      const [track, albumInfo] = await Promise.all([
        AsyncStorage.getItem("currentTrack"),
        AsyncStorage.getItem("albumInfo"),
      ]);
      return {
        track: track ? JSON.parse(track) : null,
        albumInfo: albumInfo ? JSON.parse(albumInfo) : null,
      };
    } catch (error) {
      console.error("Error retrieving current track:", error);
      return { track: null, albumInfo: null };
    }
  };

  const play = useCallback(
    async (track: Track, albumInfo: AlbumInfo, playlist?: Track[]) => {
      try {
        if (!userdata?._id) return;

        if (streamTimeoutRef.current) {
          clearTimeout(streamTimeoutRef.current);
        }

        await streamSong(track.songData._id, userdata?._id);

        streamTimeoutRef.current = setTimeout(async () => {
          await streamSong(track.songData._id, userdata?._id);
        }, track.duration * 0.9 * 1000);

        dispatch(playTrack({ track, albumInfo, playlist }));
        await storeCurrentTrack(track, albumInfo);

        setState((prev) => ({
          ...prev,
          isAlbumPlaying: true,
          currentPlayingIndex:
            playlist?.findIndex((t) => t._id === track._id) ?? -1,
        }));
      } catch (error) {
        console.error("Error playing track:", error);
        dispatch(playTrack({ track, albumInfo, playlist }));
        await storeCurrentTrack(track, albumInfo);
      }
    },
    [dispatch, streamSong]
  );

  const pause = useCallback(() => {
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }
    dispatch(pauseTrack());
    setState((prev) => ({ ...prev, isAlbumPlaying: false }));
  }, [dispatch]);

  const handlePlayPause = useCallback(
    (tracks: Track[], albumInfo: AlbumInfo) => {
      if (state.isAlbumPlaying) {
        pause();
      } else {
        if (shuffle) {
          const randomIndex = Math.floor(Math.random() * tracks.length);
          play(tracks[randomIndex], albumInfo, tracks);
        } else if (tracks.length > 0) {
          play(tracks[0], albumInfo, tracks);
        }
      }
    },
    [state.isAlbumPlaying, shuffle, play, pause]
  );

  const handleTrackPress = useCallback(
    (track: Track, index: number, albumInfo: AlbumInfo, tracks: Track[]) => {
      play(track, albumInfo, tracks);
    },
    [play]
  );



  const loadAlbumData = useCallback(
    async (albumId: string, type: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        if (!userdata?._id) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        // First get tracks
        const fetchedTracks = await getTracksFromId(albumId);
        console.log("albumId", albumId);
        if (!fetchedTracks?.data?.tracks) {
          throw new Error("Failed to fetch tracks");
        }

        // Then get user preferences with proper error handling
        let likedSongs = [];
        let savedAlbums = [];
        try {
          const [liked, saved] = await Promise.all([
            getLikedSongs(userdata?._id),
            getSavedAlbums(userdata?._id),
          ]);
          likedSongs = liked || [];
          savedAlbums = saved || [];
        } catch (error) {
          console.error("Error fetching user preferences:", error);
          // Continue with empty arrays if preferences fetch fails
        }

        setState((prev) => ({
          ...prev,
          tracks: fetchedTracks.data.tracks,
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
    [getTracksFromId, getLikedSongs, getSavedAlbums]
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
        // Optionally show error to user
      }
    },
    [saveAlbum, likeSong]
  );

  return {
    // State
    ...state,
    isPlaying,
    shuffle,
    repeat,
    currentTrack,
    currentTrackId,
    albumInfo,
    playlist,
    currentIndex,

    // Methods
    play,
    pause,
    handlePlayPause,
    handleTrackPress,
    loadAlbumData,
    handleLike,
    toggleShuffle: useCallback(() => dispatch(toggleShuffle()), [dispatch]),
    toggleRepeat: useCallback(() => dispatch(toggleRepeat()), [dispatch]),
    addToQueue: useCallback(
      (track: Track) => dispatch(addToQueue(track)),
      [dispatch]
    ),
    next: useCallback(() => dispatch(playNextTrack()), [dispatch]),
    previous: useCallback(() => dispatch(playPreviousTrack()), [dispatch]),
    updatePlaylist: useCallback(
      (tracks: Track[]) => dispatch(setPlaylist(tracks)),
      [dispatch]
    ),
    getStoredTrack,
  };
};

export default useMusicPlayer;
