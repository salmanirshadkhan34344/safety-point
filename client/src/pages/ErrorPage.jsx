import React from "react";
import ErrorImg from "../assets/images/not-found.png";

const ErrorPage = () => {
  return (
    <>
      <div className="container mt-5 error-container">
        <img src={ErrorImg} alt="error-img" className="error-404" />
      </div>
    </>
  );
};

export default ErrorPage;
