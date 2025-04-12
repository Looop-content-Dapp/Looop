import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";

export type Media = {
  type: string;
  url: string;
  mimeType: string;
  width: number;
  height: number;
  _id: string;
};

export type ArtistId = {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  verified: boolean;
};

export type CommunityId = {
  _id: string;
  description: string;
  coverImage: string;
};

type UserLike = {
    _id: string;
    userId: {
      _id: string;
      email: string;
      username: string;
      profileImage: string | null;
      bio: string | null;
    };
    postId: string;
    itemType: 'post';
    createdAt: string;
    __v: number;
  };

  export type Post = {
    _id: string;
    content: string;
    title: string;
    postType: string;
    type: string;
    media: Media[];
    artistId: ArtistId;
    communityId: CommunityId;
    tags: string[];
    category: string;
    visibility: string;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    status: string;
    genre: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
    comments: any[];
    likes: UserLike[];
    hasLiked: boolean;
  };

  export type UserFeedResponse = {
    message: string;
    data: {
      posts: Post[];
      currentPage: number;
      totalPages: number;
      totalPosts: number;
    };
  };


export const useUserFeed = () => {
  const { userdata } = useAppSelector((auth) => auth.auth);

  return useQuery({
    queryKey: ["userFeed", userdata?._id],
    queryFn: async () => {
      if (!userdata?._id) {
        throw new Error("User ID not found");
      }
      const { data } = await api.get<UserFeedResponse>(`/api/post/feed/${userdata._id}`);
      return data;
    },
    enabled: !!userdata?._id,
    staleTime: 2 * 60 * 1000, // Data stays fresh for 2 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchIntervalInBackground: false,
    retry: 2,
  });
};


type Artist = {
    _id: string;
    name: string;
    profileImage: string;
    verified: boolean;
    followers: string[];
  };


type Track = {
    _id: string;
    title: string;
    duration: number;
    artist: {
      _id: string;
      name: string;
      profileImage: string;
      verified: boolean;
    };
    release: {
      _id: string;
      title: string;
      image: string;
      type: string;
    };
    isFromFollowedArtist: boolean;
  };

  type UserDashbaordResponse = {
    status: string;
    message: string;
    data: {
      followedArtists: Artist[];
      recentReleases: any[];
      recommendedArtists: Artist[];
      suggestedTracks?: Track[];
    };
  };


export const useUserDashboard = () => {
  const { userdata } = useAppSelector((auth) => auth.auth);

  return useQuery({
    queryKey: ["userDashboard", userdata?._id],
    queryFn: async () => {
      if (!userdata?._id) {
        throw new Error("User ID not found");
      }
      const { data } = await api.get<UserDashbaordResponse>(`/api/user/feed/${userdata._id}`);
      return data;
    },
    enabled: !!userdata?._id,
    refetchOnWindowFocus: true,
    gcTime: 60 * 60 * 1000,
    staleTime: 10000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,// Add placeholder data for smooth loading
  });
};
