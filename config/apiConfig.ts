// /src/api/config/apiConfig.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "@/redux/store";

const api = axios.create({
  baseURL: "https://looop-backend.onrender.com",
  timeout: 10000, // timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = store.getState().auth.token ?? "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    // network error
    if (err.code === "ERR_NETWORK") {
      console.log(`Network error ${err.code}`);
    }

    if (err.response.status === 400) {
      console.log(err.response.data.message, "400 Error");
    }

    if (err.response.status === 401) {
      console.log(err.response.data.message, "401 Error");
    }

    if (err.response.status === 404) {
      console.log(err.response.data.message, "404 Error");
    }

    if (err.response.status === 409) {
      console.log(err.response.data.message, "409 Error");
    }

    if (err.response.status === 500) {
      console.log(err.response.data.message, "500 Error");
    }
  }
);

export default api;
