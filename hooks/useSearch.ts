import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

type Artist = {
    _id: string;
    name: string;
    profileImage: string;
    verified: boolean;
    type: "artist";
    tribeStars: string;
};

type ArtistSearchResult = Artist & {
  totalReleases?: number;
};

type Community = {
  _id: string;
  communityName: string;
  description: string;
  coverImage: string;
  memberCount: number;
  artist: Artist;
  type: "community";
};

type Post = {
  _id: string;
  title: string;
  content: string;
  media: string[];
  postType: string;
  category: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  artist: Artist;
  community: {
    _id: string;
    communityName: string;
  };
  type: "post";
};

type CommunitySearchResponse = {
  status: string;
  message: string;
  data: {
    results: (Community | Post)[];
    total: number;
    filter: string;
  };
};

type ArtistSearchResponse = {
  success: boolean;
  message: string;
  data: {
    tracks: { items: any[]; total: number; hasMore: boolean };
    artists: { items: ArtistSearchResult[]; total: number; hasMore: boolean };
    releases: { items: any[]; total: number; hasMore: boolean };
    playlists: { items: any[]; total: number; hasMore: boolean };
  };
  metadata: {
    query: string;
    pagination: {
      current: number;
      limit: number;
      totalResults: number;
    };
  };
};

type SearchResponse = {
  status: string;
  message: string;
  data: {
    results: (Community | Post | Artist)[];
    total: number;
    filter: string;
  };
};

export const useSearch = (query: string, filter?: "posts" | "tribes" | "artistes") => {
  return useQuery({
    queryKey: ["search", query, filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (query) params.append("query", query);
      if (filter) params.append("filter", filter);

      const { data } = await api.get<SearchResponse>(`/api/community/search?${params.toString()}`);
      return data;
    },
    enabled: !!query,
  });
};
