import React, {useState} from "react";
import "./login.css";
import {loginApi} from "../api/loginApi";

function Login() {
  return (
    <div className="login-container">
      <h1>登入</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">電子郵件</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="輸入電子郵件"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="輸入密碼"
            required
          />
        </div>
        <button type="submit" className="login-button">
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
