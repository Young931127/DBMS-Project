import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Postbtn from "../components/Postbtn";
import TaskSwitcher from "../components/TaskSwitcher";
import "./HomePage.css";
import { fetchTopTasks, fetchNormalTasks } from "../api/taskApi";

function HomePage() {
  const [topTasks, setTopTasks] = useState([]);
  const [normalTasks, setNormalTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 控制側欄開關
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 控制下拉選單開關
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // 切換側欄狀態
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // 切換下拉選單狀態
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // 點擊後關閉側欄
  };

  const handleOverlayClick = (e) => {
    // 如果點擊的區域不是側欄，則關閉側欄
    if (!e.target.closest(".sidebar")) {
      setIsOpen(false);
    }
  };

  //useEffect 獲取資料
  useEffect(() => {
    //調用fetchTopTasks和fetchNormalTasks API 函數
    const loadTasks = async () => {
      try {
        const topData = await fetchTopTasks();
        const normalData = await fetchNormalTasks();
        console.log("Top Tasks:", topData.data); // 檢查返回的資料
        console.log("Normal Tasks:", normalData.data); // 檢查返回的資料
        setTopTasks(topData.data);
        setNormalTasks(normalData.data);
        setLoading(false); //加載完成
      } catch (err) {
        setError(err);
        setLoading(false); //停止加載
      }
    };

    loadTasks();
  }, []);

  if (loading) return <div>加載中...</div>;
  if (error) return <div>錯誤：{error.message}</div>;

  return (
    <div className="homepage">
      {isOpen && <div className="overlay" onClick={handleOverlayClick}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <ul>
            <li onClick={() => handleNavigation("/profile")} style={{ padding: "0" , marginTop: "13px", borderBottom: "1px solid #000000"}}>
              <i class="bi bi-person-circle" style={{ fontSize: "45px" }}></i>
            </li>

            <li style={{ padding: "0", marginTop: "15px" }}>
              <div className="dropdown-header" onClick={toggleDropdown}>
                <i class="bi bi-flag-fill" style={{ fontSize: "20px", marginRight: "5px" }}></i> 所有任務
                <span className={`arrow ${isDropdownOpen ? "open" : ""}`}>
                  {isDropdownOpen ? "▲" : "▼"}
                </span>
              </div>
              <ul className="dropdown-menu">
                <li onClick={() => handleNavigation("/ProgressingTask")}>
                  進行中任務
                </li>
                <li onClick={() => handleNavigation("/WaitingTask")}>
                  等待中任務
                </li>
                <li onClick={() => handleNavigation("/FinishedTask")}>
                  已完成任務
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="homepage-header-container">
        <div className="homepage-header-content">
          <i className="bi bi-list-ul menu-icon" onClick={toggleSidebar}></i>

          <InputField />
        </div>
      </div>
      <div className="main-content">
        <TaskSwitcher topTasks={topTasks} normalTasks={normalTasks} />
      </div>
      <div className="homepage-footer-container">
        <div className="homepage-footer-content">
          <Postbtn />
        </div>
      </div>
    </div>
  );
}
export default HomePage;
