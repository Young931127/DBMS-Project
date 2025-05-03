import React from "react";
import "./Button.css"; 
const PostBtn = ({onClick}) => {
    return (
        <button className  ="post-btn" onClick={onClick}>
            發布任務
        </button>
    );
};

export default PostBtn;
    