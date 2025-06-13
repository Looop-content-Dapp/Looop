import api from "@/config/apiConfig";
import { useNotification } from "@/context/NotificationContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FriendRequest {
  _id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface Friend {
  _id: string;
  userId: string;
  friendId: {
    _id: string;
    username: string;
    email: string;
  };
}

export const useFriendRequests = (userId: string) => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  // Fetch friend requests
  const { data: friendRequests = { sent: [], received: [] } } = useQuery({
    queryKey: ["friendRequests", userId],
    queryFn: async () => {
      const response = await api.get("/api/friends/requests");
      return response.data;
    },
    enabled: !!userId,
  });

  // Fetch friends list
  const { data: friends = [] } = useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      const response = await api.get("/api/friends/list");
      return response.data;
    },
    enabled: !!userId,
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: async (receiverId: string) => {
      const response = await api.post("/api/friends/request", {
        receiverId,
        senderId: userId,
      });
      return response.data;
    },
    onSuccess: () => {
      showNotification({
        type: "success",
        title: "Friend Request Sent",
        message: "Your friend request has been sent successfully",
      });
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["friendRequests", userId] });
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
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

  // Accept friend request mutation
  const acceptRequestMutation = useMutation({
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
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ["friendRequests", userId] });
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
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

  // Reject friend request mutation
  const rejectRequestMutation = useMutation({
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
      // Invalidate and refetch friend requests
      queryClient.invalidateQueries({ queryKey: ["friendRequests", userId] });
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

  // Helper functions
  const getRequestStatus = (targetUserId: string) => {
    // Check sent requests
    const sentRequest = friendRequests.sent.find(
      (req: FriendRequest) => req.receiverId === targetUserId
    );
    if (sentRequest) {
      return {
        type: "sent" as const,
        status: sentRequest.status,
        requestId: sentRequest._id,
      };
    }

    // Check received requests
    const receivedRequest = friendRequests.received.find(
      (req: FriendRequest) => req.senderId === targetUserId
    );
    if (receivedRequest) {
      return {
        type: "received" as const,
        status: receivedRequest.status,
        requestId: receivedRequest._id,
      };
    }

    return null;
  };

  const isFriend = (targetUserId: string) => {
    return friends.some(
      (friend: Friend) => friend.friendId._id === targetUserId
    );
  };

  const isSending = (targetUserId: string) => {
    return (
      sendRequestMutation.isPending &&
      sendRequestMutation.variables === targetUserId
    );
  };

  const isAccepting = (requestId: string) => {
    return (
      acceptRequestMutation.isPending &&
      acceptRequestMutation.variables === requestId
    );
  };

  const isRejecting = (requestId: string) => {
    return (
      rejectRequestMutation.isPending &&
      rejectRequestMutation.variables === requestId
    );
  };

  return {
    sendRequest: sendRequestMutation.mutate,
    acceptRequest: acceptRequestMutation.mutate,
    rejectRequest: rejectRequestMutation.mutate,
    getRequestStatus,
    isFriend,
    isSending,
    isAccepting,
    isRejecting,
    isLoading:
      sendRequestMutation.isPending ||
      acceptRequestMutation.isPending ||
      rejectRequestMutation.isPending,
  };
};
