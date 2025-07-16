import api from "@/config/apiConfig";
import { useAuth, useAuthActions } from "@/stores/hooks";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
    const { setUserData } = useAuthActions();
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get(`/auth/me`);
      if (res && res.data && typeof res.data.data !== 'undefined') {
        setUserData(res?.data?.data?.user);
        return res.data.data;
      } else {
        // Handle cases where the response or nested data is not as expected
        console.error("Invalid response structure from /api/user or res.data.data is undefined:", res);
        // Throw an error to be caught by React Query's error handling
        throw new Error("Invalid user data response from server");
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Query will only run if userdata._id is truthy
    refetchOnMount: true,
  });
};
