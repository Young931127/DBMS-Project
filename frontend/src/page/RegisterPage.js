import { Link } from "react-router-dom";
import Registerbtn from "../components/Registerbtn";
import "./RegisterPage.css";

function RegisterPage() {
  return (
    <div className="register">
      <Link to="/Login" className="back-link">
        &lt;Back
      </Link>
      <div className="main-container">
        <h1 className="header">創建帳號</h1>

        <div className="input-group">
          <label htmlFor="username">使用者名稱</label>
          <input type="text" id="username" placeholder="請輸入使用者名稱" />
        </div>
        <div className="input-group">
          <label htmlFor="stu_id">帳號</label>
          <input type="number" id="stu_id" placeholder="請輸入學號" />
        </div>
        <div className="input-group">
          <label htmlFor="password">密碼</label>
          <input type="password" id="password" placeholder="請輸入密碼" />
        </div>
        <Registerbtn />
      </div>
    </div>
  );
}

export default RegisterPage;
