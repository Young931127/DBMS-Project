import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Registerbtn from "../components/Registerbtn";
import "./RegisterPage.css";
import { registerUser } from "../api/userApi";
import Swal from "sweetalert2";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ username, user_id, password, phoneNum });
      Swal.fire({
        icon: "success",
        title: "註冊成功",
        text: "請登入帳號",
        confirmButtonText: "重新登入",
        width: "300px",
        position: "center",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Login"); // 跳轉到登入頁
        }
      });

      // 可以在這裡處理註冊成功的邏輯，例如跳轉到登入頁面
    } catch (err) {
      setMessage(err.message);
      console.log(err);
    }
  };

  return (
    <div className="register">
      <div className="signup-container">
        <Link to="/Login" className="back-link">
          <i class="bi bi-arrow-left-circle-fill"></i>
        </Link>
        <h1 className="signup-header">創建帳號</h1>

        <div className="register-input-group">
          <label htmlFor="username">使用者名稱</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              id="username"
              placeholder="請輸入使用者名稱"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="register-input-group">
          <label htmlFor="stu_id">帳號</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="number"
              id="stu_id"
              placeholder="請輸入學號"
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        </div>
        <div className="register-input-group">
          <label htmlFor="password">密碼</label>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <input
              type="text"
              id="password"
              placeholder="請輸入密碼"
              onChange={(e) => setPassword(e.target.value)}
            />
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
            />
          </div>
        </div>

        <Registerbtn onClick={handleRegister} />
      </div>
    </div>
  );
}

export default RegisterPage;
