import React from "react";
import "./Button.css";

const Postbtn = () => {
  //發布按鈕操作邏輯發布按鈕操作邏輯
  const handlePostClick = () => {
    console.log("Post button clicked!");
    alert("發布成功!");
  };
  return (
    <button className="post-btn" onClick={handlePostClick}>
      發布任務
    </button>
  );
};

export default Postbtn;
