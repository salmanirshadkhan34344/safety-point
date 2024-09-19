import React from "react";
import Toast from "react-bootstrap/Toast";
import "./CustomSnackBar.css";

const CustomSnackBar = ({ snackInfoPro, closeSnackPro }) => {
  return (
    <>
      <Toast
        onClose={() => closeSnackPro()}
        className={`toast-updated ${snackInfoPro.snackColor}`}
        show={snackInfoPro.snackStatus}
        delay={3000}
        autohide
      >
        <Toast.Body className="text-white text-left">
          {snackInfoPro.snackMsg}
        </Toast.Body>
      </Toast>
    </>
  );
};

export default CustomSnackBar;
