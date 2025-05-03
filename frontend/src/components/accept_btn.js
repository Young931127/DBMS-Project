import React from "react";
import "./Button.css"; 
const AcceptBtn = ({onClick}) => {
    return (
        <button className  ="accept-btn" onClick={onClick}>
            接受任務
        </button>
    );
};

export default AcceptBtn;