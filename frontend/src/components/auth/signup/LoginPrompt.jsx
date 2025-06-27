import React from "react";
import { Link } from "react-router-dom";

/**
 * LoginPrompt component.
 *
 * Displays a prompt with a link directing users to the login page.
 * Typically used on the signup page to redirect users who already have an account.
 *
 */

const LoginPrompt = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-end">
      <div className="row g-0">
        <small>
          Already have an account?{" "}
          <Link to="/" className="text-success">
            Login
          </Link>
        </small>
      </div>
    </div>
  );
};

export default LoginPrompt;
