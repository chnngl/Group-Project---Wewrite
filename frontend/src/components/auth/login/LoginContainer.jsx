import React from "react";
import LoginForm from "./LoginForm";
import SignUpPrompt from "./SignUpPrompt";
import AuthTitle from "../AuthTitle";

const LoginContainer = () => {
  return (
    <div className="col-md-6 col-sm-6 left-box d-flex flex-column justify-content-between h-100">
      <AuthTitle />
      <LoginForm />
      <SignUpPrompt />
    </div>
  );
};

export default LoginContainer;
