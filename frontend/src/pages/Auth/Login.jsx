import React from "react";
import AuthImage from "../../components/auth/AuthImage";
import loginImg from "../../assets/images/loginImg.jpg";
import LoginContainer from "../../components/auth/login/LoginContainer";
import "./AuthStyle.css";
const Login = () => {
  return (
    <div className="vh-100 d-flex bg-white align-items-center justify-content-center body-login">
      <div className="row w-100 h-100 m-0">
        <LoginContainer />
        <AuthImage src={loginImg} alt="Login visual" />
      </div>
    </div>
  );
};

export default Login;
