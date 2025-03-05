import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { userdata } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["user", userdata?._id],
    queryFn: async () => {
      const response = await api.get(`/api/user/${userdata?._id}`);
      return response.data;
    },
  });
};
