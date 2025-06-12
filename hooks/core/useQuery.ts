import api from "@/config/apiConfig";
import useUserInfo from "@/hooks/user/useUserInfo";
import { StreamData } from "@/types/player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback, useState } from "react";

// -----------------------------
// TypeScript Interfaces
// -----------------------------

interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
  sort?: "relevance" | "recent" | "popular";
  category?: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: {
    tracks: SearchSection;
    artists: SearchSection;
    releases: SearchSection;
    playlists: SearchSection;
  };
  metadata: {
    query: string;
    pagination: {
      current: number;
      limit: number;
      totalResults: number;
    };
  };
}

interface SearchSection {
  items: any[];
  total: number;
  hasMore: boolean;
}

interface PlaylistData {
  title: string;
  description: string;
  userId: string;
  image: string;
  coverImage: string;
  genreId: string;
  isPublic: boolean;
}
interface UserData {
  message: string;
  data: {
    _id: string;
    email: string;
    username: string;
    profileImage: string;
    bio: string;
    isPremium: boolean;
    tel?: number;
    following: number;
    friendsCount: number;
    artistPlayed: number;
    faveArtists: any[];
    preferences: any[];
    createdAt: string;
    updatedAt: string;
  };
}

interface PlaylistResponse {
  id: string;
  title: string;
  description: string;
  userId: string;
  image: string;
  coverImage: string;
  genreId: string;
  isPublic: boolean;
}

interface CommunityData {
  name: string;
  description: string;
  artistId: string;
  coverImage: string;
  collectibleName: string;
  collectibleImage: string;
}

interface PostData {
  content: string;
  media: {
    type: "image" | "video" | "audio" | "gif";
    url: string;
    thumbnailUrl?: string;
    duration?: number;
    mimeType?: string;
    size?: number;
    width?: number;
    height?: number;
  }[];
  artistId: string;
  tags?: string[];
  category: "artwork" | "music" | "photography" | "design" | "other";
  visibility?: "public" | "private" | "unlisted";
  status?: "draft" | "published" | "archived";
  genre?: string;
}

interface CommentData {
  userId: string;
  postId: string;
  itemType: "reply" | "comment";
  content: string;
  createdAt: string;
}

interface LikeData {
  userId: string;
  postId: string;
  itemType: "post" | "comment";
}

interface Friend {
  id: string;
  name: string;
  // Add other relevant fields
}

interface AlbumOrEP {
  id: string;
  title: string;
  artistId: string;
  releaseDate: string;
  type: "album" | "ep"; // Adjust based on your API's response
  // Add other relevant fields
}

interface AlbumsAndEPResponse {
  albums: AlbumOrEP[];
  eps: AlbumOrEP[];
  // Adjust based on your API's response structure
}
interface ArtistCommunity {
  _id: string;
  name: string;
  description: string;
  coverImage: string;
  tribePass: {
    collectibleName: string;
    collectibleDescription: string;
    collectibleImage: string;
  };
  memberCount: number;
  status: string;
}

interface Artist {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  genre: string;
  verified: boolean;
  bio: string;
  communities: ArtistCommunity[];
  communityCount: number;
}

interface ArtistCommunitiesResponse {
  message: string;
  data: {
    preferences: {
      genreId: string;
      genreName: string;
    }[];
    artists: Artist[];
  };
}

export const useQuery = () => {
  const [hasCreatedAccount, setHasCreatedAccount] = useState(false);
  const { device, network, location } = useUserInfo();
  const [userID, setUserID] = useState("");

  // -----------------------------
  // Authentication Functions
  // -----------------------------

  // Create Account
  const createAccount = useCallback(
    async (_email: string, password: string, _username: string) => {
      try {
        const response = await api.post(`/api/user/createuser`, {
          email: _email,
          password: password,
          username: _username,
        });

        return response?.data;
      } catch (error: any) {
        console.error("Error creating account:", error.message);
      }
    },
    []
  );

  const checkUsername = async (param: any) => {
    try {
      const response = await api.post(`/api/user/check`, param);
      return response.data;
    } catch (error) {
      console.log("Error checking username:", error);
    }
  };

  const getUserByEmail = useCallback(async (email: string) => {
    try {
      const response = await axios.get(`/api/user/email/${email}`);
      console.log("User data fetched by email successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  }, []);

  // Store User ID
  const storeUserId = async (userId: string) => {
    try {
      await AsyncStorage.setItem("userId", userId);
      setUserID(userId);
      console.log("User ID stored successfully.");
    } catch (error) {
      console.error("Error storing user ID:", error);
    }
  };

  // Retrieve User ID
  const retrieveUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId !== null) {
        console.log("User ID retrieved:", userId);
        setUserID(userId);
        return userId;
      }
      console.log("No user ID found.");
      return null;
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  };

  // Delete User ID
  const deleteUserId = async () => {
    try {
      await AsyncStorage.removeItem("userId");
      console.log("User ID deleted successfully.");
    } catch (error) {
      console.error("Error deleting user ID:", error);
    }
  };

  // -----------------------------
  // User Preference Functions
  // -----------------------------

  // Save User Preferences
  const saveUserPreference = useCallback(
    async (id: string, genre: string[]) => {
      try {
        console.log("Sending data:", { userId: id, genres: genre });
        const response = await api.post(`/api/user/creategenresforuser`, {
          userId: id,
          preferences: genre,
        });
        console.log("Response from saving user preferences:", response.data);
        return true;
      } catch (error) {
        console.log("error saving genre");
      }
    },
    []
  );

  // Save User Favorite Artists
  const saveUserFavoriteArtists = useCallback(
    async (id: string, artists: string[]) => {
      try {
        const response = await axios.post(
          `/api/user/createuserfaveartistbasedongenres`,
          {
            userId: id,
            faveArtist: artists,
          }
        );
        console.log(
          "The response from saving user favorite artists",
          response.data
        );
        return true;
      } catch (error) {
        console.error("Error save User Favorite Artists:", error);
      }
    },
    []
  );

  // -----------------------------
  // Artist Interaction Functions
  // -----------------------------

  // Subscribe to Artist
  const subscribeToArtist = useCallback(
    async (userId: string, artistId: string) => {
      try {
        const response = await api.post(
          `/api/user/subcribetoartist/${userId}/${artistId}`
        );
        console.log("The response from subscribing to artist", response.data);
        return true;
      } catch (error) {
        console.error("Error subscribe To Artist:", error);
      }
    },
    []
  );

  // Follow Artist
  const followArtist = useCallback(async (userId: string, artistId: string) => {
    try {
      const response = await api.post(
        `/api/artist/follow/${userId}/${artistId}`
      );
      console.log("Response from following artist:", response);
      return response.data;
    } catch (error) {
      console.error("Error follow Artist:", error);
    }
  }, []);

  // Check if User is Following an Artist
  const isFollowingArtist = async (userId: string, artistId: string) => {
    try {
      const response = await api.get(
        `/api/user/isfollowing/${userId}/${artistId}`
      );
      return response.data.bool; // Assuming the endpoint returns a boolean
    } catch (error) {
      console.error("Error checking isFollowing Artist:", error);
    }
  };

  // Get Artists Based on User Genre
  const getArtistBasedOnGenre = useCallback(async (id: string) => {
    try {
      const response = await api.get(
        `/api/user/getartistbasedonusergenre/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getArtistBasedOnGenre:", error);
    }
  }, []);

  // Get User Subscriptions
  const getUserSubscriptions = useCallback(async (id: string) => {
    try {
      const response = await api.get(
        `/api/user/getartistusersubcribedto/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getUserSubscriptions:", error);
    }
  }, []);

  // Fetch Artists the User is Following
  const fetchFollowingArtists = async (userId: string) => {
    try {
      const response = await api.get(`/api/artist/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetchFollowingArtists:", error);
    }
  };

  const getArtistDetails = async (artistId: string) => {
    try {
      const response = await api.get(`/api/artist/${artistId}`);
      // console.log("Artist details fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error fetching artist details: --->>>", error);
    }
  };

  // -----------------------------
  // Music Data Functions
  // -----------------------------

  // Get All Releases
  const getAllReleases = useCallback(async () => {
    try {
      const response = await api.get(`/api/song/releases/all`);
      return response.data;
    } catch (error) {
      console.log("Error getting all releases:", error);
    }
  }, []);

  // Get All Artists
  const getAllArtists = useCallback(async () => {
    try {
      const response = await api.get(`/api/artist`);
      return response.data;
    } catch (error) {
      console.log("Error getting all artists:", error);
    }
  }, []);

  // Get Genres
  const getGenres = useCallback(async () => {
    try {
      const response = await api.get(`/api/genre/getgenres`);
      return response.data;
    } catch (error) {
      console.log("Error getting genres:", error);
    }
  }, []);

  const getTracksFromId = async (id: string) => {
    try {
      const response = await api.get(`/tracks/${id}`);
      return await response;
    } catch (error) {
      console.error("Error fetching tracks:", error);
      throw error;
    }
  };

  // -----------------------------
  // Song Interaction Functions
  // -----------------------------
  /**
   * Saves an album for a user.
   * @param {string} userId - The ID of the user saving the album.
   * @param {string} albumId - The ID of the album to save.
   * @returns {Promise<Object>} Response data from the API.
   */
  const saveAlbum = async (userId: string, albumId: string) => {
    try {
      const response = await api.get(`/albums/${albumId}/save`);
      return await response;
    } catch (error) {
      console.error("Error saving album:", error);
      throw error;
    }
  };

  /**
   * Gets the saved albums for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Object>} Response data from the API containing saved albums.
   */
  const getSavedAlbums = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(`/api/song/library/saved/${userId}`);
      console.log("Saved albums fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching saved albums:", error);
    }
  }, []);

  /**
   * Likes a song for a user.
   * @param {string} userId - The ID of the user liking the song.
   * @param {string} songId - The ID of the song to like.
   * @returns {Promise<Object>} Response data from the API.
   */
  const likeSong = async (userId: string, songId: string) => {
    try {
      const response = await fetch(`tracks/${songId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error liking song:", error);
      throw error;
    }
  };

  /**
   * Gets the liked songs for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Object>} Response data from the API containing liked songs.
   */
  const getLikedSongs = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(
        `/api/song/insights/top-songs/${userId}`
      );
      console.log("Liked songs fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  }, []);

  // Search Songs
  const searchSongs = useCallback(async (query: string) => {
    try {
      const response = await axios.get(`/api/song/search`, {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching songs:", error);
    }
  }, []);

  // Get Top Songs for Artist
  const getTopSongsForArtist = useCallback(async (artistId: string) => {
    try {
      const response = await api.get(`/api/song/artist/${artistId}/top-songs`);
      return response.data;
    } catch (error) {
      console.error("Error fetching top songs for artist:", error);
    }
  }, []);

  // Get songs for users
  const getSongsForUser = useCallback(async () => {
    try {
      const uId = await retrieveUserId();
      const response = await api.get(`/api/song/artisttheyfollow/${uId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching songs for user:", error);
    }
  }, []);

  // Get Singles for Artist
  const getSinglesForArtist = useCallback(async (artistId: string) => {
    try {
      const response = await api.get(`/api/song/artist/${artistId}/singles`);
      return response.data;
    } catch (error) {
      console.error("Error fetching singles for artist:", error);
    }
  }, []);

  /**
   * Retrieves albums and EPs associated with a specific ID (e.g., artistId).
   * @param id - The identifier (e.g., artistId) to fetch albums and EPs for.
   * @returns Data containing albums and EPs.
   */
  const getAlbumsAndEP = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/api/song/artist/${id}/albums-eps`);
      return response.data;
    } catch (error) {
      console.error("Error fetching albums and EPs:", error);
    }
  }, []);

  // Get Release Based on Genres
  const getReleaseBasedOnGenres = useCallback(async (genreId: string) => {
    try {
      const response = await axios.get(
        `/api/song/getreleasebasedongenres/${genreId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting releases based on genres:", error);
    }
  }, []);

  // Stream Song
  const streamSong = useCallback(
    async (
      songId: string,
      userId: string,
      streamData = {
        completionRate: 0,
        timestamp: new Date().toISOString(),
        offline: !network?.isConnected,
        deviceType: device?.modelName || "unknown",
        quality: network?.isWifi ? "high" : "standard",
        region: location?.region,
      }
    ) => {
      console.log("song id", songId);
      try {
        const response = await axios.post(
          `/api/song/stream/${songId}/${userId}`,
          streamData
        );

        console.log("Stream recorded successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error streaming song:", error);
        return null;
      }
    },
    [device, network]
  );

  // Get User Preference
  const getUserPreference = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(`/api/preference/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user preference:", error);
    }
  }, []);

  // Get Song Artist Featured On
  const getSongArtistFeaturedOn = useCallback(async (songId: string) => {
    try {
      const response = await axios.get(
        `/api/song/getsongartistfeaturedon/${songId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting song artist featured on:", error);
    }
  }, []);

  // Get Last Played Songs
  const getLastPlayedSongs = useCallback(async (userId: string) => {
    try {
      const response = await api.get(`/api/song/history/last-played/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting last played songs:", error);
    }
  }, []);

  // Get Top 100 Songs
  const getTop100Songs = useCallback(async () => {
    try {
      const response = await axios.get(`/api/song/gettopp100songs`);
      return response.data;
    } catch (error) {
      console.error("Error getting top 100 songs:", error);
    }
  }, []);

  // Follow Artist by ID (Different from the existing followArtist function)
  const followArtistById = useCallback(async (artistId: string) => {
    try {
      const response = await axios.post(`/api/artist/follow/${artistId}`);
      console.log("Response from following artist by ID:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error following artist by ID:", error);
    }
  }, []);

  // -----------------------------
  // Playlist Management Functions
  // -----------------------------

  /**
   * Creates a new playlist with detailed information.
   * @param playlistData - Data for the new playlist.
   * @returns Response data from the API.
   */
  const createPlaylist = useCallback(
    async (_title: string, _userId: string) => {
      try {
        const response = await axios.post(`/api/playlist/create`, {
          title: _title,
          userId: _userId,
        });
        console.log("Playlist created:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error creating playlist:", error);
      }
    },
    []
  );

  /**
   * Adds a song to an existing playlist with necessary details.
   * @param {string} trackId - The track's ID.
   * @param {string} playlistId - The playlist's ID.
   * @param {string} userId - The user's ID.
   * @returns {Promise<Object>} - Response data from the API.
   */
  const addSongToPlaylist = useCallback(
    async (_trackId: string, _playlistId: string, _userId: string) => {
      try {
        const payload = {
          tracks: _trackId,
          playlistId: _playlistId,
          userId: _userId,
        };
        const response = await axios.post(`/api/playlist/songs/add`, payload);
        console.log("Song added to playlist:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error adding song to playlist:", error);
      }
    },
    []
  );

  /**
   * Retrieves all playlists for a specific user.
   * @param {string} userId - The user's ID.
   * @returns {Promise<Object>} - Data containing all playlists for the user.
   */
  const getAllPlaylistsForUser = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(`/api/playlist/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting all playlists for user:", error);
    }
  }, []);

  /**
   * Pins a playlist.
   * @param {string} playlistId - The playlist's ID to pin.
   * @returns {Promise<Object>} - Response data from the API.
   */
  const pinPlaylist = useCallback(async (playlistId: any) => {
    try {
      const response = await axios.post(`/api/playlist/pin/${playlistId}`);
      console.log("Playlist pinned:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error pinning playlist:", error);
    }
  }, []);

  // -----------------------------
  // New User Data Function
  // -----------------------------

  const getUserById = useCallback(async (userId: string) => {
    try {
      const response = await api.get(`/api/user/${userId}`);
      return response.data;
    } catch (error: any) {}
  }, []);

  const changePremiumState = useCallback(
    async (userId: string, isPremium: boolean) => {
      try {
        const response = await axios.post(
          `/api/user/changepremiumstate/${userId}`,
          { isPremium } // Assuming the API expects this in the body
        );
        console.log("Premium state changed successfully:", response.data);
        return response.data;
      } catch (error) {}
    },
    []
  );

  /**
   * Manage user friends: Add, Remove, or Get friends.
   */
  const manageFriend = useCallback(
    async (
      action: "add" | "remove" | "get",
      userId: string,
      friendId?: string
    ) => {
      try {
        let response;
        switch (action) {
          case "add":
            if (!friendId)
              console.log("Friend ID is required to add a friend.");
            response = await axios.post(`/api/user/friend/${userId}`, {
              friendId,
            });
            console.log("Friend added successfully:", response.data);
            break;
          case "remove":
            if (!friendId)
              console.log("Friend ID is required to remove a friend.");
            response = await axios.delete(
              `/api/user/friend/${userId}/${friendId}`
            );
            console.log("Friend removed successfully:", response.data);
            break;
          case "get":
            response = await axios.get(`/api/user/friend/${userId}`);
            console.log("Fetched friends successfully:", response.data);
            return response.data;
          default:
        }
      } catch (error: any) {
        if (error.response) {
          console.error(
            `Error during '${action}' friend operation:`,
            error.response.data
          );
          console.error("Error status:", error.response.status);
        } else {
          console.error(
            `Error during '${action}' friend operation:`,
            error.message
          );
        }
      }
    },
    []
  );
  // Get User Friends
  const getUserFriends = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(`/api/user/friend/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user friends:", error);
    }
  }, []);

  // -----------------------------
  // Community Functions
  // -----------------------------

  /**
   * Fetches all communities.
   * @returns {Promise<CommunityData[]>} Array of community data.
   */
  const getAllCommunities = useCallback(async () => {
    try {
      const response = await axios.get(`/api/community`);
      console.log("All communities fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all communities:", error);
    }
  }, []);

  /**
   * Joins a community for a user.
   * @param {string} userId - The ID of the user joining the community.
   * @param {string} communityId - The ID of the community to join.
   * @returns {Promise<Object>} Response data from the API.
   */
  const joinCommunity = useCallback(
    async (_userId: string, _communityId: string) => {
      try {
        const response = await axios.post(`/api/community/joincommunity`, {
          userId: _userId,
          communityId: _communityId,
        });
        console.log("Joined community successfully:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error joining community:", error);
      }
    },
    []
  );

  /**
   * Creates a new community.
   * @param {CommunityData} communityData - Data for creating the community
   * @returns {Promise<Object>} Response data from the API
   */
  const createCommunity = useCallback(async (communityData: CommunityData) => {
    try {
      const response = await axios.post(
        `/api/community/createcommunity`,
        communityData
      );
      console.log("Community created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating community:", error);
    }
  }, []);

  // -----------------------------
  // Post Functions
  // -----------------------------

  /**
   * Creates a new post.
   * @param {PostData} postData - Data for creating the post
   * @returns {Promise<Object>} Response data from the API
   */
  const createPost = useCallback(async (postData: PostData) => {
    try {
      const response = await axios.post(`/api/post/createpost`, postData);
      console.log("Post created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }, []);

  /**
   * Comments on a post.
   * @param {CommentData} commentData - Data for creating the comment
   * @returns {Promise<Object>} Response data from the API
   */
  const commentOnPost = useCallback(async (commentData: CommentData) => {
    try {
      const response = await axios.post(`/api/post/commentonpost`, commentData);
      return response.data;
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, []);

  /**
   * Likes a post or comment.
   * @param {LikeData} likeData - Data for liking the post or comment
   * @returns {Promise<Object>} Response data from the API
   */
  const likePost = useCallback(async (likeData: LikeData) => {
    try {
      const response = await axios.post(`/api/post/likepost`, likeData);
      console.log("Like added successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error adding like:", error);
    }
  }, []);

  /**
   * Gets posts by artist ID.
   * @param {string} artistId - The ID of the artist
   * @returns {Promise<Object>} Array of posts by the artist
   */
  const getPostsByArtist = useCallback(async (artistId: string) => {
    try {
      const response = await axios.get(`/api/post/getpostbyartist/${artistId}`);
      console.log("Posts fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, []);

  /**
   * Gets personalized recommendations for the user's dashboard
   * @param {string} userId - The user's ID
   * @param {number} limit - Number of recommendations to fetch
   */
  const getDashboardRecommendations = useCallback(
    async (userId: string, limit: number = 20) => {
      try {
        const response = await axios.get(
          `/api/song/recommendations/dashboard/${userId}`,
          { params: { limit } }
        );
        return response.data;
      } catch (error) {
        console.log("Error fetching dashboard recommendations:", error);
      }
    },
    []
  );

  /**
   * Gets new releases from artists the user follows
   * @param {string} userId - The user's ID
   * @param {number} days - Number of days to look back
   * @param {number} limit - Number of releases to fetch
   */
  const getFollowedArtistsReleases = useCallback(
    async (userId: string, days: number = 30, limit: number = 20) => {
      try {
        const response = await api.get(
          `/api/song/recommendations/followed/${userId}`,
          { params: { days, limit } }
        );

        const artistyoufollow: ArtistsYouFollowResponse = response.data;
        return artistyoufollow;
      } catch (error) {
        console.log("Error fetching followed artists releases:", error);
      }
    },
    []
  );

  /**
   * Gets daily mix playlists based on user's listening habits
   * @param {string} userId - The user's ID
   * @param {number} mixCount - Number of mixes to generate
   * @param {number} songsPerMix - Number of songs per mix
   */
  const getDailyMixes = useCallback(
    async (userId: string, mixCount: number = 6, songsPerMix: number = 25) => {
      try {
        const response = await api.get(
          `/api/song/recommendations/daily-mix/${userId}`,
          { params: { mixCount, songsPerMix } }
        );
        const dailymixesResponse: DailyMixesResponse = response.data;
        return dailymixesResponse;
      } catch (error) {
        console.log("Error fetching daily mixes:", error);
      }
    },
    []
  );

  const getArtistCommunitiesByGenre = useCallback(async (userId: string) => {
    try {
      const response = await axios.get(
        `/api/community/artists-by-genre/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting artist communities by genre:", error);
    }
  }, []);

  const getTrendingArtistsByGenre = useCallback(
    async (userId: string, timeframe: "24h" | "7d" | "30d" = "7d") => {
      try {
        const response = await axios.get(
          `/api/community/trending-artists/${userId}`,
          {
            params: { timeframe },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error getting trending artists by genre:", error);
      }
    },
    []
  );

  const search = useCallback(
    async ({
      query,
      page = 1,
      limit = 20,
      sort = "relevance",
      category,
    }: SearchParams) => {
      try {
        const endpoint = category ? `/api/search/category` : `/api/search`;

        const response = await api.get(endpoint, {
          params: {
            query,
            page,
            limit,
            sort,
            ...(category && { category }),
          },
        });

        return response.data;
      } catch (error) {
        console.error("Error performing search:", error);
      }
    },
    []
  );

  const getRecentSearches = useCallback(async () => {
    try {
      const response = await api.get(`/api/search/recent`);
      return response.data;
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    }
  }, [retrieveUserId]);

  const clearRecentSearches = useCallback(async () => {
    try {
      const userId = await retrieveUserId();
      if (!userId) return;

      const response = await api.delete(`/api/search/recent`);
      console.log("recent search", response);
      return response.data;
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  }, [retrieveUserId]);

  const getTrendingSearches = useCallback(
    async (timeframe: "24h" | "7d" | "30d" = "24h", limit = 10) => {
      try {
        const response = await api.get(`/api/search/trending`, {
          params: { timeframe, limit },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching trending searches:", error);
      }
    },
    []
  );

  const getLocationBasedTracks = useCallback(
    async (
      countryCode: string,
      limit: number = 30,
      timeframe: "24h" | "7d" | "30d" = "7d"
    ) => {
      try {
        const response = await api.get(`/api/song/discover/location`, {
          params: {
            countryCode,
            limit,
            timeframe,
          },
        });
        console.log("response");
        return response.data;
      } catch (error) {
        console.error("Error fetching location-based tracks:", error);
      }
    },
    []
  );

  const getWorldwideTopSongs = useCallback(
    async (
      timeframe: "24h" | "7d" | "30d" = "24h",
      limit: number = 30,
      includeRegionalStats: boolean = false
    ) => {
      try {
        const response = await api.get(`/api/song/discover/worldwide`, {
          params: {
            timeframe,
            limit,
            includeRegionalStats,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching worldwide top songs:", error);
      }
    },
    []
  );

  const streamTrack = async (streamData: StreamData) => {
    try {
      const response = await fetch(`/tracks/${streamData.trackId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(streamData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error streaming track:", error);
      throw error;
    }
  };

  return {
    // -----------------------------
    // Authentication
    // -----------------------------
    createAccount,
    hasCreatedAccount,
    userID,
    storeUserId,
    retrieveUserId,
    deleteUserId,
    getUserByEmail,
    checkUsername,

    // -----------------------------
    // User Preferences
    // -----------------------------
    saveUserPreference,
    saveUserFavoriteArtists,
    getUserPreference,

    // -----------------------------
    // Artist Interactions
    // -----------------------------
    subscribeToArtist,
    followArtist,
    followArtistById,
    isFollowingArtist,
    getArtistBasedOnGenre,
    getUserSubscriptions,
    fetchFollowingArtists,
    getArtistDetails,

    // -----------------------------
    // Music Data
    // -----------------------------
    getAllReleases,
    getAllArtists,
    getGenres,
    getReleaseBasedOnGenres,
    getTop100Songs,
    getSongsForUser,
    getTracksFromId,

    // -----------------------------
    // Song Interactions
    // -----------------------------
    searchSongs,
    getTopSongsForArtist,
    getSinglesForArtist,
    streamSong,
    getSongArtistFeaturedOn,
    getLastPlayedSongs,
    getAlbumsAndEP,
    saveAlbum,
    getSavedAlbums,
    likeSong,
    getLikedSongs,

    // -----------------------------
    // Playlist Management
    // -----------------------------
    createPlaylist,
    addSongToPlaylist,
    getAllPlaylistsForUser,
    pinPlaylist,

    // -----------------------------
    // User Data
    // -----------------------------
    getUserById,
    changePremiumState,
    manageFriend,
    getUserFriends,

    // -----------------------------
    // Community
    // -----------------------------
    getAllCommunities,
    joinCommunity,
    createCommunity,

    // -----------------------------
    // Posts
    // -----------------------------
    createPost,
    commentOnPost,
    likePost,
    getPostsByArtist,

    getDashboardRecommendations,
    getFollowedArtistsReleases,
    getDailyMixes,

    getArtistCommunitiesByGenre,
    getTrendingArtistsByGenre,

    search,
    getRecentSearches,
    clearRecentSearches,
    getTrendingSearches,
    getLocationBasedTracks,
    getWorldwideTopSongs,

    streamTrack,
  };
};
