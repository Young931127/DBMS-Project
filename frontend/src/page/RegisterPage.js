import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/userApi";
import Registerbtn from "../components/Registerbtn";
import Swal from "sweetalert2";
import "./RegisterPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [userIdError, setUserIdError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [phoneNumError, setPhoneNumError] = useState(false);

  const handleRegister = async () => {
    let hasError = false;
    setUsernameError(false);
    setUserIdError(false);
    setPasswordError(false);
    setPhoneNumError(false);

    if (!username) {
      setUsernameError("請填寫用戶名稱");
      hasError = true;
    }
    if (!user_id) {
      setUserIdError("請填寫學號");
      hasError = true;
    } else if (user_id.length !== 9) {
      setUserIdError("學號格式錯誤");
      hasError = true;
    }
    if (!password) {
      setPasswordError("請填寫密碼");
      hasError = true;
    } else if (!/^[a-zA-Z0-9]+$/.test(password)) {
      setPasswordError("密碼僅能包含英文或數字");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("密碼長度不足(英文+數字至少8碼)");
      hasError = true;
    } else if (password.length > 20) {
      setPasswordError("密碼長度過長");
      hasError = true;
    }
    if (!phoneNum) {
      setPhoneNumError("請填寫行動電話");
      hasError = true;
    } else if (phoneNum.length !== 10) {
      setPhoneNumError("行動電話格式錯誤");
      hasError = true;
    }
    if (hasError) return;

    try {
      await registerUser({ username, user_id, password, phoneNum });
      Swal.fire({
        icon: "success",
        title: "註冊成功",
        text: "請登入帳號",
        confirmButtonText: "重新登入",
        width: "300px",
        position: "center",
        backdrop: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Login"); // 跳轉到登入頁
        }
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.error || err.message;
      if (errorMsg === "用戶已註冊") {
        //setUserIdError("此學號已被註冊");
        Swal.fire({
          icon: "error",
          title: "註冊失敗",
          text: "用戶已註冊",
          confirmButtonText: "確認",
          width: "300px",
          position: "center",
          backdrop: false,
        });
      } else {
        setMessage(errorMsg || "發生錯誤，請稍後再試");
      }
    }
  };

  return (
    <div className="register">
      <div className="register-header">
        <div className="register-header-content">
          <Link to="/Login" className="register-back-link">
            <i
              class="bi bi-arrow-left-circle-fill"
              style={{ color: "#24366e" }}
            ></i>
          </Link>
        </div>
      </div>

      <div className="signup-content">
        <label className="title">創建帳號</label>

        <div className="register-input-group">
          <label htmlFor="username">使用者名稱</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              id="username"
              placeholder="請輸入使用者名稱"
              onChange={(e) => setUsername(e.target.value)}
              className={usernameError ? "error" : ""}
            />
          </div>
          <div
            className={`register-error-text ${usernameError ? "" : "hidden"}`}
          >
            {usernameError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="register-input-group">
          <label htmlFor="stu_id">帳號</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              id="stu_id"
              placeholder="請輸入學號"
              value={user_id}
              onChange={(e) => setUserId(e.target.value)}
              className={userIdError ? "error" : ""}
            />
          </div>
          <div className={`register-error-text ${userIdError ? "" : "hidden"}`}>
            {userIdError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="register-input-group">
          <label htmlFor="password">密碼</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              id="password"
              placeholder="請輸入密碼"
              onChange={(e) => {
                // 只允許輸入英文或數字
                const value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                setPassword(value);
              }}
              pattern="[a-zA-Z0-9]+"
              className={passwordError ? "error" : ""}
            />
          </div>
          <div
            className={`register-error-text ${passwordError ? "" : "hidden"}`}
          >
            {passwordError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>
        <div className="register-input-group">
          <label htmlFor="phoneNum">行動電話</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="tel"
              id="phoneNum"
              placeholder="請輸入行動電話"
              onChange={(e) => setPhoneNum(e.target.value)}
              className={phoneNumError ? "error" : ""}
            />
          </div>
          <div
            className={`register-error-text ${phoneNumError ? "" : "hidden"}`}
          >
            {phoneNumError || "\u00A0" /* 空白保持高度 */}
          </div>
        </div>

        <Registerbtn onClick={handleRegister} />
      </div>
    </div>
  );
}

export default RegisterPage;
