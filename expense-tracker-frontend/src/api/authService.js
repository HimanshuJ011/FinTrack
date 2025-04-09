
import { jwtDecode } from "jwt-decode";
import createAxiosInstance from "../utils/axiosInstance";

const axiosInstance = createAxiosInstance(import.meta.env.VITE_AUTH_API_URL);

const register = (username, email, password) => {
  return axiosInstance.post("register", {
    username,
    email,
    password,
  });
};

const login = async (username, password) => {
  const response = await axiosInstance.post("login", {
    username,
    password,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    const decoded = jwtDecode(response.data.token);
    localStorage.setItem("user", JSON.stringify(decoded));
  }

  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
  }
  return null;
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};
const checkUsernameAvailability = async (username) => {
  if (!username || username.length < 3) return true;

  try {
    const response = await axiosInstance.get("check-username", {
      params: { username },
    });
    return response.data.available;
  } catch (error) {
    console.error("Username availability check failed:", error);
    return true; 
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  checkUsernameAvailability
};

export default authService;
