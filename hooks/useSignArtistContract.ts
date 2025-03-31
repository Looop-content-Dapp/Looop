import api from "@/config/apiConfig";
import { useAppSelector } from "@/redux/hooks";
import { useMutation } from "@tanstack/react-query";

interface SignContractParams {
    fullName: string;
}

export const useSignArtistContract = () => {
    const { userdata } = useAppSelector((auth) => auth.auth);

    return useMutation({
        mutationFn: async ({ fullName }: SignContractParams) => {
            if (!userdata?._id) {
                throw new Error("User ID is required to sign the contract");
            }

            if (!fullName?.trim()) {
                throw new Error("Full name is required to sign the contract");
            }

            const { data } = await api.post("/api/artist/sign-contract", {
                userId: userdata._id,
                fullName: fullName.trim()
            });
            return data;
        },
    });
};
