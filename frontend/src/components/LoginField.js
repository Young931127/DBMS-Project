import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/loginApi";
import "./LoginField.css";

const LoginField = () => {
  const [userid, setUserid] = useState(""); //定義狀態變數userid，setuserid用來更新狀態變數，useState("")表示初始為空字串
  const [password, setPassword] = useState("");
  const [useridError, setUseridError] = useState(false);
  const [passwordError, setPasswordError] = useState(false); //定義狀態變數passwordError，setpasswordError用來更新狀態變數，useState(false)表示初始為false
  const [showPassword, setShowPassword] = useState(true); //定義狀態變數showPassword，setshowPassword用來更新狀態變數，useState(false)表示初始為false
  const navigate = useNavigate();

  //登入處理
  const handleLogin = async () => {
    let hasError = false;
    setUseridError(false);
    setPasswordError(false);
    //檢查帳號密碼是否為空
    if (!userid) {
      setUseridError("請輸入學號");
      hasError = true;
    }
    if (!password) {
      setPasswordError("請輸入密碼");
      hasError = true;
    }
    if (hasError) return;
    //發送API到後端進行驗證
    try {
      await login(userid, password);
      navigate("/HomePage");
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">登入</h1>

      <div className="form-content">
        <div className="login-input-group">
          <label htmlFor="stu_id"> 帳號</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              id="stu_id"
              value={userid}
              onChange={(e) => setUserid(e.target.value)} //當輸入框的值改變時，更新狀態值
              placeholder="請輸入學號"
              maxLength={9}
              pattern="\d{9}"
              className={useridError ? "error" : ""}//如果useridError為true，則渲染下面錯誤樣式
            />
          </div>
          <div className={`error-text ${useridError ? "" : "hidden"}`}>
            {useridError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="login-input-group">
          <label htmlFor="password">密碼</label>
          <div className="input-wrapper">
            <input
              type={showPassword ? "password" : "text"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              className={passwordError ? "error" : ""}
            />
            <i
              className={`bi ${
                showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
              } eye-icon`}
              onClick={() => setShowPassword((showPassword) => !showPassword)} //當點擊眼睛圖示時，顯示或隱藏密碼
            ></i>
          </div>
          <div className={`error-text ${passwordError ? "" : "hidden"}`}>
            {passwordError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          登入
        </button>
        <div className="divider">首次加入請先註冊</div>
        <Link to="/RegisterPage" className="register-link">
          點擊此處前往註冊
        </Link>
      </div>
    </div>
  );
};

export default LoginField;
