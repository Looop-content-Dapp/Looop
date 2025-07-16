import api from "@/config/apiConfig";
import { useAuth } from "@/stores/hooks";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { userdata } = useAuth();

  return useQuery({
    queryKey: ["user", userdata?._id],
    queryFn: async () => {
      const response = await api.get(`/api/user/${userdata?._id}`);
      return response.data;
    },
  });
};
