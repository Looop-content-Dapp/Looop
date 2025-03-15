import { useState } from "react";
import api from "@/config/apiConfig";
import { useMutation } from "@tanstack/react-query";

type FollowArtistInput = {
  userId: string;
  artistId: string;
};

export const useFollowArtist = () => {
  const [followingStatus, setFollowingStatus] = useState<{[key: string]: boolean}>({});

  const mutation = useMutation({
    mutationFn: async (input: FollowArtistInput) => {
      const { data } = await api.post(
        `/api/user/follow/${input.userId}/${input.artistId}`
      );
      return data;
    },
    onSuccess: (data, variables) => {
      setFollowingStatus(prev => ({
        ...prev,
        [variables.artistId]: data.isFollowing
      }));
    }
  });

  const handleFollowArtist = async (userId: string | undefined, artistId: string) => {
    if (!userId) {
      return null;
    }

    try {
      const response = await mutation.mutateAsync({ userId, artistId });

      if (response?.status !== "success") {
        throw new Error(response?.message || "Failed to follow artist");
      }

      return response.isFollowing;
    } catch (error) {
      console.error("Error following artist:", error);
      return null;
    }
  };

  return {
    followingStatus,
    handleFollowArtist,
    isLoading: mutation.isPending
  };
};
