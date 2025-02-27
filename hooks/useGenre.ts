import api from "@/config/apiConfig";
import { useQuery } from "@tanstack/react-query";

export type Genre = {
  name: string;
  description: string;
  image: string;
};
type Data = {
  data: Genre[];
};

export const useGetGenre = () => {
  return useQuery<Data, Error>({
    queryKey: ["genre"],
    queryFn: async () => {
      const response = await api.get("/api/genre/getgenres");
      return response.data;
    },
  });
};
