import React from "react";
import LoginPrompt from "./LoginPrompt";
import SignUpForm from "./SignUpForm";
import AuthTitle from "../AuthTitle";

const SignUpContainer = () => {
  return (
    <div className="col-md-6 col-sm-12 left-box d-flex align-items-center justify-content-center">
      <div className="container container-signup d-flex flex-column justify-content-between h-100 py-4">
        <AuthTitle />
        <SignUpForm />
        <LoginPrompt />
      </div>
    </div>
  );
};

export default SignUpContainer;
