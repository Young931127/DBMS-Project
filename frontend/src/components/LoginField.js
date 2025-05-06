import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginField.css";

const LoginField = ({ onLogin }) => {
  const [username, setUsername] = useState(""); //定義狀態變數userid，setuserid用來更新狀態變數，useState("")表示初始為空字串
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //登入處理
  const handleLogin = () => {
    
    //發送API到後端進行驗證

    //按下登入後跳轉到主畫面
    navigate("/HomePage"); 
    
  };

  const handleRegister = ()=>{

  };

  return (
    <div className="login-container">
      <h1 className="header">登入</h1>
      
      <div className="form-content">
        <div className="input-group">
          <label htmlFor="username"> 帳號</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} //當輸入框的值改變時，更新狀態值
            placeholder="請輸入學號"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">密碼</label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
          />
        </div>
        <button className="login-btn" onClick={handleLogin}>
          登入
        </button>
        <div className ="divider">首次加入請先註冊</div>
        <button className ="register-btn" onClick={handleRegister}> 
          註冊
        </button>
      </div>
    </div>
  );
};

export default LoginField;
