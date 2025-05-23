import React from "react";
import { useNavigate } from "react-router-dom";
import "./Button.css";

const Postbtn = () => {
  //發布按鈕操作邏輯發布按鈕操作邏輯
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate("/PostPage");
  };
  
  return (
    <button className="post-btn" onClick={handlePostClick}>
      <i class="bi bi-file-earmark-plus" style={{ marginRight: "5px" }}></i>發布任務
    </button>
  );
};

export default Postbtn;
