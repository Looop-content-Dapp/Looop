import api from "@/config/apiConfig";
import { useAppDispatch } from "@/redux/hooks";
import { setUserData } from "@/redux/slices/auth";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").readonly(),
  email: z.string().email("Invalid email address").readonly(),
  fullname: z.string().optional(),
  age: z.string().optional().readonly(),
  gender: z.enum(['male', 'female']).optional().readonly(),
  bio: z.string().nullable().default(null),
  tel: z.string().nullable().default(null),
  location: z.object({
    country: z.string().nullable().default(null),
    state: z.string().nullable().default(null),
    city: z.string().nullable().default(null),
  }).default({
    country: null,
    state: null,
    city: null
  }),
  socialLinks: z.object({
    instagram: z.string().nullable().default(null),
    twitter: z.string().nullable().default(null),
    facebook: z.string().nullable().default(null),
    website: z.string().nullable().default(null),
  }).default({
    instagram: null,
    twitter: null,
    facebook: null,
    website: null,
  }),
  preferences: z.object({
    favoriteGenres: z.array(z.string()).default([]),
    language: z.string().default('en'),
    notifications: z.object({
      email: z.boolean().default(false),
      push: z.boolean().default(false),
    }).default({
      email: false,
      push: false,
    }),
    currency: z.enum(['USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'ZAR']).default('USD'),
    chain: z.enum(['XION', 'STARKNET']).default('XION'),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    displayMode: z.enum(['compact', 'comfortable']).default('comfortable'),
  }).default({
    favoriteGenres: [],
    language: 'en',
    notifications: {
      email: false,
      push: false,
    },
    currency: 'USD',
    chain: 'XION',
    theme: 'system',
    displayMode: 'comfortable',
  }),
  profileImage: z.string().nullable().default(null),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: ProfileFormData }) => {
      try {
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
