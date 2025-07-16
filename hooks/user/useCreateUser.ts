import api from '@/config/apiConfig';
import { useAuthStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: {
    message: string;
  };
}

type User = {
  email: string;
  password: string;
  username: string;
  fullname: string;
  age: string;
  gender: string;
  referralCode?: string;
};

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    username: string;
    bio: string | null;
    image: string | null;
    isVerified: boolean;
    emailVerified: boolean;
  };
  token: string;
  tokenType: string;
  expiresIn: number;
}

export const useCreateUser = () => {
  const setUserData = useAuthStore((state) => state.setUserData);
  const setAuthToken = useAuthStore((state) => state.setToken);

  return useMutation<
    ApiResponse<AuthResponse>,
    Error,
    User
  >({
    mutationFn: async (input: User) => {
      console.log('Attempting to create user', input);
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', input);
      console.log('User created', data);
      return data;
    },
    onSuccess: (response) => {
      if (response.data) {
        setUserData(response.data.user);
        setAuthToken(response.data.token);
      }
    },
  });
};
