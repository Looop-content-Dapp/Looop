import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type EventDetails = {
  startDate: string;
  endDate: string;
  location: string;
  venue: string;
  ticketLink?: string;
  price?: number;
  isVirtual: boolean;
  maxAttendees?: number;
  eventType: string;
  attendees: string[];
  isFullyBooked: boolean;
};

type MediaItem = {
  type: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  mimeType?: string;
  size?: number;
  width?: number;
  height?: number;
};

type Post = {
  content: string;
  title?: string;
  postType: 'event' | 'announcement' | 'regular';
  media?: MediaItem[];
  artistId: string;
  communityId: string;
  eventDetails?: EventDetails;
  announcementDetails?: {
    notificationSent: boolean;
    [key: string]: any;
  };
  tags?: string[];
  category?: string;
  visibility?: 'public' | 'private' | 'community';
  status?: 'published' | 'draft';
  type?: 'single' | 'multiple';
  genre?: string;
};

export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (input: Post) => {
      console.log("Attempting to create post", input);
      const { data } = await api.post("/api/post/createpost", input);
      return data;
    },
  });
};
