import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./auth/tokenManager";


export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

const authEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
];


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
//runs after a response,checks if there is an error,and if the error is because of expired acctoken we call the refresh token route,get new acc token then rereun the request
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Don't try to refresh the refresh-token request itself.
   if (authEndpoints.includes(originalRequest.url ?? "")) {
    return Promise.reject(error);
    }

    // Only retry an unauthorized request once.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post("/auth/refresh-token");
        const newToken: string = response.data.accessToken;

        setAccessToken(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

export const registerUser = async (
  user: RegisterUserData
) => {
  const response = await api.post("/auth/register", user);

  return response.data;
};

export const loginUser = async (
  user: LoginUserData
) => {
  const response = await api.post("/auth/login", user);

  return response.data;
};

export const googleAuthURL= "/api/auth/google"