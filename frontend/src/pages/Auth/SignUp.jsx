import React from "react";
import AuthImage from "../../components/auth/AuthImage";
import SignUpContainer from "../../components/auth/signup/SignUpContainer";
import registerImg from "../../assets/images/registerImg.jpg";
import "./AuthStyle.css";

/**
 * SignUp component to render the sign-up page layout.
 */
const SignUp = () => {
  return (
    <div className="vh-100 d-flex bg-white align-items-center justify-content-center body-login">
      <div className="row w-100 h-100 m-0">
        <SignUpContainer />
        <AuthImage src={registerImg} alt="Sign up visual" />
      </div>
    </div>
  );
};

export default SignUp;
