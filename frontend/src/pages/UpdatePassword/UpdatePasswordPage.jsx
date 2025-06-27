import React from "react";
import UpdatePasswordForm from "../../components/auth/UpdatePasswordForm";
import { Toaster } from "react-hot-toast";

const UpdatePasswordPage = () => {
  return (
    <div className="main-container-page">
      <div className="d-flex justify-content-center align-items-center vh-100 card-container-page">
        <UpdatePasswordForm />
        <Toaster />
      </div>
    </div>
  );
};

export default UpdatePasswordPage;
