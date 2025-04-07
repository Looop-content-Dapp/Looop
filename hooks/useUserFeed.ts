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

const generateSkeletonPost = (): Post => ({
  _id: `skeleton-${Math.random()}`,
  content: '',
  title: '',
  postType: '',
  type: '',
  media: [],
  artistId: {
    _id: `skeleton-${Math.random()}`,
    name: '',
    email: '',
    profileImage: '',
    verified: false
  },
  communityId: {
    _id: `skeleton-${Math.random()}`,
    description: '',
    coverImage: ''
  },
  tags: [],
  category: '',
  visibility: '',
  likeCount: 0,
  commentCount: 0,
  shareCount: 0,
  status: '',
  genre: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  __v: 0,
  id: `skeleton-${Math.random()}`,
  comments: [],
  likes: [],
  hasLiked: false
});

const skeletonFeedData: UserFeedResponse = {
  message: 'Loading...',
  data: {
    posts: Array(3).fill(null).map(generateSkeletonPost),
    currentPage: 1,
    totalPages: 1,
    totalPosts: 3
  }
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
    enabled: !!userdata?._id, // Only run the query if userdata._id exists
    refetchOnWindowFocus: true,
    staleTime: 10000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    placeholderData: skeletonFeedData,
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


const generateSkeletonArtist = (): Artist => ({
  _id: `skeleton-${Math.random()}`,
  name: '',
  profileImage: '',
  verified: false,
  followers: []
});

const generateSkeletonTrack = (): Track => ({
  _id: `skeleton-${Math.random()}`,
  title: '',
  duration: 0,
  artist: {
    _id: `skeleton-${Math.random()}`,
    name: '',
    profileImage: '',
    verified: false
  },
  release: {
    _id: `skeleton-${Math.random()}`,
    title: '',
    image: '',
    type: ''
  },
  isFromFollowedArtist: false
});

const skeletonData: UserDashbaordResponse = {
  status: 'loading',
  message: 'Loading...',
  data: {
    followedArtists: Array(5).fill(null).map(generateSkeletonArtist),
    recentReleases: [],
    recommendedArtists: Array(5).fill(null).map(generateSkeletonArtist),
    suggestedTracks: Array(5).fill(null).map(generateSkeletonTrack)
  }
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
    staleTime: 10000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    placeholderData: skeletonData, // Add placeholder data for smooth loading
  });
};
