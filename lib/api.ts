import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

interface RegisterUserData {
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