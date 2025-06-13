import api from "@/config/apiConfig";
import { useNotification } from "@/context/NotificationContext";
import { useMutation, useQuery } from "@tanstack/react-query";

interface FriendRequest {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profileImage: string | null;
  };
  receiverId: {
    _id: string;
    username: string;
    profileImage: string | null;
  };
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export const useFriendRequests = (userId: string) => {
  const { showNotification } = useNotification();

  // Fetch friend requests
  const { data: friendRequests, isLoading } = useQuery<{
    sent: FriendRequest[];
    received: FriendRequest[];
  }>({
    queryKey: ["friendRequests", userId],
    queryFn: async () => {
      const response = await api.get("/api/friends/requests");
      return response.data;
    },
  });

  // Send friend request
  const sendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      const response = await api.post("/api/friends/request", { receiverId });
      return response.data;
    },
    onSuccess: () => {
      showNotification({
        type: "success",
        title: "Friend Request Sent",
        message: "Your friend request has been sent successfully!",
      });
    },
    onError: (error: any) => {
      showNotification({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message || "Failed to send friend request",
      });
    },
  });

  // Accept friend request
  const acceptRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.post(
        `/api/friends/request/${requestId}/accept`
      );
      return response.data;
    },
    onSuccess: () => {
      showNotification({
        type: "success",
        title: "Friend Request Accepted",
        message: "You are now friends!",
      });
    },
    onError: (error: any) => {
      showNotification({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message || "Failed to accept friend request",
      });
    },
  });

  // Reject friend request
  const rejectRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await api.post(
        `/api/friends/request/${requestId}/reject`
      );
      return response.data;
    },
    onSuccess: () => {
      showNotification({
        type: "info",
        title: "Friend Request Rejected",
        message: "Friend request has been rejected",
      });
    },
    onError: (error: any) => {
      showNotification({
        type: "error",
        title: "Error",
        message:
          error.response?.data?.message || "Failed to reject friend request",
      });
    },
  });

  return {
    friendRequests,
    isLoading,
    sendRequest: sendRequest.mutate,
    acceptRequest: acceptRequest.mutate,
    rejectRequest: rejectRequest.mutate,
    isSending: sendRequest.isPending,
    isAccepting: acceptRequest.isPending,
    isRejecting: rejectRequest.isPending,
  };
};
