import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import PasswordStrengthMeter from "./signup/PasswordStrengthMeter";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const UpdatePasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { updatePassword, error } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(password);
      console.log(password);
      // Show toast and wait before redirect
      toast.success("Password updated successfully! Redirecting...");
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000); // 2 seconds delay
    } catch (error) {
      console.error("Update password error:", error);
      toast.error(
        error.message || "Error updating password, please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #042414, #000001)",
      }}
      className="min-h-screen w-full flex items-center justify-center relative"
    >
      <Link
        to="/Profile"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          color: "white",
          fontSize: "1.5rem",
          textDecoration: "none",
          zIndex: 9999,
        }}
      >
        <FaArrowLeft />
      </Link>
      <div className="card-verification card shadow-lg p-4">
        <h3 className="text-center mb-4">Reset Password</h3>

        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label d-block">
              New Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label d-block">
              Confirm New Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <Lock size={16} />
              </span>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {password.length > 0 && (
              <PasswordStrengthMeter password={password} />
            )}
          </div>

          {/* Submit Button */}
          <div className="d-grid pt-1">
            <button type="submit" className="btn btn-success rounded-4">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordForm;
