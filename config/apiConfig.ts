import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import store from "@/redux/store";
import { showToast } from "../components/ShowMessage";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface ApiResponse {
  message?: string;
  [key: string]: any;
}

// Configure environment variables
const API_URL = "http://localhost:9001";
const API_TIMEOUT = process.env.API_TIMEOUT || 30000;

const api = axios.create({
  baseURL: API_URL,
//   timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = store.getState().auth.token ?? "";
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Show success toast for successful responses
    const data = response.data as ApiResponse;
    if (data?.message) {
      showToast(data.message, 'success');
    }
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as RetryConfig;

    // Handle network errors
    if (!error.response) {
      const message = "Network error occurred. Please check your internet connection.";
      showToast(message, 'error');
      throw new Error(message);
    }

    // Handle specific HTTP status codes
    let errorMessage = '';
    switch (error.response.status) {
      case 400:
        errorMessage = error.response.data?.message || 'Bad Request';
        break;

      case 401:
        errorMessage = error.response.data?.message || 'Unauthorized access';
        store.dispatch({ type: "auth/logout" });
        break;

      case 403:
        errorMessage = error.response.data?.message || 'Access forbidden';
        break;

      case 404:
        errorMessage = error.response.data?.message || 'Resource not found';
        break;

      case 409:
        errorMessage = error.response.data?.message || 'Conflict occurred';
        // return error.response.data
        break;

      case 429:
        errorMessage = error.response.data?.message || 'Too many requests';
        break;

      case 500:
        errorMessage = error.response.data?.message || 'Server error occurred';
        break;
      case 502:
      case 503:
        errorMessage = error.response.data?.message || 'Server error occurred';
        break;

      default:
        errorMessage = error.response.data?.message || 'An unexpected error occurred';
    }

    // Show error toast
    showToast(errorMessage, 'error');

    // Retry logic for 5xx errors
    if (error.response.status >= 500 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(api(originalRequest));
        }, 3000); // Retry after 3 seconds
      });
    }

    return Promise.reject(error);
  }
);

export default api;
