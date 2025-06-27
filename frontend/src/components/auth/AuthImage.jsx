import React from "react";

const AuthImage = ({ src, alt }) => {
  return (
    <div className="col-md-6 d-none d-md-block p-0 h-100">
      <img
        src={src}
        alt={alt}
        className="w-100 h-100 object-fit-cover auth-image"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default AuthImage;
