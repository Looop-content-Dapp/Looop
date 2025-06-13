import api from "@/config/apiConfig";
import { useQuery, useMutation } from "@tanstack/react-query";

export type Genre = {
    name: string;
    description: string;
    image: string;
    _id: string;
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

export const useGetArtistBasedOnGenre = (userId: string) => {
    return useQuery<Data, Error>({
        queryKey: ["artist", userId],
        queryFn: async () => {
            const response = await api.get(
                `/api/user/getartistbasedonusergenre/${userId}`
            );
            return response.data;
        },
    });
};

export const useCreateGenreForUser = () => {
    return useMutation({
        mutationFn: async (data: { preferences: string[]; userId: string }) => {
            const response = await api.post("/api/user/creategenresforuser", data);
            return response.data;
        },
    });
};
