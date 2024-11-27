// /src/utils/requestHandler.ts
import { AxiosError } from 'axios';

interface ApiResponse {
    data: any;
  }

export const handleApiError = (error: AxiosError) => {
    if (error.response) {
        console.error('API Error Response:', error.response.data);
        return {
          success: false,
          message: typeof error.response?.data === 'object' && error.response?.data !== null
          ? error.response.data ?? 'Something went wrong!'
          : 'Invalid response data',
        };
      } else if (error.request) {
    console.error('No Response from API:', error.request);
    return {
      success: false,
      message: 'No response from the server. Please check your network.',
    };
  } else {
    console.error('Error Setting up Request:', error.message);
    return {
      success: false,
      message: 'Error setting up the request.',
    };
  }
};

export const handleApiResponse = (response: ApiResponse): { success: boolean; data: any } => {
    return {
      success: true,
      data: response.data,
    };
};
