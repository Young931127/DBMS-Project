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
          &lt;返回
        </Link>
        <h1 className="signup-header">創建帳號</h1>

        <div className="input-group">
          <label htmlFor="username">使用者名稱</label>
          <input
            type="text"
            id="username"
            placeholder="請輸入使用者名稱"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="stu_id">帳號</label>
          <input
            type="number"
            id="stu_id"
            placeholder="請輸入學號"
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            placeholder="請輸入密碼"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="phoneNum">連絡電話</label>
          <input
            type="tel"
            id="phoneNum"
            placeholder="請輸入連絡電話"
            onChange={(e) => setPhoneNum(e.target.value)}
          />
        </div>

        <Registerbtn onClick={handleRegister} />
      </div>
    </div>
  );
}

export default RegisterPage;
