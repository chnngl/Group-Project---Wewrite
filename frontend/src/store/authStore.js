import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
const API_URL = "http://localhost:5000/api";

axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isCheckingAuth: true,
  message: null,

  /**
 * Registers a new user with the provided email, password, and name.
 * Sends a POST request to the backend `/register` endpoint. On success,
 * logs the response and stores the returned token in `localStorage` 
 * @param {string} email - The email address of the user to register.
 * @param {string} password - The password for the new user.
 * @param {string} name - The full name of the user.
 */
  signup: async (email, password, name) => {
    set({ error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name,
      });
      console.log("Register response:", response.data);

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("No token received in register response.");
      }
    } catch (error) {
      set({
        error: error.response.data.message,
      });
      throw error;
    }
  },

  /**
 * Authenticates a user using their email and password.
 *  If the login is successful,stores the received token in `localStorage`
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 */
  login: async (email, password) => {
    set({ error: null });

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", response.data);

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("No token received in login response.");
      }

      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
      });

      return token;
    } catch (error) {
      console.log("Login error response:", error.response);

      const errorMessage = error.response?.data?.msg || "Error logging in";
      set({
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

  /**
 * Logs out the currently authenticated user.
 * On success, removes the token from `localStorage` and clears the Axios authorization header.
 */
  logout: async () => {
    set({ error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
      set({
        error: error.response?.data?.message || "Error logging out",
      });
      throw error;
    }
  },

  /**
 * Updates the user's password 
 * Retrieves the token from `localStorage` and includes it in the Authorization header
 * for the request. 
 */
  updatePassword: async (password) => {
    console.log("password", password);
    set({ error: null });
    const token = localStorage.getItem("token");
    console.log(token);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add token to the request header
      },
      body: JSON.stringify({ password }),
    };
    try {
      const response = await fetch(`${API_URL}/updatepwd`, options);
      console.log(response);
    } catch (error) {
      set({
        error: error.response?.data?.msg || "Error resetting password",
      });
      throw error;
    }
  },
}));

export default useAuthStore;
