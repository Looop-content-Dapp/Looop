import api from "@/config/apiConfig";
import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/auth";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(2, "Full name is required"),
  bio: z.string().optional().default(""),
  phoneNumber: z.string().optional().default(""),
  country: z.string().optional().default(""),
  city: z.string().optional().default(""),
  dateOfBirth: z.string().optional().default(""),
  favoriteGenres: z.array(z.string()).optional().default([]),
  websiteUrl: z.string().url().optional().default("").or(z.literal("")),
  profileImage: z.string().optional().default(""),
  socialLinks: z.object({
    twitter: z.string().optional().default(""),
    instagram: z.string().optional().default(""),
    tiktok: z.string().optional().default(""),
  }).optional().default({
    twitter: "",
    instagram: "",
    tiktok: "",
  }),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: ProfileFormData }) => {
      try {
        // Validate the data before sending
        const validatedData = profileSchema.parse(data);

        const response = await api.patch(`/api/user/profile/${userId}`, validatedData);

        if (response.data?.user) {
          dispatch(setUserData(response.data.user));
        }

        return response.data;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessages = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          throw new Error(JSON.stringify(errorMessages));
        }
        throw error;
      }
    },
  });
};
