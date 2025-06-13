import { ENV } from "@/config/env";
import { useNotification } from "@/context/NotificationContext";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export const useFriendWebSocket = (userId: string) => {
  const ws = useRef<WebSocket | null>(null);
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    // Connect to WebSocket server
    ws.current = new WebSocket(`${ENV.WS_URL}/ws?userId=${userId}`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      const { event: eventType, data } = JSON.parse(event.data);

      switch (eventType) {
        case "friend_request_received":
          showNotification({
            type: "info",
            title: "New Friend Request",
            message: `${data.sender.username} sent you a friend request`,
          });
          // Invalidate friend requests query to refresh the list
          queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
          break;

        case "friend_request_accepted":
          showNotification({
            type: "success",
            title: "Friend Request Accepted",
            message: `${data.friend.username} accepted your friend request`,
          });
          // Invalidate both friend requests and friends list queries
          queryClient.invalidateQueries({
            queryKey: ["friendRequests", "friends"],
          });
          break;

        case "friend_request_rejected":
          showNotification({
            type: "info",
            title: "Friend Request Rejected",
            message: `${data.rejectedBy.username} rejected your friend request`,
          });
          queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
          break;

        case "friend_removed":
          showNotification({
            type: "info",
            title: "Friend Removed",
            message: `${data.removedBy.username} removed you from their friends list`,
          });
          queryClient.invalidateQueries({ queryKey: ["friends"] });
          break;
      }
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      showNotification({
        type: "error",
        title: "Connection Error",
        message:
          "Failed to connect to real-time updates. Please check your internet connection.",
      });
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (userId) {
          console.log("Attempting to reconnect WebSocket...");
          ws.current = new WebSocket(`${ENV.WS_URL}/ws?userId=${userId}`);
        }
      }, 5000); // Try to reconnect after 5 seconds
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [userId, showNotification, queryClient]);

  return ws.current;
};
