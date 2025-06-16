import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/auth";
import store from "@/redux/store";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
    const { userdata } = useAppSelector((auth) =>  auth.auth);
    if(!userdata?._id){
        console.log("useGetUser: userdata._id does not exist, query will be disabled or may not run as expected.");
        // Early return or special handling might be needed if userdata._id is essential
        // For now, let useQuery handle it with the 'enabled' flag
    }
  return useQuery({
    queryKey: ["user", userdata?._id],
    queryFn: async () => {
      if (!userdata?._id) {
        // This case should ideally be handled by the `enabled` option more directly
        // or by ensuring useGetUser is only called when userdata._id is available.
        // Throwing an error here or returning undefined will affect useQuery's state.
        console.warn("useGetUser queryFn: Attempted to fetch user without userdata._id.");
        return undefined; // Or throw new Error("User ID is missing");
      }
      const res = await api.get(`/api/user/${userdata._id}`);
      // Assuming the backend sends { status: '...', message: '...', data: userDataObject }
      // We need to dispatch and return the actual userDataObject
      if (res && res.data && typeof res.data.data !== 'undefined') {
        store.dispatch(setUserData(res.data.data));
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
    refetchInterval: 5000,
    enabled: !!userdata?._id, // Query will only run if userdata._id is truthy
    refetchOnMount: true,
  });
};
