import React from "react";
import "./Button.css";

const Registerbtn = ({ onClick }) => {
  return (
    <button className="register-btn" onClick={onClick}>
      註冊
    </button>
  );
};

export default Registerbtn;