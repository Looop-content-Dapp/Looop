import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";

type Artist = {
  _id: string;
  name: string;
  email?: string;
  profileImage: string;
  verified: boolean;
};

type Member = {
  _id: string;
  username: string;
  profileImage: string | null;
};

type Community = {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  artist: Artist;
  memberCount: number;
  members: Member[];
  joinedAt: string;
};

type Comment = {
  _id: string;
  userId: string;
  postId: string;
  parentCommentId: string | null;
  content: string;
  createdAt: string;
};

type Like = {
  _id: string;
  userId: { _id: string };
  postId: string;
  itemType: string;
  createdAt: string;
};

type MediaContent = {
  _id: string;
  type: "audio" | "image";
  url: string;
  mimeType: string;
};

type Post = {
  _id: string;
  content: string;
  title: string;
  postType: string;
  artistId: Artist;
  communityId: {
    _id: string;
    description: string;
    coverImage: string;
  };
  media: MediaContent[];
  likeCount: number;
  commentCount: number;
  shareCount: number;
  comments: Comment[];
  likes: Like[];
  hasLiked: boolean;
  createdAt: string;
  updatedAt: string;
};

type TribesResponse = {
  status: string;
  message: string;
  data: {
    communities: Community[];
    posts: Post[];
  };
};

type TribePass = {
  collectibleName: string;
  collectibleDescription: string;
  collectibleImage: string;
  collectibleType: string;
  price: string;
  type?: string;
};

type SubscriptionMember = {
  userId: string;
  joinDate: string;
  username: string;
  profileImage: string | null;
};

type Creator = {
  name: string;
  profileImage: string;
  verified: boolean;
};

type Subscription = {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
  status: string;
  expiry: string;
  creator: Creator;
  members: SubscriptionMember[];
  tribePass: TribePass;
};

type SubscriptionsResponse = {
  success: boolean;
  data: Subscription[];
};

export const useTribes = (page: number = 1, limit: number = 10, refetchInterval: number = 30000) => {
  const { userdata } = useAppSelector((auth) => auth.auth);
  return useQuery<TribesResponse>({
    queryKey: ["tribes", userdata?._id, page, limit],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/community/user/${userdata?._id}?page=${page}&limit=${limit}`
      );
      return data;
    },
    enabled: !!userdata?._id,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: false,
    staleTime: 2 * 60 * 1000, // Data stays fresh for 2 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    retry: 2,
  });
};

export const useUserSubscriptions = (refetchInterval: number = 30000) => {
  const { userdata } = useAppSelector((auth) => auth.auth);

  return useQuery<SubscriptionsResponse>({
    queryKey: ["subscriptions", userdata?._id],
    queryFn: async () => {
      const { data } = await api.get(`/api/pass-subscriptions/user/${userdata?._id}`);
      return data;
    },
    enabled: !!userdata?._id,
    refetchInterval: refetchInterval,
    refetchIntervalInBackground: false,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2,
  });
};
