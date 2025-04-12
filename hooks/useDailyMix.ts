import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/redux/hooks";

export const useDailyMix = () => {
  const { userdata } = useAppSelector((auth) => auth.auth)

  return useQuery({
    queryKey: ["dailyMix", userdata?._id],
    queryFn: async () => {
      const { data } = await api.get(`/api/song/recommendations/daily-mix/${userdata?._id}`);
      return data;
    },
    enabled: !!userdata?._id,
    refetchInterval: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    // Add caching configuration
    staleTime: 12 * 60 * 60 * 1000, // Consider data fresh for 12 hours
    cacheTime: 24 * 60 * 60 * 1000, // Keep unused data in cache for 24 hours
    retry: 2, // Retry failed requests twice
  });
};
