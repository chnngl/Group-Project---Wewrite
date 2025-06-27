import React from "react";
import { Link } from "react-router-dom";

/**
 * Renders a prompt with a link directing users to the signup page.
 * Used at the login forms for user registration.
 */
const SignUpPrompt = () => {
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-end"
      style={{ paddingBottom: "20px" }}
    >
      <small>
        Don't have an account?{" "}
        <Link to="/signup" className="text-success">
          Sign Up
        </Link>
      </small>
    </div>
  );
};

export default SignUpPrompt;
