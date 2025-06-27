import React, { useState } from "react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";

/**
 * SignUpForm component.
 * Renders a user registration form with fields for username, email, and password.
 * Upon successful registration, the user is redirected to the home page.
 *
 */
const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error } = useAuthStore(); // Use default export here
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name); // Use the correct user inputs
      navigate("/home"); // Navigate to home page
    } catch (err) {
      console.log("Error signing up:", err.response?.data || err.message);
    }
  };

  return (
    <div className="card-body p-md-3 mx-md-3 mt-20">
      <div className="addUser">
        <h5>Create Account</h5>
        <form className="addUserForm" onSubmit={handleSignUp}>
          <div className="mb-1">
            <label htmlFor="name" className="form-label fs-6">
              <i className="fa-solid fa-address-card"></i>&nbsp;Username:
            </label>
            <input
              type="text"
              id="name"
              className="form-control gray-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {error && <p className="text-danger small"> &nbsp;{error}</p>}
          </div>

          <div className="mb-1">
            <label htmlFor="email" className="form-label fs-6">
              <i className="fa-solid fa-envelope"></i>&nbsp;Email address:
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

          <div className="mb-1">
            <label htmlFor="password" className="form-label fs-6">
              <i className="fa-solid fa-lock"></i>&nbsp;Password:{" "}
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

          {password.length > 0 && <PasswordStrengthMeter password={password} />}

          <div className="container mt-3 d-flex align-items-center justify-content-center">
            <button
              type="submit"
              className="btn btn-success text-white text-center w-75 h-9 mt-3 signup-btn"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
