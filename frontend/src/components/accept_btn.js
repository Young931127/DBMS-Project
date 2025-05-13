import React from "react";
import "./Button.css";

const AcceptBtn = ({ onClick }) => {
  //接受任務按鈕操作邏輯
  const handleAcceptClick = () => {};

  return (
    <button className="accept-btn" onClick={handleAcceptClick}>
      接受任務
    </button>
  );
};

export default AcceptBtn;
