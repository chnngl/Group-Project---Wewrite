import React, { useState } from "react";
import { Loader } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * Handles user login form submission.
 * - Attempts to log in using provided email and password.
 * - If successful, stores the token and sets the default Authorization header for Axios.
 * - Navigates the user to the home page.
 */
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      const token = localStorage.getItem("token");
      // Set Authorization header for future API requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="card-body p-md-3 mx-md-3 mt-1 login-form">
      <div className="addUser pb-1">
        <h5>Welcome Back</h5>
        <form className="addUserForm" onSubmit={handleLogin}>
          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <i className="fa-solid fa-envelope"></i>Email address:
            </label>
            <input
              type="email"
              id="email"
              className="form-control gray-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label htmlFor="password" className="form-label">
              <i className="fa-solid fa-lock"></i> Password:
            </label>
            <input
              type="password"
              id="password"
              className="form-control gray-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          <div className="error-container">
            {error && (
              <p className="text-red-500 font-semibold mt-2">{error}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="container mt-4 d-flex align-items-center justify-content-center">
            <button
              type="submit"
              className="btn btn-success text-white w-70 signup-btn"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
